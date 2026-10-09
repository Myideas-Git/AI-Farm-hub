# AI Farm Hub — Test Register

- **Document Version**: 1.1.0
- **Execution Date**: October 2026
- **Test Harness**: TypeScript Verification (`npm run lint`), Production Build Compilation (`npm run build`), Module Unit/Regression Validation

---

## 1. Executed Test Cases

| Test ID | Requirement ID | Scenario | Test Inputs / Procedure | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TEST-BUILD-01** | Repository Integrity | TypeScript Typecheck & Lint | Execute `npm run lint` (`tsc --noEmit`) | 0 TypeScript errors | Exited with code 0, 0 errors | **Passed** |
| **TEST-BUILD-02** | Repository Integrity | Production Vite Build | Execute `npm run build` (`vite build`) | Successful build output in `dist/` | Build succeeded in 321ms, `dist/index.html` created | **Passed** |
| **TEST-STOR-01** | AFH-001 | Successful Activity Save | Call `saveRecord` with valid `FarmEvent` | Returns `success: true`, record persisted in `localStorage` | `success: true`, data returned, loaded by `loadAllRecords` | **Passed** |
| **TEST-STOR-02** | AFH-001 | Quota / Storage Failure Handling | Simulate `QuotaExceededError` in `saveRecord` | Returns `success: false, code: 'QUOTA_EXCEEDED'`, error message displayed | `success: false`, useful error returned, inputs preserved in form | **Passed** |
| **TEST-STOR-03** | AFH-001 | Corrupted JSON Quarantine | Seed `localStorage` with non-JSON string `"{bad"` | Does not erase history silently; backs up to `farm_intel_corrupt_backup_*`; returns `isCorrupt: true` | Data quarantined to backup key; `isCorrupt: true` returned; baseline demo preserved | **Passed** |
| **TEST-STOR-04** | AFH-002 | Duplicate Double-Submission Prevention | Submit identical activity twice within 10 seconds | Second submission flagged with `isDuplicate: true, code: 'DUPLICATE'` | Duplicate rejected with clear error; farmer prompted before re-recording | **Passed** |
| **TEST-PROV-01** | AFH-003 | Manual Entry Provenance | Submit manual detailed form in `RecordScreen` | `source: 'farmer_reported', status: 'pending_confirmation', verificationStatus: 'pending'` | Created with `farmer_reported` and `pending_confirmation`, not auto-confirmed | **Passed** |
| **TEST-PROV-02** | AFH-003 | Explicit Farmer Confirmation | Click "Confirm Record" on timeline card | Calls `confirmRecord`, status becomes `farmer_confirmed`, `confirmedBy` set to farmer name | Status updated to `farmer_confirmed`, `confirmedBy` populated, history preserved | **Passed** |
| **TEST-ID-01** | AFH-004 | Active Profile Identity Validation | Create record via `QuickRecordModal` | Uses `farmerId: 'farmer-ravi-01'`, `farmId: 'farm-ravi-01'`, `createdBy: 'Ravi Kumar'` | All created records reference active farmer Ravi Kumar and farm IDs | **Passed** |
| **TEST-EDIT-01** | AFH-005 | Edit Correction History | Edit title & quantity on saved event | `correctionHistory` records old and new values, timestamps, and reason | Event updated with `correctionHistory` containing 2 entries; prior source preserved | **Passed** |
| **TEST-I18N-01** | AFH-006 | Telugu Language Rendering | Select `appLanguage: 'Telugu'` | TopBar, BottomNav, Quick modal, Status indicators, Market banner in Telugu | All labels render in Telugu (e.g. 'హోమ్', 'నా పొలం', 'నమోదు') | **Passed** |
| **TEST-I18N-02** | AFH-006 | Hindi Language Rendering | Select `appLanguage: 'Hindi'` | TopBar, BottomNav, Quick modal, Status indicators in Hindi | All labels render in Hindi (e.g. 'होम', 'मेरा खेत', 'दर्ज करें') | **Passed** |
| **TEST-I18N-03** | AFH-006 | Document Lang Attribute Sync | Switch between English, Telugu, Hindi | `<html lang>` updates to `en`, `te`, `hi` respectively | `document.documentElement.lang` synced in `useEffect` | **Passed** |
| **TEST-VOICE-01**| AFH-007 | "Applied fertilizer to paddy" | Input transcript: "I applied fertilizer to my paddy field." | `eventType: 'fertilizer', fertilizerName: null, quantity: null, area: null, crop: 'Paddy', plot: 'plot-a'` | Zero invented values. Fertilizer name and quantity flagged for clarification | **Passed** |
| **TEST-VOICE-02**| AFH-007 | "50 kg urea on 2-acre plot yesterday" | Input transcript: "I used 50 kilograms of urea on my two-acre paddy plot yesterday." | `fertilizerName: 'Urea', quantity: 50, unit: 'kg', area: 2.0, plot: 'plot-a', date: yesterdayLocal` | All mentioned facts extracted accurately without hallucinations | **Passed** |
| **TEST-VOICE-03**| AFH-007 | "Sprayed medicine on crop" | Input transcript: "I sprayed medicine on the crop." | `eventType: 'spray', productName: null, isTentative: true, quantity: null` | Chemical/pesticide name NOT invented. Kept empty with clarification prompt | **Passed** |
| **TEST-DATE-01** | AFH-008 | Local Date Calculation | Call `getLocalDateString()` | Returns `YYYY-MM-DD` in local timezone, matching calendar day | Matches local calendar date; no UTC midnight drift | **Passed** |
| **TEST-RESET-01**| AFH-009 | Safe Reset Cancellation | Click Reset, then click Cancel in modal | Modal closes, zero records deleted, state intact | Data completely untouched on Cancel | **Passed** |
| **TEST-RESET-02**| AFH-009 | Safe Reset Confirmation | Click Reset, click Confirm in modal | Farmer-created records cleared, baseline demo data intact | Farmer records cleared; demo records preserved; storage updated | **Passed** |
| **TEST-STATUS-01**| AFH-010 | Honest Simulation Disclosure | Inspect `OfflineStatusIndicator` & `MarketScreen` | Indicators state local memory simulation; no fake "cloud backup" | Shows "Local browser memory active" and "DEMO MARKET DATA — NOT LIVE" | **Passed** |

---

## 2. Planned Future Tests (Deferred to Phase 1.0+)

| Test ID | Scope | Planned Feature | Dependency |
| :--- | :--- | :--- | :--- |
| **TEST-PWA-01** | PWA Service Worker | Offline asset caching & background sync | Phase 1.0 PWA setup |
| **TEST-AI-01** | Generative AI Advisory | Gemini API multimodal crop question answering | Phase 1.5 Gemini SDK integration |
| **TEST-MANDI-01** | Live Mandi Feeds | Real-time APMC e-NAM API price ingestion | Phase 2.0 Gov API access |
