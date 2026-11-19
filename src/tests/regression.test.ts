/**
 * AI Farm Hub — Automated Regression Test Suite
 * Tests Phase 0.5 Defect Closures:
 * 1. Confirmation & Verification Semantics & Provenance
 * 2. Profile & Preference Storage Resilience
 * 3. Reset All & Partial Failure Semantics
 * 4. Multilingual Dictionary Parity (Telugu, English, Hindi)
 * 5. Deterministic Voice Extraction & Anti-Invention Rules
 */

import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Mock browser localStorage for Node test runner
class MockLocalStorage {
  private store = new Map<string, string>();
  public shouldFail = false;
  public failKeys = new Set<string>();
  public quotaFailKeys = new Set<string>();

  getItem(key: string): string | null {
    if (this.shouldFail || this.failKeys.has(key)) {
      throw new Error('Simulated Storage Failure');
    }
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string): void {
    if (this.quotaFailKeys.has(key)) {
      const err: any = new Error('Simulated QuotaExceededError');
      err.name = 'QuotaExceededError';
      err.code = 22;
      throw err;
    }
    if (this.shouldFail || this.failKeys.has(key)) {
      throw new Error('Simulated Storage Failure: QuotaExceededError');
    }
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    if (this.shouldFail || this.failKeys.has(key)) {
      throw new Error('Simulated Storage Failure: Cannot remove');
    }
    this.store.delete(key);
  }

  keys(): string[] {
    return Array.from(this.store.keys());
  }

  clear(): void {
    this.store.clear();
    this.shouldFail = false;
    this.failKeys.clear();
    this.quotaFailKeys.clear();
  }
}

const mockStorage = new MockLocalStorage();
(global as any).localStorage = mockStorage;
(global as any).window = { localStorage: mockStorage };

// Import system under test
import { ActivityStorageService } from '../services/activityStorage';
import { VoiceExtractorService, getLocalDateString } from '../services/voiceExtractor';
import { FarmEvent, Plot, CropCycle } from '../types/farm';
import { migratePreferences } from '../types/profile';
import { INITIAL_FARMER_PREFERENCES, INITIAL_FARMER_PROFILE } from '../data/mockProfileData';
import {
  TRANSLATIONS,
  getTranslations,
  resolveTranslationWithFallback,
  collectTranslationKeyPaths,
  auditTranslationCoverage,
} from '../i18n/translations';
import {
  calculateFarmSummary,
  convertQuintalsToKilograms,
  evaluateEvidenceVerificationSupport,
  filterFarmEvents,
  formatUnitLabel,
  formatYieldDisplay,
  getLocalizedStorageError,
  hasExpectedHarvestPassedWithoutActual,
  normalizeEventProvenance,
  sanitizeEventConfidence,
  validateCropCycleState,
  validateCropStageTransition,
  validateCycleStatusTransition,
  validateFarmAreaBaseline,
} from '../utils/farmSummary';
import {
  DEMO_FARM,
  DEMO_PLOTS,
  DEMO_CROP_CYCLES,
  INITIAL_DEMO_EVENTS,
} from '../data/mockFarmData';
import {
  QA_FIXTURE_DEMO_WITH_COST,
  QA_FIXTURE_DEMO_ESTIMATE,
  QA_FIXTURE_REAL_ACTUAL_COST,
  QA_FIXTURE_REAL_ESTIMATED_COST,
  QA_FIXTURE_REAL_VOICE_PENDING,
  QA_FIXTURE_PLOT_B_REAL,
  QA_FIXTURE_REAL_UNKNOWN_FIELDS,
  QA_FIXTURE_GPS_OVERCLAIM,
  QA_FIXTURE_RECEIPT_OVERCLAIM,
  QA_FIXTURE_WEATHER_OVERCLAIM,
  QA_FIXTURE_PHOTO_OVERCLAIM,
  QA_FIXTURE_REAL_HARVEST,
  QA_MIXED_DATASET,
} from './qaFixtures';

