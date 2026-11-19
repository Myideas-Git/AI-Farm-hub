# AI Farm Hub — Test Register

- **Document Version**: 2.1.0 (Phase 2 Final Validation & Acceptance Preparation)
- **Last Executed**: 2026-11-19
- **Allowed Status Vocabulary**: `PASS` | `FAIL` | `BLOCKED` | `PENDING` | `NOT APPLICABLE`
- **Phase 2 Acceptance Gate**: **NOT ACCEPTED** — Automated Node logic/service tests (`59/59`), TypeScript typecheck (`tsc --noEmit`), and Vite production build (`vite build`) `PASS` with exit code `0`, but mandatory live browser/device QA (`BLOCKED` in sandbox / `PENDING` human execution), native Telugu/Hindi linguistic review (`PENDING`), and agronomic validation of demo crop cycles (`PENDING` / `FAIL` on synthetic 71-day BPT-5204 placeholder) remain open.
- **Automated Test Harness**:
  - `npm test` (`tsx --test src/tests/regression.test.ts`) — Node test runner with in-memory `MockLocalStorage` shim (no browser/DOM runner installed in `package.json`).
  - `npm run lint` (`tsc --noEmit`) — TypeScript static typecheck.
  - `npm run build` (`vite build`) — Production bundle build.

---

## 1. Automated Command Execution Evidence (`2026-11-19`)

| Command | Purpose | Exit Code | Captured Actual Output | Status |
| :--- | :--- | :---: | :--- | :---: |
| `npm test` | Node/TSX unit & service regression suite (`src/tests/regression.test.ts`) | `0` | **59 passed, 0 failed, 0 skipped, 0 cancelled** across **12 suites** (`duration_ms: 1712.10`) | `PASS` |
| `npm run lint` | TypeScript compilation & typecheck (`tsc --noEmit`) | `0` | Zero TypeScript diagnostics / errors | `PASS` |
| `npm run build` | Production Vite bundle (`vite build`) | `0` | `dist/` built cleanly in `908ms` (`1682 modules transformed`; `dist/index.html` 1.26 kB, CSS 58.67 kB, JS 898.16 kB; advisory chunk-size warning > 500 kB) | `PASS` |

> **Scope Boundary (Factual)**: This environment does **not** have Chromium/Chrome, Playwright, Cypress, Puppeteer, jsdom, or React Testing Library installed (`docs/BROWSER_DEVICE_EVIDENCE_REGISTER.md` §1). Every `PASS` in Sections 1–2 proves **Node-executed TypeScript module logic, storage-service behavior, state validation, and dictionary key parity only** — never browser DOM rendering, physical reload persistence, touch usability, hardware APIs, or Telugu/Hindi linguistic quality.

---

## 2. Automated Test Suite Register (`src/tests/regression.test.ts`)

