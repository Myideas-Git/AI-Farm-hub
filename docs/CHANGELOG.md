# AI Farm Hub — Changelog

All notable changes to the AI Farm Hub project are documented in this file.

---

## [Phase 2 — Final Acceptance Preparation (External Validation Tracks A, B & C)] - 2026-11-19

### Gate Status
- **Application Code**: Unchanged from passing implementation (`npm test`: `59/59` passed across `12` suites, exit `0`; `npm run lint`: exit `0`; `npm run build`: exit `0`).
- **Phase 2 Acceptance**: **PENDING / NOT ACCEPTED** until all required human and device evidence is recorded across Tracks A, B, and C.

### Exact Validation Documents Updated

| File | Why It Changed |
| :--- | :--- |
| `docs/BROWSER_DEVICE_EVIDENCE_REGISTER.md` | Upgraded for **Track A**: added 3-environment Coverage Matrix (`ENV-DESK-CHROME`, `ENV-AND-CHROME` `360–412px`, `ENV-IOS-SAFARI` `375–430px` = `38` required executions across `22` mandatory tests, explicitly marking non-required environment cells) and full per-test execution records with device/OS/browser/viewport/screenshot/DevTools/defect/tester fields (`BLOCKED`/`PENDING`, zero fabricated evidence). |
| `docs/TRANSLATION_REVIEW_SHEET.md` | Upgraded for **Track B**: regenerated all `576` keys directly from `src/i18n/translations.ts` with all `10` dedicated review columns (`Translation Key`, `English Source`, `Telugu Translation`, `Hindi Translation`, `Farming Context`, `Telugu Reviewer Feedback`, `Hindi Reviewer Feedback`, `Correction Required`, `Final Approved Translation`, `Reviewer Name & Approval Date`) plus a Core Terminology Consistency table; all human approvals kept `PENDING`. |
| `docs/AGRONOMIC_VALIDATION_REGISTER.md` | Upgraded for **Track C**: formatted as an Expert Review Document for **ANGRAU / RARS Anakapalli / KVK Kondempudi** tracing exact repository origin of `cycle-paddy-01` dates (`2026-06-10` → `2026-08-20`), explaining the 71-day BPT-5204 biological inconsistency without silently altering code, adding milestone clarification questions (nursery vs. sowing vs. transplanting vs. harvest), auditing North Coastal Zone missing parameters, separating general literature from local recommendations, and providing the 8-column Expert Decision Table (`PENDING`, zero invented credentials/approvals). |
| `docs/MANUAL_QA_CHECKLIST.md` | Synchronized master checklist matrix and external sign-off gates with Track A (`38` required environment runs), Track B (`576` keys), and Track C (Expert Decision Table). |
| `docs/REQUIREMENTS_TRACKER.md` | Synchronized every requirement's external validation dependency with Tracks A, B, and C while maintaining Phase 2 acceptance strictly `PENDING`. |

---

## [Phase 2 — Final Validation & Acceptance Preparation] - 2026-11-19