describe('Defect 1: Confirmation, Verification, and Provenance Semantics', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  test('confirmRecord preserves original source and does not artificially elevate verificationStatus', () => {
    const rawAiEvent: FarmEvent = {
      eventId: 'REC-TEST-01',
      eventType: 'fertilizer',
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      plotId: 'plot-a',
      plotName: 'Plot A — Paddy',
      cropName: 'Paddy',
      activityDate: '2026-10-09',
      recordedDate: new Date().toISOString(),
      title: 'Fertilizer application (Urea)',
      quantity: 50,
      unit: 'kg',
      areaCoveredAcres: 2.0,
      currency: 'INR',
      source: 'ai_extracted', // Original capture source
      originalSource: 'ai_extracted',
      status: 'pending_confirmation',
      verificationStatus: 'pending', // Independent verification
      isDemo: false,
      evidence: { type: 'none' },
      createdBy: 'Ravi Kumar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saveResult = ActivityStorageService.saveRecord(rawAiEvent);
    assert.equal(saveResult.success, true);

    // Act: Farmer confirms record
    const confirmResult = ActivityStorageService.confirmRecord('REC-TEST-01', 'Ravi Kumar');
    assert.equal(confirmResult.success, true);
    assert.ok(confirmResult.data);

    // Assert: status changes to farmer_confirmed, BUT source remains ai_extracted!
    assert.equal(confirmResult.data.status, 'farmer_confirmed');
    assert.equal(confirmResult.data.source, 'ai_extracted', 'Capture source must NOT be replaced with confirmation status');
    assert.equal(confirmResult.data.verificationStatus, 'pending', 'Farmer confirmation must not elevate third-party verification to confirmed');
    assert.equal(confirmResult.data.confirmedBy, 'Ravi Kumar');
    assert.ok(confirmResult.data.confirmedAt);
  });

  test('updateRecord maintains immutable correction history without discarding prior revisions', () => {
    const initialEvent: FarmEvent = {
      eventId: 'REC-TEST-02',
      eventType: 'irrigation',
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      plotId: 'plot-a',
      plotName: 'Plot A — Paddy',
      cropName: 'Paddy',
      activityDate: '2026-10-09',
      recordedDate: new Date().toISOString(),
      title: 'Canal irrigation',
      quantity: 3,
      unit: 'hours',
      areaCoveredAcres: 2.0,
      currency: 'INR',
      source: 'farmer_reported',
      status: 'pending_confirmation',
      verificationStatus: 'pending',
      isDemo: false,
      evidence: { type: 'none' },
      createdBy: 'Ravi Kumar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ActivityStorageService.saveRecord(initialEvent);

    // Edit 1: change quantity from 3 to 4 hours
    const edit1 = ActivityStorageService.updateRecord('REC-TEST-02', { quantity: 4 }, 'Corrected meter reading');
    assert.equal(edit1.success, true);
    assert.equal(edit1.data?.correctionHistory?.length, 1);
    assert.equal(edit1.data?.correctionHistory?.[0].field, 'quantity');
    assert.equal(edit1.data?.correctionHistory?.[0].oldValue, 3);
    assert.equal(edit1.data?.correctionHistory?.[0].newValue, 4);

    // Edit 2: change title
    const edit2 = ActivityStorageService.updateRecord('REC-TEST-02', { title: 'Borewell & canal irrigation' }, 'Specified source');
    assert.equal(edit2.success, true);
    assert.equal(edit2.data?.correctionHistory?.length, 2);
    assert.equal(edit2.data?.correctionHistory?.[1].field, 'title');
  });

  test('cannot delete baseline demo records', () => {
    // Attempting to delete a non-user record returns error
    const delResult = ActivityStorageService.deleteRecord('DEMO-EVT-01');
    assert.equal(delResult.success, false);
    assert.equal(delResult.code, 'NOT_FOUND');
  });
});

describe('Defect 2 & 3: Reset Semantics and Error Handling', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  test('resetAllFarmerRecords completely clears farmer records on success', () => {
    const testEvt: FarmEvent = {
      eventId: 'REC-CLEAR-01',
      eventType: 'weeding',
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      plotId: 'plot-b',
      plotName: 'Plot B — Groundnut',
      cropName: 'Groundnut',
      activityDate: '2026-10-09',
      recordedDate: new Date().toISOString(),
      title: 'Manual interculture',
      currency: 'INR',
      source: 'farmer_reported',
      status: 'pending_confirmation',
      verificationStatus: 'pending',
      isDemo: false,
      evidence: { type: 'none' },
      createdBy: 'Ravi Kumar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ActivityStorageService.saveRecord(testEvt);
    const beforeCount = ActivityStorageService.loadFarmerRecords().data.length;
    assert.equal(beforeCount, 1);

    const resetRes = ActivityStorageService.resetAllFarmerRecords();
    assert.equal(resetRes.success, true);
    assert.equal(ActivityStorageService.loadFarmerRecords().data.length, 0);
  });

  test('resetAllFarmerRecords reports explicit error on storage failure', () => {
    mockStorage.shouldFail = true;
    const resetRes = ActivityStorageService.resetAllFarmerRecords();
    assert.equal(resetRes.success, false);
    assert.ok(resetRes.error);
    mockStorage.shouldFail = false;
  });
});

describe('Defect 4: Multilingual Translation Dictionary Completeness', () => {
  const languages: ('Telugu' | 'English' | 'Hindi')[] = ['Telugu', 'English', 'Hindi'];

  test('all required dictionary sections exist in Telugu, English, and Hindi', () => {
    languages.forEach((lang) => {
      const dict = TRANSLATIONS[lang];
      assert.ok(dict, `Dictionary for ${lang} must exist`);
      assert.ok(dict.nav, `Nav section must exist in ${lang}`);
      assert.ok(dict.home, `Home section must exist in ${lang}`);
      assert.ok(dict.myFarm, `MyFarm section must exist in ${lang}`);
      assert.ok(dict.record, `Record section must exist in ${lang}`);
      assert.ok(dict.insights, `Insights section must exist in ${lang}`);
      assert.ok(dict.market, `Market section must exist in ${lang}`);
      assert.ok(dict.timeline, `Timeline section must exist in ${lang}`);
      assert.ok(dict.preferencesModal, `PreferencesModal section must exist in ${lang}`);
      assert.ok(dict.resetModal, `ResetModal section must exist in ${lang}`);
      assert.ok(dict.sync, `Sync section must exist in ${lang}`);
    });
  });

  test('preferencesModal has full coverage for profile labels across all 3 languages', () => {
    languages.forEach((lang) => {
      const p = TRANSLATIONS[lang].preferencesModal;
      assert.ok(p.fullNameLabel, `fullNameLabel missing in ${lang}`);
      assert.ok(p.preferredNameLabel, `preferredNameLabel missing in ${lang}`);
      assert.ok(p.roleLabel, `roleLabel missing in ${lang}`);
      assert.ok(p.experienceYearsLabel, `experienceYearsLabel missing in ${lang}`);
      assert.ok(p.digitalComfortLabel, `digitalComfortLabel missing in ${lang}`);
      assert.ok(p.villageLabel, `villageLabel missing in ${lang}`);
      assert.ok(p.districtLabel, `districtLabel missing in ${lang}`);
      assert.ok(p.stateLabel, `stateLabel missing in ${lang}`);
      assert.ok(p.countryLabel, `countryLabel missing in ${lang}`);
      assert.ok(p.demoNotice, `demoNotice missing in ${lang}`);
    });
  });

  test('sampleInsight strings exist across Telugu, English, and Hindi', () => {
    languages.forEach((lang) => {
      const ins = TRANSLATIONS[lang].insights;
      assert.ok(ins.sampleInsightTitle, `sampleInsightTitle missing in ${lang}`);
      assert.ok(ins.sampleInsightDetail, `sampleInsightDetail missing in ${lang}`);
      assert.ok(ins.sampleInsightRecommendation, `sampleInsightRecommendation missing in ${lang}`);
    });
  });
});

describe('Defect 5: Deterministic Voice Extraction & Anti-Invention Rules', () => {
  test('returns local timezone calendar date format YYYY-MM-DD', () => {
    const local = getLocalDateString(new Date());
    assert.match(local, /^\d{4}-\d{2}-\d{2}$/);
  });

  test('never invents specific chemical name if farmer only says "fertilizer"', () => {
    // Farmer says "రెండు ఎకరాలలో ఎరువు వేశాను" (Applied fertilizer on 2 acres)
    const draft = VoiceExtractorService.extractFromTranscript('రెండు ఎకరాలలో ఎరువు వేశాను');
    assert.equal(draft.eventType, 'fertilizer');
    assert.equal(draft.fertilizerName, null, 'Must NOT assume Urea or DAP when not spoken');
    assert.ok(draft.needsClarification?.some((n) => n.field === 'fertilizerName'));
  });

  test('correctly identifies Urea when explicitly spoken', () => {
    const draft = VoiceExtractorService.extractFromTranscript('ప్లాట్ A లో 50 కిలోల యూరియా వేశాను');
    assert.equal(draft.eventType, 'fertilizer');
    assert.equal(draft.fertilizerName, 'Urea');
    assert.equal(draft.quantity, 50);
    assert.equal(draft.unit, 'kg');
    assert.equal(draft.plotId, 'plot-a');
  });

  test('flags date as application-assigned when not spoken in audio', () => {
    const draft = VoiceExtractorService.extractFromTranscript('వరి పొలంలో నీళ్లు పెట్టాను');
    assert.equal(draft.isDateAssigned, true, 'isDateAssigned must be true when date is not in transcript');
    assert.ok(draft.needsClarification?.some((n) => n.field === 'activityDate'));
  });

  test('detects spoken "yesterday" or "నిన్న" without assigning today', () => {
    const draft = VoiceExtractorService.extractFromTranscript('నిన్న వరి పొలంలో నీళ్లు పెట్టాను');
    assert.equal(draft.isDateAssigned, false, 'isDateAssigned must be false when date was spoken');
  });

  test('handles correction phrases deterministically ("40 కాదు, 20 కిలోలు")', () => {
    const draft = VoiceExtractorService.extractFromTranscript('40 కాదు, 20 కిలోలు యూరియా');
    assert.equal(draft.isCorrection, true);
    assert.equal(draft.quantity, 20, 'Should adopt the corrected quantity');
  });

  test('engine is explicitly marked as rule_based (never claiming to be generative AI)', () => {
    const draft = VoiceExtractorService.extractFromTranscript('ప్లాట్ బి లో విత్తనాలు నాటాము');
    assert.equal(draft.extractionEngine, 'rule_based');
  });
});

describe('Phase 2: Farm Memory, Activity Timeline, and Evidence Model', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  test('persisting and reloading a complete FarmEvent preserves separated provenance, cost, and evidence fields without inflating verificationStatus', () => {
    const saveRes = ActivityStorageService.saveRecord(QA_FIXTURE_REAL_ACTUAL_COST);
    assert.equal(saveRes.success, true);

    // Reload from actual storage path
    const reloaded = ActivityStorageService.loadFarmerRecords();
    assert.equal(reloaded.success, true);
    assert.equal(reloaded.data.length, 1);

    const stored = reloaded.data[0];
    assert.equal(stored.activityDate, '2026-06-28');
    assert.equal(stored.plotId, 'plot-a');
    assert.equal(stored.cropName, 'Paddy');
    assert.equal(stored.eventType, 'fertilizer');
    assert.equal(stored.inputName, 'Neem Coated Urea');
    assert.equal(stored.quantity, 50);
    assert.equal(stored.unit, 'kg');
    assert.equal(stored.areaCoveredAcres, 2.0);
    assert.equal(stored.cost, 540);
    assert.equal(stored.costType, 'actual');
    assert.equal(stored.evidence.type, 'receipt');
    assert.equal(stored.activitySource, 'manual_entry');
    assert.equal(stored.evidenceType, 'receipt');
    assert.equal(stored.status, 'farmer_confirmed');
    assert.equal(stored.confirmationStatus, 'confirmed');
    assert.equal(stored.verificationStatus, 'unverified', 'Receipt-backed fertilizer application must remain unverified independently');
    assert.equal(stored.confidence, undefined, 'Manual entry must not carry an invented confidence score');

    // Feed reloaded records + demo baseline into production summary engine
    const allReloaded = ActivityStorageService.loadAllRecords();
    assert.equal(allReloaded.success, true);
    const summary = calculateFarmSummary(allReloaded.data);
    assert.equal(summary.realExpenditure, 540);
    assert.equal(summary.realConfirmedCount, 1);
  });

  test('evidence model supports all 8 specified labels across Telugu, English, and Hindi', () => {
    const requiredLabels: (
      | 'farmer_reported'
      | 'farmer_confirmed'
      | 'ai_extracted'
      | 'ai_estimated'
      | 'receipt_verified'
      | 'gps_captured'
      | 'weather_data'
      | 'soil_report'
    )[] = [
      'farmer_reported',
      'farmer_confirmed',
      'ai_extracted',
      'ai_estimated',
      'receipt_verified',
      'gps_captured',
      'weather_data',
      'soil_report',
    ];

    const languages: ('Telugu' | 'English' | 'Hindi')[] = ['Telugu', 'English', 'Hindi'];

    languages.forEach((lang) => {
      const srcDict = TRANSLATIONS[lang].sources;
      requiredLabels.forEach((label) => {
        assert.ok(
          srcDict[label],
          `Evidence model label '${label}' must exist in ${lang}`
        );
        assert.ok(
          srcDict[label].length > 0,
          `Evidence model label '${label}' must not be empty in ${lang}`
        );
      });
    });
  });

  test('strict safeguard: AI estimates are never presented as facts and carry no invented confidence', () => {
    const estimatedEvent: FarmEvent = {
      eventId: 'EST-TEST-01',
      activityDate: '2026-07-20',
      plotId: 'plot-a',
      plotName: 'Plot A — Paddy',
      cropName: 'Paddy',
      eventType: 'fertilizer',
      inputName: 'MOP Potash guideline',
      quantity: 20,
      unit: 'kg',
      areaCoveredAcres: 2.0,
      currency: 'INR',
      source: 'ai_estimated', // AI estimated source
      isEstimate: true, // Flagged explicitly
      estimateRationale: 'Unvalidated synthetic demo placeholder only; soil test data unavailable.',
      status: 'estimated', // Not confirmed
      verificationStatus: 'estimated',
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      recordedDate: '2026-07-20T09:00:00Z',
      title: 'Unverified Demo Nutrient Estimate (Potash Placeholder)',
      isDemo: true,
      evidence: { type: 'none' },
      createdBy: 'AI Advisory Engine',
      createdAt: '2026-07-20T09:00:00Z',
      updatedAt: '2026-07-20T09:00:00Z',
    };

    assert.equal(estimatedEvent.isEstimate, true, 'Estimated flag must be true');
    assert.notEqual(estimatedEvent.status, 'farmer_confirmed', 'Estimates must NOT be marked as farmer_confirmed');
    assert.notEqual(estimatedEvent.verificationStatus, 'confirmed', 'Estimates must NOT be marked as confirmed');
    assert.equal(estimatedEvent.confidence, undefined, 'Estimates without a documented calibrated source must not carry invented confidence');

    // Translation disclaimers exist in all languages
    (['Telugu', 'English', 'Hindi'] as const).forEach((lang) => {
      assert.ok(TRANSLATIONS[lang].timeline.notFactDisclaimer, `notFactDisclaimer missing in ${lang}`);
      assert.ok(TRANSLATIONS[lang].timeline.estimateNotice, `estimateNotice missing in ${lang}`);
    });
  });

  test('farmer can open crop cycle and retrieve full chronological memory ("What have I done on this crop so far?")', () => {
    // Load all records including initial crop memory
    const loadResult = ActivityStorageService.loadAllRecords();
    assert.equal(loadResult.success, true);

    const padEvents = loadResult.data.filter((e) => e.plotId === 'plot-a' && e.activityDate !== null);
    
    // Sort chronologically
    const chronological = padEvents.sort((a, b) => (a.activityDate! > b.activityDate! ? 1 : -1));
    assert.ok(chronological.length >= 6, 'Must contain full crop cycle events (Sowing, Irrigation, Fertilizer, Pest, Spray, Harvest)');

    // Verify key operations from prompt example:
    const sowing = chronological.find((e) => e.eventType === 'sowing');
    assert.ok(sowing, 'Must have Sowing activity');
    assert.equal(sowing?.activityDate, '2026-06-10');
    assert.equal(sowing?.areaCoveredAcres, 2.0);

    const irrigation = chronological.find((e) => e.eventType === 'irrigation');
    assert.ok(irrigation, 'Must have Irrigation activity');
    assert.equal(irrigation?.activityDate, '2026-06-18');

    const fertilizer = chronological.find((e) => e.eventType === 'fertilizer' && !e.isEstimate);
    assert.ok(fertilizer, 'Must have Fertilizer activity');
    assert.equal(fertilizer?.activityDate, '2026-06-25');
    assert.equal(fertilizer?.quantity, 40);
    assert.equal(fertilizer?.unit, 'kg');

    const pest = chronological.find((e) => e.eventType === 'pest_scouting');
    assert.ok(pest, 'Must have Pest observation activity');
    assert.equal(pest?.activityDate, '2026-07-02');

    const spray = chronological.find((e) => e.eventType === 'spray');
    assert.ok(spray, 'Must have Pesticide activity');
    assert.equal(spray?.activityDate, '2026-07-03');
    assert.equal(spray?.areaCoveredAcres, 2.0);

    const harvest = chronological.find((e) => e.eventType === 'harvest');
    assert.ok(harvest, 'Must have Harvest activity');
    assert.equal(harvest?.activityDate, '2026-08-20');
    assert.equal(harvest?.quantity, 1850);
  });
});