| Test ID | Suite | What Is Actually Executed | Scope & Limitation Note | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TEST-BUILD-01** | Build & Types | `npm run lint` (`tsc --noEmit`) | Exit code `0`, zero type errors | `PASS` |
| **TEST-BUILD-02** | Build & Types | `npm run build` (`vite build`) | Exit code `0`; generated `dist/` production bundle | `PASS` |
| **TEST-REG-01..03** | Defect 1: Provenance & Confirmation (3 tests) | `ActivityStorageService.confirmRecord`, `updateRecord`, `deleteRecord` | Verifies original `source` preserved on confirmation, `verificationStatus` not elevated, immutable `correctionHistory` appended, baseline demo delete rejected (`NOT_FOUND`) (Node service only) | `PASS` |
| **TEST-REG-04..05** | Defect 2 & 3: Reset Semantics (2 tests) | `ActivityStorageService.resetAllFarmerRecords` | Verifies farmer records cleared on success and explicit `{ success: false, error }` returned when storage throws (Node service only) | `PASS` |
| **TEST-REG-06..08** | Defect 4: Dictionary Structure (3 tests) | Structural presence of sections/keys in `TRANSLATIONS` (TE/EN/HI) | Structural key check only — does **not** prove Telugu/Hindi linguistic quality (`MQA-I18N-04` remains `PENDING`) | `PASS` |
| **TEST-REG-09..15** | Defect 5: Voice Extractor & Local Date (7 tests) | `getLocalDateString`, `VoiceExtractorService.extractFromTranscript` | Verifies local `YYYY-MM-DD`, zero invented chemicals, explicit Urea extraction, `isDateAssigned` review flag, spoken yesterday, correction phrases, `extractionEngine === 'rule_based'` (Node logic only; live mic `MQA-MOB-03` `BLOCKED`) | `PASS` |
| **TEST-PHASE2-01..04** | Phase 2: Memory, Evidence & Timeline Data (4 tests) | Save/reload round-trip via `ActivityStorageService` + `calculateFarmSummary`, 8 evidence labels across EN/TE/HI, anti-estimate-as-fact guard, Plot A chronological memory sequence | Tests real storage service + summary computation; visual card/modal rendering remains `BLOCKED` in live browser (`MQA-UI-*`) | `PASS` |
| **TEST-P0-DEMO-01..06** | Fix P0: Demo Data Boundary & Summaries (6 tests) | `calculateFarmSummary` & `filterFarmEvents` across `QA_MIXED_DATASET` and persisted records | Proves demo costs excluded from `realExpenditure`, real non-estimated costs counted once, estimated costs excluded from actual spend, demo events excluded from real confirmed/evidence/yield counts, `excludeDemo` omits synthetic records, filtering never mutates input or storage | `PASS` |
| **TEST-P0-PROV-01..08** | Fix P0: Origin, Evidence, Confirmation & Verification (8 tests) | `ActivityStorageService`, `evaluateEvidenceVerificationSupport`, `normalizeEventProvenance`, `INITIAL_DEMO_EVENTS`, `DEMO_PLOTS` | Proves confirmation does not alter `verificationStatus` or overwrite original `source`/`activitySource`; rejects confirming estimates/demo records; GPS/weather/receipt/photo/manual cannot independently verify field activities; unknown values remain `null`; multi-reload round-trip preserves edits, confirmations, and provenance | `PASS` |
| **TEST-P1-CONF-01..06** | Fix P1: Confidence Removal & Yield Basics (6 tests) | `sanitizeEventConfidence`, `ActivityStorageService.saveRecord`, `convertQuintalsToKilograms`, `TRANSLATIONS` | Proves zero seeded demo events carry invented confidence; strips unsupported/manual/GPS/out-of-range confidence; preserves documented `web_speech_api_asr` and explicit `synthetic_demo_only`; checks missing-confidence & missing-yield localization keys | `PASS` |
| **TEST-P1-CYCLE-01..06** | Fix P1: Crop Lifecycle & Area Baseline (6 tests) | `validateFarmAreaBaseline`, `validateCropCycleState`, `hasExpectedHarvestPassedWithoutActual`, `validateCropStageTransition`, `validateCycleStatusTransition` | Proves 2 ac Paddy + 3 ac Groundnut = 5.0 ac; reconciles Plot A active `land_preparation` vs. prior completed demo cycle; flags contradictory states/dates/progress/premature yield; never infers actual harvest from passed expected date; enforces stage/status state machine; removes unverified ICAR rationale. *(Does NOT validate biological agronomy of demo dates — see `docs/AGRONOMIC_VALIDATION_REGISTER.md`)* | `PASS` |
| **TEST-P2-FILTER-01..03** | Fix P2: Plot Isolation & Empty Summary (3 tests) | `calculateFarmSummary` with `plotId` and empty array | Proves selected-plot isolation, safe zero counts on empty results, and multi-plot aggregation | `PASS` |
| **TEST-P2-YIELD-I18N-01..06** | Phase 2: Dynamic Yield, Evidence Wording & Localization Audit (6 tests) | `convertQuintalsToKilograms`, `formatYieldDisplay`, `formatUnitLabel`, `getLocalizedStorageError`, `auditTranslationCoverage`, `resolveTranslationWithFallback`, `getTranslations` | Proves dynamic quintal→kg calculation (no hardcoded `1,850 kg`), explicit missing-yield display, farmer-confirmed vs. independently-verified wording separation across EN/TE/HI, localized units & storage errors, 100% structural key parity across **576** leaf keys, and English fallback safety | `PASS` |
| **TEST-P2-FINAL-01..05** | Final Phase 2 Regression: Filter/Search/Plot/Summary Agreement & Storage Reload Durability (5 tests) | `filterFarmEvents`, `calculateFarmSummary`, `ActivityStorageService`, `migratePreferences` | Proves search/filter/plot/tab-count/summary agreement (`TEST-P2-FINAL-01`); multi-reload persistence of edits/confirmations/deletions (`02`); corrupt JSON quarantine & legacy normalization (`03`); 30s duplicate guard, `QuotaExceededError` & profile/preference reload (`04`); zero duplicates across repeated reloads, post-reload duplicate guard, and strict `null`/unknown preservation across edit + confirm reloads (`05`) | `PASS` |