### Gate Status
- **Automated Verification**: `npm test` (`59/59` passed across `12` suites, exit `0`), `npm run lint` (`tsc --noEmit`, exit `0`), `npm run build` (`vite build`, exit `0`).
- **Phase 2 Acceptance**: **NOT ACCEPTED** — Blocker 1 (live browser/device QA) is `BLOCKED` in sandbox / `PENDING` human execution, Blocker 2 (native Telugu & Hindi linguistic review) is `PENDING`, and Blocker 3 (agronomic validation of synthetic demo crop cycles, including `cycle-paddy-01`'s 71-day BPT-5204 duration mismatch) is `PENDING`.

### Exact Files Added / Changed & Rationale

| File | Why It Changed |
| :--- | :--- |
| `src/i18n/translations.ts` | Pre-review terminology audit caught `insights.sampleInsightDetail` using verification wording (`ధృవీకరించబడలేదు` / `सत्यापित नहीं`) in Telugu and Hindi while English used `confirmed yet`; aligned both to farmer-confirmation wording (`రైతు నిర్ధారించలేదు` / `किसान द्वारा पुष्ट नहीं हैं`). |
| `src/tests/regression.test.ts` | Added `TEST-P2-FINAL-05` (`59th` automated test) proving repeated reloads never duplicate real or demo records, post-reload duplicate guard remains active, and unknown/`null` fields (`plotId`, `activityDate`, `quantity`, `unit`, `areaCoveredAcres`, `cost`, `costType: 'unknown'`) survive save → reload → edit → confirm → reload intact. |
| `docs/MANUAL_QA_CHECKLIST.md` | Upgraded into a full Manual QA Execution Matrix (`MQA-PER-01..07`, `MQA-UI-01..08`, `MQA-I18N-01..04`, `MQA-MOB-01..04`) with preconditions, automation feasibility, truthful sandbox `BLOCKED`/`PENDING` statuses, persistence invariant coverage map, and sign-off gate. |
| `docs/BROWSER_DEVICE_EVIDENCE_REGISTER.md` | Created Browser & Device Test Evidence Register documenting verified sandbox absence of Chromium/Playwright/mobile hardware, Node-executed persistence evidence, static responsive UI observations (`TopBar.tsx` `min-h-[36px]` mobile profile button; `BottomNavigation.tsx` `max-w-[55px]` Indic label truncation watch), and live browser/device evidence capture tables. |
| `docs/TRANSLATION_REVIEW_SHEET.md` | Created complete reviewer-ready Telugu & Hindi Native Linguistic Review Sheet covering all `576` leaf keys verbatim across 8 priority categories, with context, targeted terminology comments, and `PENDING` native reviewer approval statuses. |
| `docs/AGRONOMIC_VALIDATION_REGISTER.md` | Created Agronomic Validation Register auditing all demo crop cycles (`cycle-paddy-current`, `cycle-paddy-01`, `cycle-groundnut-01`), `K-6` market benchmark reference, and `MEM-PAD-06` Potash placeholder against verified ANGRAU / ICAR-IIRR / ICAR-DGR sources, explicitly documenting `cycle-paddy-01`'s 71-day vs. 135–145 day BPT-5204 mismatch and missing local Anakapalli KVK calendars. |
| `docs/REQUIREMENTS_TRACKER.md` | Standardized all statuses to strict vocabulary (`PASS`/`FAIL`/`BLOCKED`/`PENDING`/`NOT APPLICABLE`), separating automated Node verification from real-world acceptance gates and linking all new registers. |
| `docs/TEST_REGISTER.md` | Standardized all statuses to strict vocabulary, captured `59/59` `npm test`, `npm run lint`, and `npm run build` outputs, and linked all blocker registers. |

---

## [Phase 2 — Remediation, Validation & Final Regression Pass] - 2026-11-18

### Gate Status
- **Automated Verification**: `npm test` (58/58 passed across 12 suites, exit `0`), `npm run lint` (`tsc --noEmit`, exit `0`), `npm run build` (`vite build`, exit `0`).
- **Phase 2 Acceptance**: **NOT YET ACCEPTED** — Pending manual live-browser/mobile-device QA (`docs/MANUAL_QA_CHECKLIST.md`), native Telugu/Hindi linguistic review, and agronomic validation of synthetic demo crop dates/durations.

### Exact Files Changed & Rationale

| File | Why It Changed |
| :--- | :--- |
| `src/types/farm.ts` | Added separated provenance and integrity fields (`ActivitySource`, `EvidenceType`, `ConfirmationStatus`, `CostType`, `AgronomicValidationStatus`, `ConfidenceSource`, `verificationMechanism`) so activity origin, evidence, farmer confirmation, independent verification, cost type, and synthetic demo flags are never conflated. |
| `src/utils/farmSummary.ts` | Created centralized production calculation, filtering, validation, and formatting engine: `calculateFarmSummary` (strict demo-vs-real & actual-vs-estimated boundary), `filterFarmEvents` (non-mutating filter supporting date/crop/type search and provenance-aware `farmer_confirmed`/evidence filtering), `evaluateEvidenceVerificationSupport`, `normalizeEventProvenance`, `sanitizeEventConfidence`, crop lifecycle state machine (`validateCropCycleState`, `validateCropStageTransition`, `validateCycleStatusTransition`, `hasExpectedHarvestPassedWithoutActual`, `validateFarmAreaBaseline`), dynamic yield helpers (`convertQuintalsToKilograms`, `formatYieldDisplay`), `formatUnitLabel`, and `getLocalizedStorageError`. |
| `src/services/activityStorage.ts` | Enforced demo exclusion in `saveRecord`, separated provenance preservation across `updateRecord` and `confirmRecord`, rejection of estimate confirmation (`INVALID_STATE`), provenance/confidence normalization on both save and `loadFarmerRecords` reload, and corrected estimate rejection wording so confirmation is not equated to verification. |
| `src/data/mockFarmData.ts` | Reconciled Andhra Pradesh 5-acre demo baseline (Plot A: 2.0 acres Paddy + Plot B: 3.0 acres Groundnut), separated Plot A's active `land_preparation` cycle (`cycle-paddy-current`) from its prior completed synthetic demo cycle (`cycle-paddy-01`), removed all hardcoded/invented confidence scores (`0.95`/`0.92`/`0.98`/`0.88`), removed unsupported `verificationStatus: 'confirmed'` / `isDocumentVerified: true` claims and unverified ICAR rationale, and tagged all demo cycles `agronomicValidationStatus: 'unvalidated_demo'`. |
| `src/i18n/translations.ts` | Corrected farmer-confirmed vs. independently-verified wording across EN/TE/HI (`sources.receipt_verified` → `Receipt Attached (Purchase Record)`, Telugu `రైతు నిర్ధారించారు` vs. `స్వతంత్రంగా ధృవీకరించబడింది`), added complete localized labels/tooltips/units/errors/banners (`576` keys at 100% structural parity across EN/TE/HI), strengthened `getTranslations` with recursive key-level English fallback (`resolveTranslationWithFallback`), and exported `collectTranslationKeyPaths` & `auditTranslationCoverage`. |
| `src/components/common/EvidenceBadge.tsx` | Replaced inline hardcoded strings and misleading receipt verification tooltips with centralized localized `t.evidenceBadges.*` sublabels and tooltips clarifying evidence limitations. |
| `src/components/common/TrustIndicator.tsx` | Standardized localized labels separating `farmerConfirmed`, `independentlyVerified`, and `unverified` across EN/TE/HI. |
| `src/components/common/ErrorState.tsx` | Added `language` prop and localized default titles, descriptions, retry labels, and offline-cache notes. |
| `src/components/common/EmptyState.tsx` | Added `language` prop and localized default empty-state headings, descriptions, and action labels. |
| `src/components/common/QuickRecordModal.tsx` | Preserved separated provenance (`activitySource: 'manual_entry'`, `verificationStatus: 'unverified'`), localized plot units, operation options, unit options, placeholders, and storage error messages via `getLocalizedStorageError`, and updated fallback cycle ID to `cycle-paddy-current`. |
| `src/components/layout/TopBar.tsx` | Localized navigation `aria-label` and profile/settings tooltip suffix. |
| `src/components/layout/BottomNavigation.tsx` | Localized mobile navigation `aria-label`. |
| `src/components/timeline/FarmTimeline.tsx` | Wired reusable `filterFarmEvents` & `calculateFarmSummary(filteredEvents)` so filters, search, selected plot, category tab counts (`All === Farmer + Demo`), and summary cards strictly agree; added `defaultPlotId` sync; resolved open detail modal dynamically by `eventId` so edits & confirmations reflect persisted state immediately; guarded confirm buttons against demo/estimated events; hardened quantity parsing against `NaN`; formatted quintal harvests dynamically via `formatYieldDisplay` and units via `formatUnitLabel`; removed unsupported confidence display; localized remaining UI copy and tooltips. |
| `src/components/screens/MyFarmScreen.tsx` | Separated active current cycle display from prior completed demo cycle disclosure box; wired `formatYieldDisplay` (dynamic kg conversion + explicit missing yield); passed `key={selectedPlot.id}` and `defaultPlotId={selectedPlot.id}` to `FarmTimeline` so plot switching stays synchronized; localized crop/acre/stage/harvest labels. |
| `src/components/screens/HomeScreen.tsx` | Wired `calculateFarmSummary` so real counts are never contaminated by demo events; derived crop stages from active cycles; passed `language` to `TrustIndicator` and localized `[DEMO]` tag. |
| `src/components/screens/MarketScreen.tsx` | Wired `formatYieldDisplay` and `getTranslations` for dynamic kg conversion, missing-yield handling, acreage units, and localized price trend badges. |
| `src/components/screens/RecordScreen.tsx` | Wired `getTranslations` and `getLocalizedStorageError`; localized capture tabs, voice/camera headers, safety policy disclosures, 1-tap quick loggers, form labels/options/placeholders, and duplicate modal; ensured saved records use separated provenance without invented confidence. |
| `src/components/profile/ProfileModal.tsx` | Localized storage/quota error handling and dialog labels via `getTranslations`. |
| `src/App.tsx` | Localized offline/pending/sunlight banners, corrupt-storage quarantine notice, reset error strings, and tooltips; passed `language` to `EmptyState` and `ErrorState`. |
| `src/tests/qaFixtures.ts` | Added typed QA fixtures covering demo, real, estimated, unknown, multi-plot, harvest, and all 4 evidence-limited over-claim cases (GPS, receipt, weather, photograph). |
| `src/tests/regression.test.ts` | Replaced object-construction checks with behavioral tests across 12 suites (58 tests) covering demo exclusion, summary totals, separated provenance, confidence stripping, crop lifecycle state machine, dynamic yield & missing yield, EN/TE/HI key parity & fallback, filter/search/plot/summary agreement, and full storage/reload/corruption/duplicate/quota/profile persistence. |
| `docs/DATA_DICTIONARY.md` | Created complete data dictionary defining every entity field, union/enum allowed values, nullability/unknown rules, and browser `localStorage` keys. |
| `docs/MANUAL_QA_CHECKLIST.md` | Created executable manual browser, mobile device, language-switching, and domain sign-off checklist for non-automated verification. |
| `docs/TEST_REGISTER.md` | Replaced stale/unsupported pass claims (19 tests, unchecked DOM/UI assertions) with verified automated test evidence (`58/58`), exact command exit codes, structural-only i18n caveat, and pending manual QA items. |
| `docs/REQUIREMENTS_TRACKER.md` | Removed nonexistent test IDs and updated each requirement with evidence-backed statuses distinguishing automated logic/service checks from pending manual/linguistic/agronomic sign-offs. |
| `docs/CHANGELOG.md` | Added this Phase 2 Remediation & Validation release entry documenting exact files changed and why. |

---

## [Phase 2 — Farm Memory + Timeline] - 2026-10-12

### Summary of Changes
- **Activity Timeline 12-Field Data Model**:
  - Implemented complete representation of all 12 specified fields for every farm event: Date (`activityDate`), Plot (`plotId`, `plotName`), Crop (`cropName`), Activity (`eventType`), Input (`inputName`), Quantity (`quantity`, `unit`), Area (`areaCoveredAcres`), Cost (`cost`, `currency`), Evidence (`evidence`), Source (`source`), Confidence (`confidence`), and Farmer confirmation (`status: 'farmer_confirmed'`, `confirmedAt`, `confirmedBy`).
  - Implemented chronological activity timeline stream with dedicated activity icons (`🌱 Sowing`, `💧 Irrigation`, `🧪 Fertilizer`, `🐛 Pest observation`, `🧴 Pesticide / Spray`, `🌾 Harvest`).
  - Added primary input and quantity callouts directly on cards (`Urea — 40 kg`, `Drip irrigation`, `Product X — 2 acres`, `1,850 kg`).
- **Evidence Model & Standalone EvidenceBadges**:
  - Created `src/components/common/EvidenceBadge.tsx` displaying all 8 specified Evidence Model labels:
    - Farmer reported (`farmer_reported`)
    - Farmer confirmed (`farmer_confirmed`)
    - AI extracted (`ai_extracted`)
    - AI estimated (`ai_estimated`)
    - Receipt verified (`receipt_verified`)
    - GPS captured (`gps_captured`)
    - Weather data (`weather_data`)
    - Soil report (`soil_report`)
  - Full translation coverage across Telugu, English, and Hindi.
- **Strict Anti-Estimate-as-Fact Safeguards**:
  - Enforced strict rule: "Avoid presenting estimates as facts".
  - Any estimated entry (`source: 'ai_estimated'`, `isEstimate: true`, or `status: 'estimated'`) is rendered with dashed amber warning styling, warning alert icon, and explicit badge (`AI Estimated · Not verified fact`).
  - Estimates are kept distinct from actual field expenditures and recorded yields.
- **Digital Farm Memory & Crop Cycle Retrieval**:
  - Implemented interactive Crop Cycle Memory banner answering the core question: *"What have I done on this crop so far?"*
  - Automatically aggregates total activities, inputs applied, total area covered, total invested costs, and attached evidence records for any plot or crop cycle without manual reconstruction.
  - Seeded complete illustrative Kharif 2026 Paddy crop cycle corresponding to the user specification (June 10 Sowing to August 20 Harvest).
- **Automated Regression Suite**:
  - Added 4 automated regression test scenarios verifying the 12-field model, 8 evidence model labels, anti-estimate safeguard, and chronological memory retrieval (19 passed total).

---

## [Phase 0.5 — Iteration 1.2: Defect Closure] - 2026-10-09

### Summary of Changes
- **Defect 1: Confirmation, Verification, and Provenance Semantics**:
  - Maintained strict three-dimensional orthogonal model: Capture Source (`source`), Lifecycle Confirmation Status (`status`), and Third-Party Verification (`verificationStatus`).
  - Confirmed records strictly preserve original capture source (`ai_extracted`, `farmer_reported`, etc.).
  - Farmer confirmation sets `status: 'farmer_confirmed'` with `confirmedBy` and `confirmedAt`, but does NOT elevate `verificationStatus` (independent verification requires third-party certification).
  - Voice record creation removes all fixed confidence values (e.g. 0.95); confidence is populated dynamically from browser speech recognition or left undefined.
  - Edits append to `correctionHistory` without overwriting historical provenance.
  - Added automated regression tests for confirmation, provenance, and history preservation.
- **Defect 2: Profile & Preference Save Resilience**:
  - React state in `src/App.tsx` is updated only after confirmed local-storage persistence.
  - Failed writes return explicit error feedback (`QuotaExceededError` or general storage failure), keeping `ProfileModal` open and preserving draft form inputs for user retry.
  - Ensured sensitive farmer data is never logged to browser console or telemetry.
- **Defect 3: Safe Confirmed Reset & Partial Failure Reporting**:
  - Enhanced `executeReset()` in `src/App.tsx` to verify every storage operation key (`records`, `profile`, `prefs`).
  - Partial failures are reported accurately with specific error descriptions; UI never falsely claims complete reset or updates in-memory state on failed operations.
  - Preserved baseline immutable demo data across all reset modes.
- **Defect 4: Complete Multilingual Localization**:
  - Fully localized Profile tab in `ProfileModal.tsx`: demo farmer notice, full name, greeting, role, experience, digital comfort levels, location inputs, primary objectives, and objective toggle labels.
  - Localized `InsightsScreen.tsx`: demo sample title, context narrative, recommendation prompt, policy/style tags, and objective chips.
  - Localized `HomeScreen.tsx`: holding area breakdown, plot area units, primary objectives chips, and demo insight card.
  - Localized `MyFarmScreen.tsx`: plot acres units and crop label.
  - Localized `MarketScreen.tsx`: registered crop acreage units and commodity price trend indicators (Rising/Falling/Stable).
  - Localized `FarmTimeline.tsx`: demo badge, edit count, view details, edit, delete, confirm buttons, edit modal form fields, captured voice transcript note, and application-assigned date review notice.
  - Localized `RecordScreen.tsx`: saved success feedback messages for voice, manual form, and quick 1-tap actions across Telugu, English, and Hindi.
  - Created screen-by-screen localization checklist in `docs/TEST_REGISTER.md`.
- **Defect 5: Deterministic Local Dates and Voice Extraction**:
  - `VoiceExtractorService` returns local calendar date string (`YYYY-MM-DD`) via `getLocalDateString()`, preventing UTC boundary day shift.
  - Anti-invention rules: generic "fertilizer" does not assume Urea or quantity; generic "medicine" does not assume pesticide name. Unmentioned fields remain `null` and generate `needsClarification` questions.
  - Unspoken dates are explicitly flagged with `isDateAssigned: true` for farmer review.
  - Extraction engine is explicitly labelled `'rule_based'`.
  - Added automated regression tests for voice extraction and date calculation.
- **Defect 6: Documentation and Evidence Alignment**:
  - Updated `README.md`, `docs/PRODUCT_MASTER_SPEC.md`, `docs/REQUIREMENTS_TRACKER.md`, `docs/TEST_REGISTER.md`, and `docs/CHANGELOG.md`.
  - Maintained honest reporting of environment limitations (git repository absence in container, headless audio constraints).
  - Standardized requirement and test statuses.

### Files Affected
- `src/types/farm.ts`
- `src/services/activityStorage.ts`
- `src/services/voiceExtractor.ts`
- `src/components/profile/ProfileModal.tsx`
- `src/components/screens/InsightsScreen.tsx`
- `src/components/screens/HomeScreen.tsx`
- `src/components/screens/MyFarmScreen.tsx`
- `src/components/screens/MarketScreen.tsx`
- `src/components/screens/RecordScreen.tsx`
- `src/components/timeline/FarmTimeline.tsx`
- `src/App.tsx`
- `src/tests/regression.test.ts`
- `package.json`
- `README.md`
- `docs/PRODUCT_MASTER_SPEC.md`
- `docs/REQUIREMENTS_TRACKER.md`
- `docs/TEST_REGISTER.md`
- `docs/CHANGELOG.md`

---

## [Phase 0.5 — Iteration 1] - 2026-10-09

### Summary of Changes
- Fix A: Reliable Farm Activity Saving & Storage Error Handling
- Fix B: Correct Record Provenance and Identity
- Fix C: Complete English, Telugu, and Hindi UI Translations
- Fix D: Correct Voice Extraction & Prevent Invented Values
- Fix E: Safe Reset and Preference Persistence
- Fix F: Honest Offline, Sync, and Market Status
- Fix G: Initial Documentation Suite
- Fix H: Build and Lint Validation