describe('Fix P0: Demo Data Boundary & Summary Calculations', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  test('a. A demo event with a cost does not increase real expenditure (alone or mixed with real records)', () => {
    const demoOnlySummary = calculateFarmSummary([QA_FIXTURE_DEMO_WITH_COST]);
    assert.equal(demoOnlySummary.realExpenditure, 0, 'Demo event must NOT increase real expenditure');
    assert.equal(demoOnlySummary.demoExpenditure, 1200, 'Demo expenditure must be tracked separately');
    assert.equal(demoOnlySummary.hasRealData, false);
    assert.equal(demoOnlySummary.hasDemoData, true);
    assert.equal(demoOnlySummary.isDemoModeOnly, true);

    const mixedSummary = calculateFarmSummary([
      QA_FIXTURE_DEMO_WITH_COST,
      QA_FIXTURE_REAL_ACTUAL_COST,
    ]);
    assert.equal(
      mixedSummary.realExpenditure,
      540,
      'Real expenditure must equal ONLY real non-estimated costs even when demo cost events are present'
    );
    assert.equal(mixedSummary.demoExpenditure, 1200);
    assert.equal(mixedSummary.isDemoModeOnly, false);
  });

  test('b. A real non-estimated event with an eligible cost is counted exactly once', () => {
    const summary = calculateFarmSummary([QA_FIXTURE_REAL_ACTUAL_COST]);
    assert.equal(summary.realExpenditure, 540, 'Real non-estimated cost must be counted exactly once');
    assert.equal(summary.demoExpenditure, 0, 'Real event must not be counted in demo expenditure');
    assert.equal(summary.realTotalEvents, 1);
    assert.equal(summary.realConfirmedCount, 1);
    assert.equal(summary.hasRealData, true);

    // Mixed dataset with 3 real actual-cost events (540 + 250 + 2400 = 3190), 1 real estimate (900), 1 unknown cost (null), plus demo costs (1200 + 650)
    const fullMixed = calculateFarmSummary(QA_MIXED_DATASET);
    assert.equal(fullMixed.realExpenditure, 540 + 250 + 2400, 'Each eligible real cost counted exactly once');
    assert.equal(fullMixed.demoExpenditure, 1200, 'Only non-estimated demo cost counted in demoExpenditure');
  });

  test('c. An estimated cost is excluded from actual expenditure, and demo estimates never contaminate real estimate totals', () => {
    const realEstOnly = calculateFarmSummary([QA_FIXTURE_REAL_ESTIMATED_COST]);
    assert.equal(realEstOnly.realExpenditure, 0, 'Estimated cost must be excluded from actual real expenditure');
    assert.equal(realEstOnly.realEstimatedCostTotal, 900);
    assert.equal(realEstOnly.realEstimatedEventsCount, 1);
    assert.equal(realEstOnly.estimatedCostTotal, 900);
    assert.equal(realEstOnly.estimatedEventsCount, 1);

    const mixedEstimates = calculateFarmSummary([
      QA_FIXTURE_REAL_ESTIMATED_COST,
      QA_FIXTURE_DEMO_ESTIMATE,
    ]);
    assert.equal(mixedEstimates.realExpenditure, 0);
    assert.equal(mixedEstimates.demoExpenditure, 0);
    assert.equal(mixedEstimates.realEstimatedEventsCount, 1, 'Demo estimate must not inflate realEstimatedEventsCount');
    assert.equal(mixedEstimates.realEstimatedCostTotal, 900, 'Demo estimate must not inflate realEstimatedCostTotal');
    assert.equal(mixedEstimates.demoEstimatedEventsCount, 1);
    assert.equal(mixedEstimates.demoEstimatedCostTotal, 650);
  });

  test('d. A demo event does not increase real confirmed-activity count, real evidence tally, or real harvest yield', () => {
    const summary = calculateFarmSummary([
      QA_FIXTURE_DEMO_WITH_COST,
      ...INITIAL_DEMO_EVENTS,
    ]);
    assert.equal(summary.realConfirmedCount, 0, 'Demo events must NOT increase realConfirmedCount');
    assert.equal(summary.realEvidenceTally.receipts, 0, 'Demo receipts must NOT increase realEvidenceTally');
    assert.equal(summary.realEvidenceTally.gps, 0, 'Demo GPS must NOT increase realEvidenceTally');
    assert.equal(summary.realHarvestYieldKg, 0, 'Demo harvest must NOT increase realHarvestYieldKg');
    assert.ok(summary.demoConfirmedCount >= 1);
    assert.ok(summary.demoEvidenceTally.receipts >= 1);
    assert.equal(summary.demoHarvestYieldKg, 1850);

    // Adding a real 15-quintal (1500 kg) harvest must track real yield strictly separately from 1850 kg demo harvest
    const mixedHarvest = calculateFarmSummary([
      QA_FIXTURE_REAL_HARVEST,
      ...INITIAL_DEMO_EVENTS,
    ]);
    assert.equal(mixedHarvest.realHarvestYieldKg, 1500);
    assert.equal(mixedHarvest.demoHarvestYieldKg, 1850);
  });

  test('e. Demo and real records are distinguishable and excludeDemo globally omits synthetic records', () => {
    INITIAL_DEMO_EVENTS.forEach((evt) => {
      assert.equal(evt.isDemo, true, `Seeded event ${evt.eventId} must have isDemo: true`);
    });

    const excluded = calculateFarmSummary(QA_MIXED_DATASET, { excludeDemo: true });
    assert.equal(excluded.demoTotalEvents, 0, 'excludeDemo must omit all demo events');
    assert.equal(excluded.demoExpenditure, 0);
    assert.equal(excluded.demoConfirmedCount, 0);
    assert.equal(excluded.hasDemoData, false);
    assert.equal(excluded.realTotalEvents, 5);
    assert.equal(excluded.activeVisibleCount, 5);
    assert.equal(excluded.estimatedEventsCount, 1, 'excludeDemo must exclude demo estimates from estimatedEventsCount');
    assert.equal(excluded.estimatedCostTotal, 900);
  });

  test('f. Production filterFarmEvents + calculateFarmSummary do not mutate stored records or double-count totals', () => {
    // Persist real records into actual storage
    ActivityStorageService.saveRecord(QA_FIXTURE_REAL_ACTUAL_COST);
    ActivityStorageService.saveRecord(QA_FIXTURE_REAL_VOICE_PENDING);
    ActivityStorageService.saveRecord(QA_FIXTURE_PLOT_B_REAL);
    ActivityStorageService.saveRecord(QA_FIXTURE_REAL_ESTIMATED_COST);

    const loaded = ActivityStorageService.loadAllRecords().data;
    const snapshotBefore = JSON.stringify(loaded);

    // Filter via production filterFarmEvents (same function FarmTimeline uses)
    const farmerOnly = filterFarmEvents(loaded, { category: 'farmer' });
    const plotAFarmer = filterFarmEvents(loaded, { category: 'farmer', plotId: 'plot-a' });
    const plotBFarmer = filterFarmEvents(loaded, { category: 'farmer', plotId: 'plot-b' });
    const demoOnly = filterFarmEvents(loaded, { category: 'demo' });
    const searchUrea = filterFarmEvents(loaded, { category: 'farmer', searchQuery: 'urea' });

    const summaryFarmerAll = calculateFarmSummary(farmerOnly);
    const summaryPlotA = calculateFarmSummary(plotAFarmer);
    const summaryPlotB = calculateFarmSummary(plotBFarmer);
    const summaryDemo = calculateFarmSummary(demoOnly);
    const summarySearchUrea = calculateFarmSummary(searchUrea);

    // Plot A real actual spend = 540 (Urea) + 250 (Voice irrigation); 900 estimate excluded
    assert.equal(summaryPlotA.realExpenditure, 790);
    // Plot B real actual spend = 2400 (Groundnut sowing)
    assert.equal(summaryPlotB.realExpenditure, 2400);
    // Combined equals exact sum without double-counting
    assert.equal(summaryFarmerAll.realExpenditure, summaryPlotA.realExpenditure + summaryPlotB.realExpenditure);
    assert.equal(summaryDemo.realExpenditure, 0);
    assert.equal(summarySearchUrea.realExpenditure, 540);

    // Underlying array and storage remain completely unmutated
    assert.equal(JSON.stringify(loaded), snapshotBefore, 'Filtering must NOT mutate input array');
    assert.equal(
      ActivityStorageService.loadFarmerRecords().data.length,
      4,
      'Filtering must NOT alter underlying persisted farmer records'
    );
  });
});

