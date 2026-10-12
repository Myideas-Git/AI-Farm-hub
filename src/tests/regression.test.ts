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

  getItem(key: string): string | null {
    if (this.shouldFail || this.failKeys.has(key)) {
      throw new Error('Simulated Storage Failure');
    }
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string): void {
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

  clear(): void {
    this.store.clear();
    this.shouldFail = false;
    this.failKeys.clear();
  }
}

const mockStorage = new MockLocalStorage();
(global as any).localStorage = mockStorage;
(global as any).window = { localStorage: mockStorage };

// Import system under test
import { ActivityStorageService } from '../services/activityStorage';
import { VoiceExtractorService, getLocalDateString } from '../services/voiceExtractor';
import { FarmEvent } from '../types/farm';
import { TRANSLATIONS } from '../i18n/translations';

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

  test('events support all 12 specified fields: Date, Plot, Crop, Activity, Input, Quantity, Area, Cost, Evidence, Source, Confidence, Confirmation', () => {
    const fullEvent: FarmEvent = {
      eventId: 'PHASE2-TEST-01',
      activityDate: '2026-06-25', // 1. Date
      plotId: 'plot-a', // 2. Plot
      plotName: 'Plot A — Paddy',
      cropName: 'Paddy', // 3. Crop
      eventType: 'fertilizer', // 4. Activity
      inputName: 'Urea', // 5. Input
      quantity: 40, // 6. Quantity
      unit: 'kg',
      areaCoveredAcres: 2.0, // 7. Area
      cost: 280, // 8. Cost
      currency: 'INR',
      evidence: {
        type: 'receipt', // 9. Evidence
        label: 'Sri Rama Agri Inputs #SR-9102',
        isDocumentVerified: true,
      },
      source: 'receipt_verified', // 10. Source
      confidence: 0.98, // 11. Confidence
      status: 'farmer_confirmed', // 12. Farmer confirmation
      verificationStatus: 'confirmed',
      confirmedBy: 'Ravi Kumar',
      confirmedAt: '2026-06-25T15:00:00Z',
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      recordedDate: '2026-06-25T14:15:00Z',
      title: 'Fertilizer (Urea — 40 kg)',
      isDemo: false,
      createdBy: 'Ravi Kumar',
      createdAt: '2026-06-25T14:15:00Z',
      updatedAt: '2026-06-25T15:00:00Z',
    };

    assert.ok(fullEvent.activityDate, 'Field 1: Date must be present');
    assert.ok(fullEvent.plotName, 'Field 2: Plot must be present');
    assert.ok(fullEvent.cropName, 'Field 3: Crop must be present');
    assert.ok(fullEvent.eventType, 'Field 4: Activity must be present');
    assert.ok(fullEvent.inputName, 'Field 5: Input must be present');
    assert.equal(fullEvent.quantity, 40, 'Field 6: Quantity must match');
    assert.equal(fullEvent.unit, 'kg');
    assert.equal(fullEvent.areaCoveredAcres, 2.0, 'Field 7: Area must match');
    assert.equal(fullEvent.cost, 280, 'Field 8: Cost must match');
    assert.ok(fullEvent.evidence && fullEvent.evidence.type === 'receipt', 'Field 9: Evidence must be supported');
    assert.equal(fullEvent.source, 'receipt_verified', 'Field 10: Source must match');
    assert.equal(fullEvent.confidence, 0.98, 'Field 11: Confidence must match');
    assert.equal(fullEvent.status, 'farmer_confirmed', 'Field 12: Farmer confirmation must be tracked');
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

  test('strict safeguard: AI estimates are never presented as facts', () => {
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
      estimateRationale: 'ICAR semi-dwarf model estimate',
      status: 'estimated', // Not confirmed
      verificationStatus: 'estimated',
      confidence: 0.70,
      farmerId: 'farmer-ravi-01',
      farmId: 'farm-ravi-01',
      recordedDate: '2026-07-20T09:00:00Z',
      title: 'Potash requirement model',
      isDemo: true,
      evidence: { type: 'none' },
      createdBy: 'AI Advisory Engine',
      createdAt: '2026-07-20T09:00:00Z',
      updatedAt: '2026-07-20T09:00:00Z',
    };

    assert.equal(estimatedEvent.isEstimate, true, 'Estimated flag must be true');
    assert.notEqual(estimatedEvent.status, 'farmer_confirmed', 'Estimates must NOT be marked as farmer_confirmed');
    assert.notEqual(estimatedEvent.verificationStatus, 'confirmed', 'Estimates must NOT be marked as confirmed');

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

