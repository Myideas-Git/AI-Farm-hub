# AI Farm Hub — Changelog

All notable changes to the AI Farm Hub project are documented in this file.

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