describe('Fix P0: Separation of Origin, Evidence, Confirmation, and Verification', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  test('a. Farmer confirmation does not change independent verification status and rejects confirming estimates or demo records', () => {
    ActivityStorageService.saveRecord(QA_FIXTURE_REAL_VOICE_PENDING);
    const confirmed = ActivityStorageService.confirmRecord(
      QA_FIXTURE_REAL_VOICE_PENDING.eventId,
      'Ravi Kumar'
    );

    assert.equal(confirmed.success, true);
    assert.equal(confirmed.data?.status, 'farmer_confirmed');
    assert.equal(confirmed.data?.confirmationStatus, 'confirmed');
    assert.equal(
      confirmed.data?.verificationStatus,
      'unverified',
      'Farmer confirmation MUST NOT alter independent verificationStatus'
    );

    // Estimates cannot be farmer-confirmed as real facts
    ActivityStorageService.saveRecord(QA_FIXTURE_REAL_ESTIMATED_COST);
    const estConfirm = ActivityStorageService.confirmRecord(
      QA_FIXTURE_REAL_ESTIMATED_COST.eventId,
      'Ravi Kumar'
    );
    assert.equal(estConfirm.success, false);
    assert.equal(estConfirm.code, 'INVALID_STATE');

    // Demo records cannot be confirmed in user storage
    const demoConfirm = ActivityStorageService.confirmRecord('DEMO-001', 'Ravi Kumar');
    assert.equal(demoConfirm.success, false);
    assert.equal(demoConfirm.code, 'NOT_FOUND');
  });

  test('b. Confirming or editing a record does not overwrite original reporting source or activitySource', () => {
    ActivityStorageService.saveRecord(QA_FIXTURE_REAL_VOICE_PENDING);
    const confirmed = ActivityStorageService.confirmRecord(
      QA_FIXTURE_REAL_VOICE_PENDING.eventId,
      'Ravi Kumar'
    );

    assert.equal(confirmed.success, true);
    assert.equal(confirmed.data?.originalSource, 'farmer_voice', 'originalSource must remain intact');
    assert.equal(confirmed.data?.source, 'ai_extracted', 'source must remain intact');
    assert.equal(confirmed.data?.activitySource, 'voice_input', 'activitySource must remain intact');

    // Attempted overwrite via updateRecord must still preserve original provenance and isDemo boundary
    const edited = ActivityStorageService.updateRecord(
      QA_FIXTURE_REAL_VOICE_PENDING.eventId,
      {
        title: 'Edited Irrigation Title',
        source: 'farmer_confirmed',
        originalSource: 'farmer_reported',
        isDemo: true,
      },
      'Title update'
    );
    assert.equal(edited.success, true);
    assert.equal(edited.data?.source, 'ai_extracted');
    assert.equal(edited.data?.originalSource, 'farmer_voice');
    assert.equal(edited.data?.activitySource, 'voice_input');
    assert.equal(edited.data?.isDemo, false);
  });

  test('c. GPS, weather, receipt, photograph, and manual entry do not independently verify field activities', () => {
    // Production rule evaluator checks
    assert.equal(evaluateEvidenceVerificationSupport('sowing', 'gps_observation').canIndependentlyVerify, false);
    assert.equal(evaluateEvidenceVerificationSupport('irrigation', 'gps_observation').canIndependentlyVerify, false);
    assert.equal(evaluateEvidenceVerificationSupport('spray', 'gps_observation').canIndependentlyVerify, false);
    assert.equal(evaluateEvidenceVerificationSupport('irrigation', 'weather_data').canIndependentlyVerify, false);
    assert.equal(evaluateEvidenceVerificationSupport('fertilizer', 'receipt').canIndependentlyVerify, false);
    assert.equal(evaluateEvidenceVerificationSupport('spray', 'receipt').canIndependentlyVerify, false);
    assert.equal(evaluateEvidenceVerificationSupport('spray', 'photograph').canIndependentlyVerify, false);
    assert.equal(evaluateEvidenceVerificationSupport('sowing', 'farmer_statement').canIndependentlyVerify, false);
    assert.equal(evaluateEvidenceVerificationSupport('sowing', 'none').canIndependentlyVerify, false);

    // Storage saveRecord enforces rules against unsupported verificationStatus: 'confirmed' over-claims
    const savedGps = ActivityStorageService.saveRecord(QA_FIXTURE_GPS_OVERCLAIM);
    assert.equal(savedGps.success, true);
    assert.equal(
      savedGps.data?.verificationStatus,
      'unverified',
      'GPS-only sowing claiming confirmed verification must be downgraded to unverified'
    );

    const savedReceipt = ActivityStorageService.saveRecord(QA_FIXTURE_RECEIPT_OVERCLAIM);
    assert.equal(savedReceipt.success, true);
    assert.equal(
      savedReceipt.data?.verificationStatus,
      'unverified',
      'Receipt-only fertilizer application claiming confirmed verification must be downgraded to unverified'
    );

    const savedWeather = ActivityStorageService.saveRecord(QA_FIXTURE_WEATHER_OVERCLAIM);
    assert.equal(savedWeather.success, true);
    assert.equal(
      savedWeather.data?.verificationStatus,
      'unverified',
      'Weather-only irrigation claiming confirmed verification must be downgraded to unverified'
    );

    const savedPhoto = ActivityStorageService.saveRecord(QA_FIXTURE_PHOTO_OVERCLAIM);
    assert.equal(savedPhoto.success, true);
    assert.equal(
      savedPhoto.data?.verificationStatus,
      'unverified',
      'Photo-only spray claiming confirmed verification must be downgraded to unverified'
    );

    // Seed data audit: no seeded demo event may claim independent verification or document verification
    INITIAL_DEMO_EVENTS.forEach((evt) => {
      assert.notEqual(
        evt.verificationStatus,
        'confirmed',
        `Seeded demo event ${evt.eventId} must never claim independent verification`
      );
      assert.notEqual(
        evt.evidence?.isDocumentVerified,
        true,
        `Seeded demo event ${evt.eventId} must not claim isDocumentVerified: true`
      );
    });
  });

  test('d. Unknown values remain null across seed data and save/reload persistence (never coerced to 0)', () => {
    // Demo plot & farm baseline
    const plotA = DEMO_PLOTS.find((p) => p.id === 'plot-a');
    assert.ok(plotA);
    assert.equal(plotA?.soilType, null, 'Unknown soil type must remain null');
    assert.equal(plotA?.waterSource, null, 'Unknown water source must remain null');
    assert.equal(plotA?.soilOrganicCarbon, null, 'Unknown organic carbon must remain null, never 0');
    assert.equal(plotA?.soilPH, null, 'Unknown soil pH must remain null, never 0');
    assert.equal(DEMO_FARM.irrigationSource, null);
    assert.equal(DEMO_FARM.soilPrimary, null);

    // Seed scouting event with unrecorded cost must remain null, not 0
    const scouting = INITIAL_DEMO_EVENTS.find((e) => e.eventId === 'MEM-PAD-04');
    assert.equal(scouting?.cost, null, 'Unrecorded scouting cost must be null, never 0');
    assert.equal(scouting?.costType, 'unknown');

    // Save & reload a real event with unknown fields
    const savedUnknown = ActivityStorageService.saveRecord(QA_FIXTURE_REAL_UNKNOWN_FIELDS);
    assert.equal(savedUnknown.success, true);

    const reloaded = ActivityStorageService.loadFarmerRecords().data.find(
      (e) => e.eventId === QA_FIXTURE_REAL_UNKNOWN_FIELDS.eventId
    );
    assert.ok(reloaded);
    assert.equal(reloaded.plotId, null);
    assert.equal(reloaded.activityDate, null);
    assert.equal(reloaded.quantity, null);
    assert.equal(reloaded.areaCoveredAcres, null);
    assert.equal(reloaded.cost, null);
    assert.equal(reloaded.costType, 'unknown');
  });

  test('e. Synthetic demo records are never represented as real farmer records and cannot be saved to user storage', () => {
    const saveDemoAttempt = ActivityStorageService.saveRecord(QA_FIXTURE_DEMO_WITH_COST);
    assert.equal(saveDemoAttempt.success, false, 'Demo records must be rejected by saveRecord');

    INITIAL_DEMO_EVENTS.forEach((e) => {
      assert.equal(e.isDemo, true);
    });
    const summary = calculateFarmSummary(INITIAL_DEMO_EVENTS);
    assert.equal(summary.realTotalEvents, 0, 'No demo event may be counted as real event');
    assert.equal(summary.realExpenditure, 0, 'No demo cost may be counted in real expenditure');
    assert.equal(summary.isDemoModeOnly, true);
  });

  test('f. Persistence & reload round-trip preserves user records, confirmations, edits, provenance, and exact summaries', () => {
    // Step 1: Save real farmer records (actual, voice-pending, estimated)
    assert.equal(ActivityStorageService.saveRecord(QA_FIXTURE_REAL_ACTUAL_COST).success, true);
    assert.equal(ActivityStorageService.saveRecord(QA_FIXTURE_REAL_VOICE_PENDING).success, true);
    assert.equal(ActivityStorageService.saveRecord(QA_FIXTURE_REAL_ESTIMATED_COST).success, true);

    // Step 2: Simulate page reload by reading fresh from storage
    const reload1 = ActivityStorageService.loadAllRecords();
    assert.equal(reload1.success, true);
    const summaryBeforeConfirm = calculateFarmSummary(reload1.data);
    assert.equal(summaryBeforeConfirm.realTotalEvents, 3);
    assert.equal(summaryBeforeConfirm.realConfirmedCount, 1);
    assert.equal(summaryBeforeConfirm.realPendingCount, 1);
    assert.equal(summaryBeforeConfirm.realEstimatedEventsCount, 1);
    assert.equal(summaryBeforeConfirm.realExpenditure, 540 + 250); // 790 (900 estimate excluded; demo excluded)

    // Step 3: Farmer confirms the voice-pending record and edits its cost from 250 -> 300
    const confirmRes = ActivityStorageService.confirmRecord(
      QA_FIXTURE_REAL_VOICE_PENDING.eventId,
      'Ravi Kumar'
    );
    assert.equal(confirmRes.success, true);

    const editRes = ActivityStorageService.updateRecord(
      QA_FIXTURE_REAL_VOICE_PENDING.eventId,
      { cost: 300 },
      'Updated electricity charge'
    );
    assert.equal(editRes.success, true);

    // Step 4: Simulate a second full reload and verify persisted state + summary
    const reload2Farmer = ActivityStorageService.loadFarmerRecords();
    assert.equal(reload2Farmer.success, true);
    assert.equal(reload2Farmer.data.length, 3);

    const persistedVoice = reload2Farmer.data.find(
      (e) => e.eventId === QA_FIXTURE_REAL_VOICE_PENDING.eventId
    );
    assert.ok(persistedVoice);
    assert.equal(persistedVoice.status, 'farmer_confirmed');
    assert.equal(persistedVoice.confirmationStatus, 'confirmed');
    assert.equal(persistedVoice.verificationStatus, 'unverified');
    assert.equal(persistedVoice.source, 'ai_extracted');
    assert.equal(persistedVoice.originalSource, 'farmer_voice');
    assert.equal(persistedVoice.activitySource, 'voice_input');
    assert.equal(persistedVoice.cost, 300);
    assert.ok(
      persistedVoice.correctionHistory?.some((c) => c.field === 'cost' && c.oldValue === 250 && c.newValue === 300),
      'Cost edit must be persisted in correctionHistory across reload'
    );

    const reload2All = ActivityStorageService.loadAllRecords();
    const summaryAfterReload = calculateFarmSummary(reload2All.data);
    assert.equal(summaryAfterReload.realConfirmedCount, 2);
    assert.equal(summaryAfterReload.realPendingCount, 0);
    assert.equal(summaryAfterReload.realExpenditure, 540 + 300); // 840
    assert.equal(summaryAfterReload.demoTotalEvents, INITIAL_DEMO_EVENTS.length);
  });

  test('g. Trust indicator translations cleanly distinguish farmerConfirmed, independentlyVerified, and unverified across EN/TE/HI', () => {
    (['Telugu', 'English', 'Hindi'] as const).forEach((lang) => {
      const ti = TRANSLATIONS[lang].trustIndicators;
      assert.ok(ti.farmerConfirmed);
      assert.ok(ti.independentlyVerified);
      assert.ok(ti.unverified);
      assert.notEqual(
        ti.farmerConfirmed,
        ti.independentlyVerified,
        `Farmer confirmation must never share the same label as independent verification in ${lang}`
      );
    });
  });

  test('h. normalizeEventProvenance derives clean separated fields for legacy records without inventing verification', () => {
    const legacyNormalized = normalizeEventProvenance({
      ...QA_FIXTURE_REAL_ACTUAL_COST,
      activitySource: undefined,
      evidenceType: undefined,
      confirmationStatus: undefined,
      costType: undefined,
      originalSource: undefined,
      verificationStatus: 'confirmed',
    });
    assert.equal(legacyNormalized.originalSource, 'farmer_reported');
    assert.equal(legacyNormalized.activitySource, 'manual_entry');
    assert.equal(legacyNormalized.evidenceType, 'receipt');
    assert.equal(legacyNormalized.confirmationStatus, 'confirmed');
    assert.equal(legacyNormalized.costType, 'actual');
    assert.equal(legacyNormalized.verificationStatus, 'unverified');
  });
});