---

## 3. Translation Key Coverage Audit (Structural Only)

Executed via `auditTranslationCoverage(lang)` against `TRANSLATIONS.English`:

| Language | Reference Keys | Missing Keys | Empty Keys | Extra Keys | Structural Parity Status | Native Linguistic Review Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| English | 576 | 0 | 0 | 0 | `PASS` (100%) | `NOT APPLICABLE` (Source baseline) |
| Telugu | 576 | 0 | 0 | 0 | `PASS` (100%) | `PENDING` (See `docs/TRANSLATION_REVIEW_SHEET.md`) |
| Hindi | 576 | 0 | 0 | 0 | `PASS` (100%) | `PENDING` (See `docs/TRANSLATION_REVIEW_SHEET.md`) |

---

## 4. Manual Browser, Device, Linguistic & Agronomic Gate Summary

| Blocker Group | Test IDs / Register | Automated Coverage | Live / Human Gate Status | Tracking Document |
| :--- | :--- | :--- | :---: | :--- |
| **Blocker 1A — Live Browser Persistence & Hard Reload** | `MQA-PER-01` – `MQA-PER-07` | Node `MockLocalStorage` service tests `PASS` | `BLOCKED` | `docs/MANUAL_QA_CHECKLIST.md`, `docs/BROWSER_DEVICE_EVIDENCE_REGISTER.md` |
| **Blocker 1B — Live Browser UI Rendering & Boundaries** | `MQA-UI-01` – `MQA-UI-08` | Node summary/filter/yield logic tests `PASS` | `BLOCKED` | `docs/MANUAL_QA_CHECKLIST.md`, `docs/BROWSER_DEVICE_EVIDENCE_REGISTER.md` |
| **Blocker 1C — Live Multilingual UI & Indic Layout** | `MQA-I18N-01` – `MQA-I18N-03` | Node 576-key parity audit `PASS` | `BLOCKED` | `docs/MANUAL_QA_CHECKLIST.md`, `docs/BROWSER_DEVICE_EVIDENCE_REGISTER.md` |
| **Blocker 1D — Mobile Usability, Sunlight & Hardware APIs** | `MQA-MOB-01` – `MQA-MOB-04` | Node `VoiceExtractorService` logic `PASS` (no device/mic/cam) | `BLOCKED` | `docs/MANUAL_QA_CHECKLIST.md`, `docs/BROWSER_DEVICE_EVIDENCE_REGISTER.md` |
| **Blocker 2 — Native Telugu & Hindi Linguistic Review** | `MQA-I18N-04` (576 keys) | Structural key parity only (`PASS`) | `PENDING` | `docs/TRANSLATION_REVIEW_SHEET.md` |
| **Blocker 3 — Agronomic Validation of Demo Crop Cycles** | `cycle-paddy-current`, `cycle-paddy-01`, `cycle-groundnut-01`, `K-6`, `MEM-PAD-06` | State-machine & area baseline logic `PASS` | `PENDING` *(71-day BPT-5204 duration mismatch = `FAIL` as realistic agronomy)* | `docs/AGRONOMIC_VALIDATION_REGISTER.md` |