describe('Fix P1: Unsupported Confidence Percentages, Localization & Dynamic Yield', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  test('a. No seeded demo activity carries invented or unsupported confidence percentages', () => {
    INITIAL_DEMO_EVENTS.forEach((evt) => {
      assert.equal(
        evt.confidence,
        undefined,
        `Seeded event ${evt.eventId} must not carry an invented confidence percentage`
      );
      const sanitized = sanitizeEventConfidence(evt);
      assert.equal(sanitized.confidence, undefined);
    });
  });

  test('b. sanitizeEventConfidence and saveRecord strip invented confidence on manual, GPS, sourceless, and mismatched records', () => {
    // 1. Manual entry with invented 0.95 -> stripped
    const manualWithInventedConf: FarmEvent = {
      ...QA_FIXTURE_REAL_ACTUAL_COST,
      eventId: 'CONF-TEST-MANUAL',
      confidence: 0.95,
      confidenceSource: 'web_speech_api_asr',
    };
    assert.equal(sanitizeEventConfidence(manualWithInventedConf).confidence, undefined);
    const savedManual = ActivityStorageService.saveRecord(manualWithInventedConf);
    assert.equal(savedManual.success, true);
    assert.equal(savedManual.data?.confidence, undefined, 'Manual entries must never retain AI confidence');

    // 2. GPS-captured record equating GPS accuracy with activity confidence -> stripped
    const gpsWithConf: FarmEvent = {
      ...QA_FIXTURE_GPS_OVERCLAIM,
      eventId: 'CONF-TEST-GPS',
      activitySource: 'sensor_integration',
      confidence: 0.98,
      confidenceSource: undefined,
    };
    assert.equal(sanitizeEventConfidence(gpsWithConf).confidence, undefined);

    // 3. Real voice record WITHOUT documented confidenceSource -> stripped
    const voiceNoSource: FarmEvent = {
      ...QA_FIXTURE_REAL_VOICE_PENDING,
      eventId: 'CONF-TEST-NOSRC',
      confidence: 0.88,
      confidenceSource: undefined,
    };
    assert.equal(sanitizeEventConfidence(voiceNoSource).confidence, undefined);

    // 4. Real voice record WITH synthetic_demo_only source -> stripped
    const realWithDemoSource: FarmEvent = {
      ...QA_FIXTURE_REAL_VOICE_PENDING,
      eventId: 'CONF-TEST-DEMOSRC',
      confidence: 0.85,
      confidenceSource: 'synthetic_demo_only',
    };
    assert.equal(sanitizeEventConfidence(realWithDemoSource).confidence, undefined);

    // 5. Demo record claiming real web_speech_api_asr measured confidence -> stripped
    const demoWithRealSource: FarmEvent = {
      ...QA_FIXTURE_DEMO_WITH_COST,
      activitySource: 'voice_input',
      confidence: 0.92,
      confidenceSource: 'web_speech_api_asr',
    };
    assert.equal(sanitizeEventConfidence(demoWithRealSource).confidence, undefined);

    // 6. Out-of-range confidence (0, -0.2, 1.5, NaN) -> stripped
    [0, -0.2, 1.5, Number.NaN].forEach((badVal) => {
      const badEvt: FarmEvent = {
        ...QA_FIXTURE_REAL_VOICE_PENDING,
        confidence: badVal,
        confidenceSource: 'web_speech_api_asr',
      };
      assert.equal(sanitizeEventConfidence(badEvt).confidence, undefined);
    });
  });

  test('c. Genuine measured web_speech_api_asr confidence on real voice records and synthetic_demo_only on demo records are preserved', () => {
    const validVoiceAsr: FarmEvent = {
      ...QA_FIXTURE_REAL_VOICE_PENDING,
      eventId: 'CONF-TEST-VALID-ASR',
      confidence: 0.84,
      confidenceSource: 'web_speech_api_asr',
    };
    const sanitizedReal = sanitizeEventConfidence(validVoiceAsr);
    assert.equal(sanitizedReal.confidence, 0.84);
    assert.equal(sanitizedReal.confidenceSource, 'web_speech_api_asr');

    const saved = ActivityStorageService.saveRecord(validVoiceAsr);
    assert.equal(saved.success, true);
    assert.equal(saved.data?.confidence, 0.84);
    assert.equal(saved.data?.confidenceSource, 'web_speech_api_asr');

    // Explicitly marked synthetic demo-only confidence on a demo voice/model record
    const demoOnlyConf: FarmEvent = {
      ...QA_FIXTURE_DEMO_ESTIMATE,
      confidence: 0.75,
      confidenceSource: 'synthetic_demo_only',
    };
    const sanitizedDemo = sanitizeEventConfidence(demoOnlyConf);
    assert.equal(sanitizedDemo.confidence, 0.75);
    assert.equal(sanitizedDemo.confidenceSource, 'synthetic_demo_only');
  });

  test('d. Graceful fallback when confidence is missing across Telugu, English, and Hindi without claiming verified status', () => {
    (['Telugu', 'English', 'Hindi'] as const).forEach((lang) => {
      const tl = TRANSLATIONS[lang].timeline;
      assert.ok(tl.notApplicableConfidence, `notApplicableConfidence must exist in ${lang}`);
      assert.ok(tl.confidenceLabel, `confidenceLabel must exist in ${lang}`);
      assert.ok(tl.asrConfidenceLabel, `asrConfidenceLabel must exist in ${lang}`);
      assert.ok(tl.syntheticDemoConfidenceLabel, `syntheticDemoConfidenceLabel must exist in ${lang}`);
      assert.equal(
        tl.notApplicableConfidence.toLowerCase().includes('verified'),
        false,
        `notApplicableConfidence in ${lang} must not claim the record is verified`
      );
    });
  });

  test('e. Dynamic yield conversion calculates kilograms correctly (1 quintal = 100 kg)', () => {
    assert.equal(convertQuintalsToKilograms(18.5), 1850);
    assert.equal(convertQuintalsToKilograms(20), 2000);
    assert.equal(convertQuintalsToKilograms(24.25), 2425);
    assert.equal(convertQuintalsToKilograms(0.75), 75);
    assert.equal(convertQuintalsToKilograms(null), null);
    assert.equal(convertQuintalsToKilograms(undefined), null);
  });

  test('f. Missing yield renders as "Yield not recorded", never "Soil type unknown"', () => {
    (['Telugu', 'English', 'Hindi'] as const).forEach((lang) => {
      const yieldMsg = TRANSLATIONS[lang].myFarm.yieldNotRecorded;
      const soilMsg = TRANSLATIONS[lang].myFarm.soilTypeUnknown;
      assert.ok(yieldMsg, `yieldNotRecorded must exist in ${lang}`);
      assert.notEqual(yieldMsg, soilMsg, `yieldNotRecorded must not be identical to soilTypeUnknown in ${lang}`);
    });
  });
});

describe('Fix P1: Reconcile Crop and Cycle States, Transitions & Area Baseline', () => {
  test('a. Andhra Pradesh demo area baseline: 2 acres paddy + 3 acres groundnut = 5.0 acres', () => {
    const areaCheck = validateFarmAreaBaseline(DEMO_PLOTS, DEMO_FARM.totalAreaAcres);
    assert.equal(areaCheck.isValid, true);
    assert.equal(areaCheck.sumPlotsAcres, 5.0);
    assert.equal(areaCheck.expectedTotalAcres, 5.0);

    const plotA = DEMO_PLOTS.find((p) => p.id === 'plot-a');
    const plotB = DEMO_PLOTS.find((p) => p.id === 'plot-b');
    assert.equal(plotA?.areaAcres, 2.0, 'Plot A must be 2.0 acres');
    assert.equal(plotB?.areaAcres, 3.0, 'Plot B must be 3.0 acres');
  });

  test('b. All demo plots and crop cycles reconcile cleanly and are explicitly tagged as unvalidated demo data', () => {
    const plotA = DEMO_PLOTS.find((p) => p.id === 'plot-a')!;
    const plotB = DEMO_PLOTS.find((p) => p.id === 'plot-b')!;

    // Plot A currently in preparation points to active land_preparation cycle (NOT completed cycle-paddy-01)
    assert.equal(plotA.status, 'preparation');
    assert.equal(plotA.currentCropCycleId, 'cycle-paddy-current');

    const plotACurrent = DEMO_CROP_CYCLES.find((c) => c.id === 'cycle-paddy-current')!;
    const plotAPrior = DEMO_CROP_CYCLES.find((c) => c.id === 'cycle-paddy-01')!;
    const plotBCurrent = DEMO_CROP_CYCLES.find((c) => c.id === 'cycle-groundnut-01')!;

    assert.ok(plotACurrent);
    assert.ok(plotAPrior);
    assert.ok(plotBCurrent);

    assert.equal(plotACurrent.stage, 'land_preparation');
    assert.equal(plotACurrent.status, 'active');
    assert.equal(plotACurrent.actualHarvestDate, null);

    assert.equal(plotAPrior.stage, 'harvested');
    assert.equal(plotAPrior.status, 'completed');
    assert.equal(plotAPrior.actualHarvestDate, '2026-08-20');
    assert.equal(plotAPrior.stageProgressPercent, 100);

    // Every demo cycle passes state validation against its plot and is tagged unvalidated_demo
    DEMO_CROP_CYCLES.forEach((cycle) => {
      const plot = cycle.plotId === 'plot-a' ? plotA : plotB;
      const res = validateCropCycleState(plot, cycle);
      assert.equal(res.isValid, true, `Demo cycle ${cycle.id} should be valid: ${res.issues.join('; ')}`);
      assert.equal(cycle.isDemo, true, `Demo cycle ${cycle.id} must have isDemo: true`);
      assert.equal(
        cycle.agronomicValidationStatus,
        'unvalidated_demo',
        `Demo cycle ${cycle.id} must explicitly mark agronomicValidationStatus: unvalidated_demo`
      );
    });
  });

  test('c. Flags contradictory plot vs currentCycle, stage vs status, date ordering, progress bounds, and premature yield', () => {
    const plotA = DEMO_PLOTS.find((p) => p.id === 'plot-a')!;

    // 1. Plot in "preparation" with currentCropCycleId pointing directly to a "harvested"/"completed" cycle -> INVALID
    const contradictingPlot: Plot = {
      ...plotA,
      status: 'preparation',
      currentCropCycleId: 'cycle-paddy-01',
    };
    const priorCompletedCycle = DEMO_CROP_CYCLES.find((c) => c.id === 'cycle-paddy-01')!;
    const prepHarvestConflict = validateCropCycleState(contradictingPlot, priorCompletedCycle);
    assert.equal(prepHarvestConflict.isValid, false);
    assert.ok(prepHarvestConflict.issues.some((i) => i.includes('preparation')));

    // 2. Plot in "fallow" with an active current cycle -> INVALID
    const fallowPlot: Plot = {
      ...plotA,
      status: 'fallow',
      currentCropCycleId: 'cycle-paddy-current',
    };
    const activePrepCycle = DEMO_CROP_CYCLES.find((c) => c.id === 'cycle-paddy-current')!;
    assert.equal(validateCropCycleState(fallowPlot, activePrepCycle).isValid, false);

    // 3. Active status with harvested stage -> INVALID
    const activeHarvested: CropCycle = {
      ...priorCompletedCycle,
      id: 'invalid-active-harvested',
      status: 'active',
    };
    const activeHarvRes = validateCropCycleState(plotA, activeHarvested);
    assert.equal(activeHarvRes.isValid, false);
    assert.ok(activeHarvRes.issues.some((i) => i.includes('completed')));

    // 4. Vegetative stage with missing sowingDate -> INVALID
    const missingSowing: CropCycle = {
      ...activePrepCycle,
      id: 'invalid-missing-sowing',
      stage: 'vegetative',
      stageProgressPercent: 40,
      sowingDate: null,
    };
    assert.equal(validateCropCycleState(plotA, missingSowing).isValid, false);

    // 5. expectedHarvestDate earlier than sowingDate -> INVALID
    const invertedDates: CropCycle = {
      ...activePrepCycle,
      id: 'invalid-dates',
      stage: 'vegetative',
      stageProgressPercent: 40,
      sowingDate: '2026-07-01',
      expectedHarvestDate: '2026-06-15',
    };
    const invertedRes = validateCropCycleState(plotA, invertedDates);
    assert.equal(invertedRes.isValid, false);
    assert.ok(invertedRes.issues.some((i) => i.includes('expectedHarvestDate')));

    // 6. stageProgressPercent inconsistent with stage bounds (50% during land_preparation) -> INVALID
    const badProgress: CropCycle = {
      ...activePrepCycle,
      id: 'invalid-progress',
      stage: 'land_preparation',
      stageProgressPercent: 50,
    };
    assert.equal(validateCropCycleState(plotA, badProgress).isValid, false);

    // 7. actualYieldQuintals recorded during land_preparation -> INVALID
    const prematureYield: CropCycle = {
      ...activePrepCycle,
      id: 'invalid-premature-yield',
      actualYieldQuintals: 12.0,
    };
    assert.equal(validateCropCycleState(plotA, prematureYield).isValid, false);
  });

  test('d. Distinguishes expected vs actual harvest dates and never infers actual harvest because expected date passed', () => {
    const plotA = DEMO_PLOTS.find((p) => p.id === 'plot-a')!;

    // Cycle whose expectedHarvestDate passed, still in maturity with actualHarvestDate: null -> VALID active cycle
    const overdueMaturityCycle: CropCycle = {
      id: 'overdue-maturity',
      plotId: 'plot-a',
      cropId: 'crop-paddy',
      cropName: 'Paddy',
      variety: null,
      season: 'Kharif',
      sowingDate: '2026-06-10',
      expectedHarvestDate: '2026-10-01',
      actualHarvestDate: null,
      stage: 'maturity',
      stageProgressPercent: 95,
      status: 'active',
      targetYieldQuintals: null,
      actualYieldQuintals: null,
    };
    assert.equal(validateCropCycleState(plotA, overdueMaturityCycle).isValid, true);
    assert.equal(
      hasExpectedHarvestPassedWithoutActual(overdueMaturityCycle, '2026-10-15'),
      true,
      'Must detect expected harvest date passed without inferring actual harvest'
    );
    assert.equal(
      hasExpectedHarvestPassedWithoutActual(overdueMaturityCycle, '2026-09-20'),
      false
    );

    // Marking harvested without actualHarvestDate -> INVALID
    const prematurelyHarvested: CropCycle = {
      ...overdueMaturityCycle,
      stage: 'harvested',
      stageProgressPercent: 100,
      status: 'completed',
      actualHarvestDate: null,
    };
    const res = validateCropCycleState(plotA, prematurelyHarvested);
    assert.equal(res.isValid, false);
    assert.ok(res.issues.some((i) => i.includes('actualHarvestDate')));
  });

  test('e. Crop lifecycle state transitions enforce sequential stages, required dates, and terminal states', () => {
    // Valid full sequential progression
    assert.equal(
      validateCropStageTransition('land_preparation', 'sowing', { sowingDate: '2026-06-10' }).isValid,
      true
    );
    assert.equal(
      validateCropStageTransition('sowing', 'vegetative', { sowingDate: '2026-06-10' }).isValid,
      true
    );
    assert.equal(
      validateCropStageTransition('vegetative', 'flowering', { sowingDate: '2026-06-10' }).isValid,
      true
    );
    assert.equal(
      validateCropStageTransition('flowering', 'grain_filling', { sowingDate: '2026-06-10' }).isValid,
      true
    );
    assert.equal(
      validateCropStageTransition('grain_filling', 'maturity', { sowingDate: '2026-06-10' }).isValid,
      true
    );
    assert.equal(
      validateCropStageTransition('maturity', 'harvested', {
        sowingDate: '2026-06-10',
        actualHarvestDate: '2026-11-05',
        status: 'completed',
      }).isValid,
      true
    );

    // Invalid skips, backward transitions, and terminal exits
    assert.equal(
      validateCropStageTransition('land_preparation', 'harvested', {
        sowingDate: '2026-06-10',
        actualHarvestDate: '2026-11-05',
        status: 'completed',
      }).isValid,
      false
    );
    assert.equal(
      validateCropStageTransition('flowering', 'vegetative', { sowingDate: '2026-06-10' }).isValid,
      false
    );
    assert.equal(
      validateCropStageTransition('harvested', 'land_preparation').isValid,
      false,
      'harvested is terminal; new crop requires a new CropCycle'
    );
    // Missing sowingDate when transitioning into sowing
    assert.equal(
      validateCropStageTransition('land_preparation', 'sowing', { sowingDate: null }).isValid,
      false
    );
    // Missing actualHarvestDate when transitioning into harvested
    assert.equal(
      validateCropStageTransition('maturity', 'harvested', {
        sowingDate: '2026-06-10',
        expectedHarvestDate: '2026-11-01',
        actualHarvestDate: null,
        status: 'completed',
      }).isValid,
      false
    );

    // Cycle status transitions
    assert.equal(
      validateCycleStatusTransition('active', 'completed', {
        stage: 'harvested',
        actualHarvestDate: '2026-11-05',
      }).isValid,
      true
    );
    assert.equal(
      validateCycleStatusTransition('active', 'completed', {
        stage: 'maturity',
        actualHarvestDate: null,
      }).isValid,
      false
    );
    assert.equal(validateCycleStatusTransition('active', 'abandoned', {}).isValid, true);
    assert.equal(validateCycleStatusTransition('completed', 'active', {}).isValid, false);
    assert.equal(validateCycleStatusTransition('abandoned', 'active', {}).isValid, false);
  });

  test('f. Unverified agronomic estimates do not claim authoritative ICAR/model validation & cropStages localized in EN/TE/HI', () => {
    const potashEstimate = INITIAL_DEMO_EVENTS.find((e) => e.eventId === 'MEM-PAD-06')!;
    assert.ok(potashEstimate);
    assert.equal(potashEstimate.isEstimate, true);
    assert.equal(potashEstimate.isDemo, true);
    assert.equal(
      (potashEstimate.estimateRationale || '').toUpperCase().includes('ICAR'),
      false,
      'Demo estimate must not cite unverified authoritative ICAR nutrient models without soil test data'
    );

    const requiredStages = [
      'land_preparation',
      'sowing',
      'vegetative',
      'flowering',
      'grain_filling',
      'maturity',
      'harvested',
      'unknown',
    ] as const;

    (['Telugu', 'English', 'Hindi'] as const).forEach((lang) => {
      const stages = TRANSLATIONS[lang].cropStages;
      assert.ok(stages, `cropStages dictionary must exist in ${lang}`);
      requiredStages.forEach((stage) => {
        assert.ok(stages[stage], `cropStages.${stage} missing in ${lang}`);
      });
    });
  });
});

describe('Fix P2: Filter and Summary Consistency', () => {
  const multiPlotEvents: FarmEvent[] = [
    {
      eventId: 'P-A-01',
      eventType: 'sowing',
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      plotId: 'plot-a',
      plotName: 'Plot A — Paddy',
      cropName: 'Paddy',
      activityDate: '2026-06-10',
      recordedDate: '2026-06-10T10:00:00Z',
      title: 'Sowing Plot A',
      cost: 1500,
      currency: 'INR',
      costType: 'actual',
      source: 'farmer_reported',
      status: 'farmer_confirmed',
      verificationStatus: 'unverified',
      isDemo: false,
      evidence: { type: 'none' },
      createdBy: 'Ravi',
      createdAt: '2026-06-10T10:00:00Z',
      updatedAt: '2026-06-10T10:00:00Z',
    },
    {
      eventId: 'P-B-01',
      eventType: 'sowing',
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      plotId: 'plot-b',
      plotName: 'Plot B — Groundnut',
      cropName: 'Groundnut',
      activityDate: '2026-06-15',
      recordedDate: '2026-06-15T10:00:00Z',
      title: 'Sowing Plot B',
      cost: 2200,
      currency: 'INR',
      costType: 'actual',
      source: 'farmer_reported',
      status: 'farmer_confirmed',
      verificationStatus: 'unverified',
      isDemo: false,
      evidence: { type: 'none' },
      createdBy: 'Ravi',
      createdAt: '2026-06-15T10:00:00Z',
      updatedAt: '2026-06-15T10:00:00Z',
    },
  ];

  test('a. Selected-plot totals strictly isolate events from that plot', () => {
    const summaryA = calculateFarmSummary(multiPlotEvents, { plotId: 'plot-a' });
    assert.equal(summaryA.realExpenditure, 1500);
    assert.equal(summaryA.realTotalEvents, 1);

    const summaryB = calculateFarmSummary(multiPlotEvents, { plotId: 'plot-b' });
    assert.equal(summaryB.realExpenditure, 2200);
    assert.equal(summaryB.realTotalEvents, 1);
  });

  test('b. Empty results return safe zero counts without errors', () => {
    const emptySummary = calculateFarmSummary([]);
    assert.equal(emptySummary.realExpenditure, 0);
    assert.equal(emptySummary.realTotalEvents, 0);
    assert.equal(emptySummary.realConfirmedCount, 0);
    assert.equal(emptySummary.demoExpenditure, 0);
    assert.equal(emptySummary.hasRealData, false);
    assert.equal(emptySummary.hasDemoData, false);
  });

  test('c. Multi-plot totals reflect all recorded activities when no plot filter is applied', () => {
    const allSummary = calculateFarmSummary(multiPlotEvents, { plotId: 'all' });
    assert.equal(allSummary.realExpenditure, 3700);
    assert.equal(allSummary.realTotalEvents, 2);
    assert.equal(allSummary.realConfirmedCount, 2);
  });
});

describe('Phase 2: Dynamic Yield Conversion, Missing Yield, Evidence Labels & Localization Audit', () => {
  const languages = ['English', 'Telugu', 'Hindi'] as const;

  test('a. convertQuintalsToKilograms computes kilograms dynamically and returns null for missing/invalid/negative values', () => {
    assert.equal(convertQuintalsToKilograms(18.5), 1850);
    assert.equal(convertQuintalsToKilograms(12.5), 1250);
    assert.equal(convertQuintalsToKilograms(22), 2200);
    assert.equal(convertQuintalsToKilograms(24.25), 2425);
    assert.equal(convertQuintalsToKilograms(0.75), 75);
    assert.equal(convertQuintalsToKilograms(0.1), 10);
    assert.equal(convertQuintalsToKilograms(0), 0);

    // Missing, non-finite, and negative inputs must return null (never coerced to 0)
    assert.equal(convertQuintalsToKilograms(null), null);
    assert.equal(convertQuintalsToKilograms(undefined), null);
    assert.equal(convertQuintalsToKilograms(Number.NaN), null);
    assert.equal(convertQuintalsToKilograms(Number.POSITIVE_INFINITY), null);
    assert.equal(convertQuintalsToKilograms(Number.NEGATIVE_INFINITY), null);
    assert.equal(convertQuintalsToKilograms(-1), null);
    assert.equal(convertQuintalsToKilograms(-18.5), null);
  });

  test('b. formatYieldDisplay dynamically formats quintals + computed kg (never hardcoded 1,850) and handles missing yield explicitly in EN/TE/HI', () => {
    languages.forEach((lang) => {
      const t = getTranslations(lang);

      // Different quintal inputs must dynamically produce their exact kg equivalents
      const twelveHalf = formatYieldDisplay(12.5, t);
      assert.ok(twelveHalf.includes('12.5'), `${lang}: should include 12.5 quintals`);
      assert.ok(twelveHalf.includes('1,250'), `${lang}: should compute 1,250 kg dynamically`);
      assert.ok(twelveHalf.includes(t.myFarm.quintalsUnit), `${lang}: should include localized quintals unit`);
      assert.ok(twelveHalf.includes(t.myFarm.kgUnit), `${lang}: should include localized kg unit`);
      assert.equal(twelveHalf.includes('1,850'), false, `${lang}: must never hardcode 1,850 kg`);

      const twentyTwo = formatYieldDisplay(22, t);
      assert.ok(twentyTwo.includes('22'), `${lang}: should include 22 quintals`);
      assert.ok(twentyTwo.includes('2,200'), `${lang}: should compute 2,200 kg dynamically`);

      // Explicit zero yield is valid 0 (distinct from missing)
      const zeroYield = formatYieldDisplay(0, t);
      assert.ok(zeroYield.includes(`0 ${t.myFarm.quintalsUnit}`), `${lang}: explicit 0 yield should format as 0 quintals`);
      assert.ok(zeroYield.includes(`0 ${t.myFarm.kgUnit}`), `${lang}: explicit 0 yield should format as 0 kg`);

      // Missing / invalid / negative yield must explicitly render yieldNotRecorded (never "0" or soilTypeUnknown)
      [null, undefined, Number.NaN, -5].forEach((missingVal) => {
        const rendered = formatYieldDisplay(missingVal, t);
        assert.equal(rendered, t.myFarm.yieldNotRecorded, `${lang}: missing/invalid yield must render yieldNotRecorded`);
        assert.notEqual(rendered, t.myFarm.soilTypeUnknown, `${lang}: missing yield must not display soilTypeUnknown`);
        assert.equal(rendered.includes('0 '), false, `${lang}: missing yield must not display 0`);
      });
    });
  });

  test('c. Farmer-confirmed vs independently-verified wording and evidence labels are accurately separated in EN/TE/HI', () => {
    languages.forEach((lang) => {
      const t = getTranslations(lang);

      // Farmer confirmation must remain strictly distinct from independent verification
      assert.notEqual(
        t.trustIndicators.farmerConfirmed,
        t.trustIndicators.independentlyVerified,
        `${lang}: farmerConfirmed and independentlyVerified must differ`
      );
      assert.notEqual(
        t.statuses.farmer_confirmed,
        t.trustIndicators.independentlyVerified,
        `${lang}: statuses.farmer_confirmed must not equal independentlyVerified`
      );

      // Receipt attached must NOT claim independent verification
      const receiptLabel = t.sources.receipt_verified.toLowerCase();
      assert.equal(
        receiptLabel.includes('verified'),
        false,
        `${lang}: sources.receipt_verified must not claim "verified"`
      );
      assert.equal(
        t.sources.receipt_verified.includes('ధృవీకరించబడింది'),
        false,
        `${lang}: Telugu sources.receipt_verified must not claim ధృవీకరించబడింది`
      );
      assert.equal(
        t.sources.receipt_verified.includes('सत्यापित'),
        false,
        `${lang}: Hindi sources.receipt_verified must not claim सत्यापित`
      );

      // Evidence badge tooltips must clearly distinguish supporting evidence from third-party verification
      assert.ok(t.evidenceBadges.farmerConfirmedTip.length > 0);
      assert.ok(t.evidenceBadges.receiptAttachedTip.length > 0);
      assert.ok(t.evidenceBadges.gpsCapturedTip.length > 0);
      assert.ok(t.evidenceBadges.weatherStationTip.length > 0);
      assert.ok(t.evidenceBadges.cameraProductTip.length > 0);
      assert.ok(t.evidenceBadges.verifiedDocTip.length > 0);
      assert.notEqual(t.evidenceBadges.farmerConfirmedTip, t.evidenceBadges.verifiedDocTip);
      assert.notEqual(t.evidenceBadges.receiptAttachedTip, t.evidenceBadges.verifiedDocTip);
      assert.notEqual(t.evidenceBadges.gpsCapturedTip, t.evidenceBadges.verifiedDocTip);
      assert.notEqual(t.evidenceBadges.weatherStationTip, t.evidenceBadges.verifiedDocTip);
    });

    // Telugu specific distinction check: confirmation ("నిర్ధారించారు") vs independent verification ("స్వతంత్రంగా ధృవీకరించబడింది")
    const te = getTranslations('Telugu');
    assert.equal(te.trustIndicators.farmerConfirmed, 'రైతు నిర్ధారించారు');
    assert.equal(te.statuses.farmer_confirmed, 'రైతు నిర్ధారించారు');
    assert.equal(te.trustIndicators.independentlyVerified, 'స్వతంత్రంగా ధృవీకరించబడింది');

    // Storage estimate confirmation error must NOT conflate confirmation with verification
    mockStorage.clear();
    ActivityStorageService.saveRecord(QA_FIXTURE_REAL_ESTIMATED_COST);
    const estRes = ActivityStorageService.confirmRecord(QA_FIXTURE_REAL_ESTIMATED_COST.eventId, 'Ravi Kumar');
    assert.equal(estRes.success, false);
    assert.equal(estRes.code, 'INVALID_STATE');
    assert.equal(
      (estRes.error || '').toLowerCase().includes('verified'),
      false,
      'Storage estimate rejection message must not equate farmer confirmation with verified facts'
    );
  });

  test('d. Measurement units and storage error codes localize cleanly across English, Telugu, and Hindi', () => {
    const knownUnits = ['kg', 'quintals', 'quintal', 'hours', 'runtime hours', 'bags', 'liters', 'ml', 'acres'];
    const storageCodes = [
      'QUOTA_EXCEEDED',
      'STORAGE_UNAVAILABLE',
      'NOT_FOUND',
      'CORRUPT_DATA',
      'DUPLICATE',
      'INVALID_STATE',
      'UNKNOWN',
    ] as const;

    languages.forEach((lang) => {
      const t = getTranslations(lang);

      knownUnits.forEach((unit) => {
        const formatted = formatUnitLabel(unit, t);
        assert.ok(formatted.trim().length > 0, `${lang}: unit "${unit}" must return non-empty localized label`);
      });

      // Specific localized unit mapping checks
      assert.equal(formatUnitLabel('kg', t), t.myFarm.kgUnit);
      assert.equal(formatUnitLabel('quintals', t), t.myFarm.quintalsUnit);
      assert.equal(formatUnitLabel('hours', t), t.units.hours);
      assert.equal(formatUnitLabel('bags', t), t.units.bags);
      assert.equal(formatUnitLabel('liters', t), t.units.liters);
      assert.equal(formatUnitLabel('ml', t), t.units.ml);
      assert.equal(formatUnitLabel('acres', t), t.units.acres);
      // Unknown custom units are preserved verbatim, and empty/null returns empty string
      assert.equal(formatUnitLabel('custom_bundles', t), 'custom_bundles');
      assert.equal(formatUnitLabel(null, t), '');
      assert.equal(formatUnitLabel(undefined, t), '');

      storageCodes.forEach((code) => {
        const msg = getLocalizedStorageError(code, 'Fallback', t);
        assert.ok(msg.trim().length > 0, `${lang}: storage code ${code} must map to a non-empty message`);
        if (code !== 'UNKNOWN') {
          assert.notEqual(msg, 'Fallback', `${lang}: known storage code ${code} must use localized dictionary error`);
        }
      });
    });
  });

  test('e. Automated translation-key coverage audit confirms 100% structural key parity across English, Telugu, and Hindi', () => {
    const refPaths = collectTranslationKeyPaths(TRANSLATIONS.English);
    assert.ok(refPaths.length >= 250, `Expected comprehensive dictionary keys (found ${refPaths.length})`);

    languages.forEach((lang) => {
      const report = auditTranslationCoverage(lang);
      assert.equal(
        report.missingKeys.length,
        0,
        `${lang} has missing translation keys: ${report.missingKeys.join(', ')}`
      );
      assert.equal(
        report.emptyKeys.length,
        0,
        `${lang} has empty translation keys: ${report.emptyKeys.join(', ')}`
      );
      assert.equal(
        report.extraKeys.length,
        0,
        `${lang} has unexpected extra keys not in English reference: ${report.extraKeys.join(', ')}`
      );
      assert.equal(report.coveragePercent, 100, `${lang} must have 100% structural key coverage`);
    });
  });

  test('f. Translation fallback resolver safely falls back to English for unknown languages, missing nested keys, and blank strings', () => {
    // Unknown or undefined language falls back to English safely
    assert.equal(getTranslations(undefined).appName, TRANSLATIONS.English.appName);
    assert.equal(getTranslations('Tamil' as any).appName, TRANSLATIONS.English.appName);

    // Partial/corrupted dictionary falls back key-by-key to English while retaining valid target keys
    const fallbackSample = {
      sectionA: {
        present: 'English Present',
        missing: 'English Missing',
        blank: 'English Blank',
      },
      sectionB: {
        nested: 'English Nested',
      },
    };
    const partialTarget = {
      sectionA: {
        present: 'Localized Present',
        blank: '   ',
      },
    } as any;

    const merged = resolveTranslationWithFallback(partialTarget, fallbackSample);
    assert.equal(merged.sectionA.present, 'Localized Present');
    assert.equal(merged.sectionA.missing, 'English Missing');
    assert.equal(merged.sectionA.blank, 'English Blank');
    assert.equal(merged.sectionB.nested, 'English Nested');
  });
});

describe('Final Phase 2 Regression: Filter/Search/Plot/Summary Agreement & Storage Reload Durability', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  test('a. Filters, search (title/input/date/crop/type), selected plot, category counts, and summary totals strictly agree', () => {
    ActivityStorageService.saveRecord(QA_FIXTURE_REAL_ACTUAL_COST); // Plot A, fertilizer, Urea, 2026-06-28, ₹540, confirmed, receipt
    ActivityStorageService.saveRecord(QA_FIXTURE_REAL_VOICE_PENDING); // Plot A, irrigation, 2026-06-29, ₹250, pending, voice
    ActivityStorageService.saveRecord(QA_FIXTURE_PLOT_B_REAL); // Plot B, sowing, Groundnut, 2026-06-20, ₹2400, confirmed
    ActivityStorageService.saveRecord(QA_FIXTURE_REAL_ESTIMATED_COST); // Plot A, spray, ₹900 estimated
    ActivityStorageService.saveRecord(QA_FIXTURE_REAL_UNKNOWN_FIELDS); // plotId: null (unassigned), weeding, cost: null

    const allEvents = ActivityStorageService.loadAllRecords().data;

    // 1. Search by date ("2026-06-28") agrees with summary
    const byDate = filterFarmEvents(allEvents, { searchQuery: '2026-06-28' });
    assert.equal(byDate.length, 1);
    assert.equal(byDate[0].eventId, QA_FIXTURE_REAL_ACTUAL_COST.eventId);
    const byDateSummary = calculateFarmSummary(byDate);
    assert.equal(byDateSummary.realTotalEvents, 1);
    assert.equal(byDateSummary.realExpenditure, 540);
    assert.equal(byDateSummary.demoTotalEvents, 0);

    // 2. Search by crop ("groundnut") + plot filter ("plot-b") agrees across real and demo
    const groundnutPlotB = filterFarmEvents(allEvents, { plotId: 'plot-b', searchQuery: 'groundnut' });
    const groundnutSummary = calculateFarmSummary(groundnutPlotB);
    assert.equal(groundnutSummary.realTotalEvents, 1);
    assert.equal(groundnutSummary.realExpenditure, 2400);
    assert.equal(groundnutSummary.demoTotalEvents, 1); // DEMO-002 (Plot B — Groundnut)
    assert.equal(groundnutSummary.demoExpenditure, 0);
    assert.equal(groundnutSummary.activeVisibleCount, groundnutPlotB.length);

    // 3. Filtering by source="farmer_confirmed" matches confirmed records even when original source is preserved
    const confirmedFarmerOnly = filterFarmEvents(allEvents, {
      category: 'farmer',
      source: 'farmer_confirmed',
    });
    assert.equal(confirmedFarmerOnly.length, 2);
    const confirmedSummary = calculateFarmSummary(confirmedFarmerOnly);
    assert.equal(confirmedSummary.realConfirmedCount, 2);
    assert.equal(confirmedSummary.realExpenditure, 540 + 2400);
    assert.equal(confirmedSummary.realPendingCount, 0);

    // 4. Filtering by source="receipt_verified" matches real record with evidenceType='receipt' even when source='farmer_reported'
    const receiptFarmer = filterFarmEvents(allEvents, {
      category: 'farmer',
      source: 'receipt_verified',
    });
    assert.equal(receiptFarmer.length, 1);
    assert.equal(receiptFarmer[0].eventId, QA_FIXTURE_REAL_ACTUAL_COST.eventId);
    assert.equal(calculateFarmSummary(receiptFarmer).realEvidenceTally.receipts, 1);
    assert.equal(calculateFarmSummary(receiptFarmer).realExpenditure, 540);

    // 5. Unassigned plot filter isolates plotId === null events and agrees with summary
    const unassignedAll = filterFarmEvents(allEvents, { plotId: 'unassigned' });
    const unassignedSummary = calculateFarmSummary(unassignedAll);
    assert.equal(unassignedSummary.realTotalEvents, 1);
    assert.equal(unassignedSummary.demoTotalEvents, 3); // DEMO-003, DEMO-004, DEMO-005
    assert.equal(unassignedSummary.activeVisibleCount, 4);

    // 6. Category tab invariant: All === Farmer + Demo under compound filters
    const compoundFilters = { plotId: 'plot-a', eventType: 'fertilizer', searchQuery: 'urea' };
    const scopedAll = filterFarmEvents(allEvents, { ...compoundFilters, category: 'all' });
    const scopedFarmer = filterFarmEvents(allEvents, { ...compoundFilters, category: 'farmer' });
    const scopedDemo = filterFarmEvents(allEvents, { ...compoundFilters, category: 'demo' });
    assert.equal(scopedAll.length, scopedFarmer.length + scopedDemo.length);
    assert.equal(calculateFarmSummary(scopedAll).realExpenditure, 540);
    assert.equal(calculateFarmSummary(scopedFarmer).realExpenditure, 540);
    assert.equal(calculateFarmSummary(scopedDemo).realExpenditure, 0);
    assert.equal(calculateFarmSummary(scopedDemo).demoExpenditure, 280); // MEM-PAD-03
  });

  test('b. Edits, confirmations, and deletions persist across multiple simulated reloads with audit history and summary accuracy', () => {
    // Save 2 real events
    assert.equal(ActivityStorageService.saveRecord(QA_FIXTURE_REAL_VOICE_PENDING).success, true);
    assert.equal(ActivityStorageService.saveRecord(QA_FIXTURE_PLOT_B_REAL).success, true);

    // Edit title, quantity, unit, cost, and plot on pending voice record
    const editRes = ActivityStorageService.updateRecord(
      QA_FIXTURE_REAL_VOICE_PENDING.eventId,
      {
        title: 'Borewell Drip Run (Updated)',
        quantity: 4.5,
        unit: 'hours',
        cost: 375,
        description: 'Adjusted after pump timer check',
      },
      'Farmer review edit'
    );
    assert.equal(editRes.success, true);

    // Reload #1: verify edit survived reload before confirmation
    const reload1 = ActivityStorageService.loadFarmerRecords();
    assert.equal(reload1.success, true);
    const afterEdit = reload1.data.find((e) => e.eventId === QA_FIXTURE_REAL_VOICE_PENDING.eventId)!;
    assert.equal(afterEdit.title, 'Borewell Drip Run (Updated)');
    assert.equal(afterEdit.quantity, 4.5);
    assert.equal(afterEdit.cost, 375);
    assert.equal(afterEdit.status, 'pending_confirmation');
    assert.equal(afterEdit.source, 'ai_extracted');
    assert.equal(afterEdit.originalSource, 'farmer_voice');
    assert.ok((afterEdit.correctionHistory?.length || 0) >= 3);

    // Confirm edited record
    const confirmRes = ActivityStorageService.confirmRecord(
      QA_FIXTURE_REAL_VOICE_PENDING.eventId,
      'Ravi garu'
    );
    assert.equal(confirmRes.success, true);

    // Reload #2: verify confirmation survived reload without overwriting original source or elevating verificationStatus
    const reload2 = ActivityStorageService.loadAllRecords();
    assert.equal(reload2.success, true);
    const afterConfirm = reload2.data.find((e) => e.eventId === QA_FIXTURE_REAL_VOICE_PENDING.eventId)!;
    assert.equal(afterConfirm.status, 'farmer_confirmed');
    assert.equal(afterConfirm.confirmationStatus, 'confirmed');
    assert.equal(afterConfirm.confirmedBy, 'Ravi garu');
    assert.ok(afterConfirm.confirmedAt);
    assert.equal(afterConfirm.source, 'ai_extracted');
    assert.equal(afterConfirm.originalSource, 'farmer_voice');
    assert.equal(afterConfirm.verificationStatus, 'unverified');
    assert.equal(calculateFarmSummary(reload2.data).realExpenditure, 375 + 2400);
    assert.equal(calculateFarmSummary(reload2.data).realConfirmedCount, 2);

    // Delete Plot B record and verify deletion survives Reload #3
    const delRes = ActivityStorageService.deleteRecord(QA_FIXTURE_PLOT_B_REAL.eventId);
    assert.equal(delRes.success, true);
    const reload3 = ActivityStorageService.loadAllRecords();
    assert.equal(reload3.success, true);
    assert.equal(
      reload3.data.some((e) => e.eventId === QA_FIXTURE_PLOT_B_REAL.eventId),
      false,
      'Deleted record must stay deleted after reload'
    );
    assert.equal(calculateFarmSummary(reload3.data).realTotalEvents, 1);
    assert.equal(calculateFarmSummary(reload3.data).realExpenditure, 375);
  });

  test('c. Corrupt localStorage JSON is quarantined without silent overwrite, and legacy records are normalized on reload', () => {
    // 1. Corrupt JSON handling
    const corruptRaw = '{not valid json [[[ ';
    mockStorage.setItem('farm_intel_farmer_records_v1', corruptRaw);

    const loadCorrupt = ActivityStorageService.loadFarmerRecords();
    assert.equal(loadCorrupt.success, false);
    assert.equal(loadCorrupt.isCorrupt, true);
    assert.equal(loadCorrupt.data.length, 0);

    // Backup key was created with exact raw payload
    const backupKey = mockStorage.keys().find((k) => k.startsWith('farm_intel_corrupt_backup_'));
    assert.ok(backupKey, 'Corrupt payload must be quarantined under backup key');
    assert.equal(mockStorage.getItem(backupKey!), corruptRaw);

    // Attempting to save while corrupt must NOT silently overwrite
    const saveBlocked = ActivityStorageService.saveRecord(QA_FIXTURE_REAL_ACTUAL_COST);
    assert.equal(saveBlocked.success, false);
    assert.equal(saveBlocked.code, 'CORRUPT_DATA');

    // 2. Legacy record normalization on reload (strips invented confidence and unsupported verified status)
    mockStorage.clear();
    const legacyRawRecord: FarmEvent = {
      ...QA_FIXTURE_REAL_ACTUAL_COST,
      eventId: 'LEGACY-RELOAD-01',
      confidence: 0.95,
      confidenceSource: undefined,
      verificationStatus: 'confirmed',
      activitySource: undefined,
      evidenceType: undefined,
      confirmationStatus: undefined,
      costType: undefined,
    };
    mockStorage.setItem('farm_intel_farmer_records_v1', JSON.stringify([legacyRawRecord]));

    const reloadedLegacy = ActivityStorageService.loadFarmerRecords();
    assert.equal(reloadedLegacy.success, true);
    assert.equal(reloadedLegacy.data.length, 1);
    assert.equal(reloadedLegacy.data[0].confidence, undefined, 'Invented confidence must be stripped on reload');
    assert.equal(
      reloadedLegacy.data[0].verificationStatus,
      'unverified',
      'Unsupported verificationStatus must be normalized on reload'
    );
    assert.equal(reloadedLegacy.data[0].activitySource, 'manual_entry');
    assert.equal(reloadedLegacy.data[0].evidenceType, 'receipt');
  });

  test('d. Duplicate guard (30s window), QuotaExceededError resilience, and profile/preferences persistence survive reload', () => {
    const nowIso = new Date().toISOString();
    const freshEvent: FarmEvent = {
      ...QA_FIXTURE_REAL_ACTUAL_COST,
      eventId: 'DUP-TEST-01',
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    assert.equal(ActivityStorageService.saveRecord(freshEvent).success, true);

    // Rapid duplicate rejected by default
    const dupBlocked = ActivityStorageService.saveRecord({
      ...freshEvent,
      eventId: 'DUP-TEST-02',
    });
    assert.equal(dupBlocked.success, false);
    assert.equal(dupBlocked.isDuplicate, true);
    assert.equal(dupBlocked.code, 'DUPLICATE');

    // Explicit allowDuplicate succeeds and persists across reload
    const dupAllowed = ActivityStorageService.saveRecord(
      { ...freshEvent, eventId: 'DUP-TEST-02' },
      true
    );
    assert.equal(dupAllowed.success, true);
    assert.equal(ActivityStorageService.loadFarmerRecords().data.length, 2);

    // Quota failure during write must return QUOTA_EXCEEDED without losing existing persisted records
    mockStorage.quotaFailKeys.add('farm_intel_farmer_records_v1');
    const quotaFail = ActivityStorageService.saveRecord(QA_FIXTURE_PLOT_B_REAL);
    assert.equal(quotaFail.success, false);
    assert.equal(quotaFail.code, 'QUOTA_EXCEEDED');
    mockStorage.quotaFailKeys.clear();
    assert.equal(
      ActivityStorageService.loadFarmerRecords().data.length,
      2,
      'Existing persisted records must remain intact after QuotaExceededError'
    );

    // Profile & Preferences persistence round-trip via real localStorage keys
    const customProfile = {
      ...INITIAL_FARMER_PROFILE,
      preferredName: 'Ravi Garu (Updated)',
      experienceYears: 8,
    };
    const customPrefs = {
      ...INITIAL_FARMER_PREFERENCES,
      appLanguage: 'Hindi' as const,
      highContrast: true,
      theme: 'Dark' as const,
    };
    mockStorage.setItem('farm_intel_farmer_profile', JSON.stringify(customProfile));
    mockStorage.setItem('farm_intel_farmer_preferences', JSON.stringify(customPrefs));

    const reloadedProfile = JSON.parse(mockStorage.getItem('farm_intel_farmer_profile')!);
    const reloadedPrefs = migratePreferences(
      JSON.parse(mockStorage.getItem('farm_intel_farmer_preferences')!)
    );
    assert.equal(reloadedProfile.preferredName, 'Ravi Garu (Updated)');
    assert.equal(reloadedProfile.experienceYears, 8);
    assert.equal(reloadedPrefs.appLanguage, 'Hindi');
    assert.equal(reloadedPrefs.highContrast, true);
    assert.equal(reloadedPrefs.theme, 'Dark');
  });

  test('e. Repeated reloads never duplicate real/demo records, post-reload duplicate guard remains active, and unknown/null fields remain intact across edit and confirm reloads', () => {
    const nowIso = new Date().toISOString();
    const unknownRealRecord: FarmEvent = {
      ...QA_FIXTURE_REAL_UNKNOWN_FIELDS,
      eventId: 'NULL-RELOAD-01',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    assert.equal(ActivityStorageService.saveRecord(unknownRealRecord).success, true);

    // Repeated reloads must never duplicate real or demo records
    const r1 = ActivityStorageService.loadAllRecords();
    const r2 = ActivityStorageService.loadAllRecords();
    const r3 = ActivityStorageService.loadAllRecords();
    assert.equal(r1.data.length, INITIAL_DEMO_EVENTS.length + 1);
    assert.equal(r2.data.length, INITIAL_DEMO_EVENTS.length + 1);
    assert.equal(r3.data.length, INITIAL_DEMO_EVENTS.length + 1);

    const uniqueIds = new Set(r3.data.map((e) => e.eventId));
    assert.equal(uniqueIds.size, r3.data.length, 'Every eventId must remain unique across repeated reloads');

    // Demo-vs-real boundary stays intact after reloads
    const reloadedDemoCount = r3.data.filter((e) => e.isDemo === true).length;
    const reloadedRealCount = r3.data.filter((e) => e.isDemo === false).length;
    assert.equal(reloadedDemoCount, INITIAL_DEMO_EVENTS.length);
    assert.equal(reloadedRealCount, 1);

    // Duplicate submission after reload within 30s window is still blocked
    const postReloadDup = ActivityStorageService.saveRecord({
      ...unknownRealRecord,
      eventId: 'NULL-RELOAD-DUP',
      createdAt: new Date().toISOString(),
    });
    assert.equal(postReloadDup.success, false);
    assert.equal(postReloadDup.isDuplicate, true);
    assert.equal(postReloadDup.code, 'DUPLICATE');

    // Edit unrelated field (description) and confirm, then reload and verify all unknown/null fields stay null
    assert.equal(
      ActivityStorageService.updateRecord(
        'NULL-RELOAD-01',
        { description: 'Farmer added note without knowing quantity or cost' },
        'Added note'
      ).success,
      true
    );
    assert.equal(ActivityStorageService.confirmRecord('NULL-RELOAD-01', 'Ravi Kumar').success, true);

    const finalReload = ActivityStorageService.loadFarmerRecords();
    assert.equal(finalReload.success, true);
    assert.equal(finalReload.data.length, 1);
    const persisted = finalReload.data[0];
    assert.equal(persisted.plotId, null, 'Unknown plotId must stay null after edit/confirm reload');
    assert.equal(persisted.activityDate, null, 'Unknown activityDate must stay null after edit/confirm reload');
    assert.equal(persisted.quantity, null, 'Unknown quantity must stay null, never 0');
    assert.equal(persisted.unit, null, 'Unknown unit must stay null, never empty string');
    assert.equal(persisted.areaCoveredAcres, null, 'Unknown areaCoveredAcres must stay null, never 0');
    assert.equal(persisted.cost, null, 'Unknown cost must stay null, never 0');
    assert.equal(persisted.costType, 'unknown', 'Unknown costType must remain unknown');
    assert.equal(persisted.confirmationStatus, 'confirmed');
    assert.equal(persisted.verificationStatus, 'unverified');
    assert.equal(persisted.source, 'farmer_reported');
    assert.equal(persisted.activitySource, 'manual_entry');
    assert.equal(persisted.isDemo, false);
  });
});



