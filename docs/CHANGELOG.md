# AI Farm Hub — Changelog

All notable changes to the AI Farm Hub project are documented in this file.

---

## [Phase 0.5 — Iteration 1] - 2026-10-09

### Summary of Changes
- **Fix A — Reliable Farm Activity Saving & Storage Error Handling**:
  - Implemented `StorageResult<T>` and `LoadResult<T>` in `src/services/activityStorage.ts`.
  - Added corrupted storage quarantine (`farm_intel_corrupt_backup_*`), preventing accidental loss or silent empty-history masking.
  - Added `QuotaExceededError` detection and offline fallback handling.
  - Prevented duplicate accidental double submissions within 30 seconds with warning prompt.
  - Updated `App.tsx`, `RecordScreen.tsx`, and `QuickRecordModal.tsx` to verify return values before updating state or displaying success notifications; preserved entered form data on failure for retry.
  - Scrubbed sensitive farmer data from browser console logs.
- **Fix B — Correct Record Provenance and Identity**:
  - Enforced strict provenance rules: manual entry in form or 1-tap quick action is classified as `source: 'farmer_reported'` and `status: 'pending_confirmation'`, `verificationStatus: 'pending'`.
  - Disallowed automatic marking of new records as `farmer_confirmed` or independently verified.
  - Preserved correction history in `correctionHistory` during edits without upgrading provenance.
  - Updated all references to active demo farmer `farmer-ravi-01` (Ravi Kumar) and farm `farm-ravi-01`. Removed legacy `farmer-01` / `farm-01`.
- **Fix C — Complete English, Telugu, and Hindi UI Translations**:
  - Expanded `src/i18n/translations.ts` with comprehensive Telugu, Hindi, and English dictionaries covering TopBar, BottomNav, Quick modal, reset modal, market simulation, trust badges, and error states.
  - Implemented safe fallback helper `getTranslations(lang)` ensuring missing keys fall back to English without crashing or showing raw keys.
  - Added dynamic document metadata synchronization updating `<html lang>` attribute (`te`, `en`, `hi`).
  - Localized `TrustIndicator.tsx`, `OfflineStatusIndicator.tsx`, `MarketScreen.tsx`, `QuickRecordModal.tsx`, `TopBar.tsx`, and `BottomNavigation.tsx`.
- **Fix D — Correct Voice Extraction & Prevent Invented Values**:
  - Re-architected `src/services/voiceExtractor.ts` to strictly rule-based parsing with honest architectural attribution ("Rule-based extraction (Generative AI not connected in Phase 0.5)").
  - Eliminated hardcoded fallback defaults (`qty || 40`, `fertilizerName: 'Urea'`, `area || 2.0`). Missing entities remain `null` with explicit `needsClarification` prompts.
  - Implemented `getLocalDateString()` for timezone-safe calendar date assignment, eliminating UTC ISO split day drift.
- **Fix E — Safe Reset and Preference Persistence**:
  - Added two-step confirmation dialog before any destructive reset action in `src/App.tsx`.
  - Clearly explains what is removed (new farmer records) and what is retained (baseline demo records and plots).
  - Cancel action safely preserves state without side effects.
- **Fix F — Honest Offline, Sync, and Market Status**:
  - Refactored `OfflineStatusIndicator.tsx` to state "Local browser memory active" and "Simulated Sync Queue"; removed deceptive "Cloud synced" and "All records backed up" claims.
  - Reinforced visible safety banners in `MarketScreen.tsx` marking mandi prices as simulated benchmarks for Phase 0.5 testing.
- **Fix G — Project Documentation**:
  - Created `README.md`, `docs/PRODUCT_MASTER_SPEC.md`, `docs/REQUIREMENTS_TRACKER.md`, `docs/TEST_REGISTER.md`, and `docs/CHANGELOG.md`.
- **Fix H — Automated Checks & Validation**:
  - Ran `npm run lint` (`tsc --noEmit`) — passed with 0 errors.
  - Ran `npm run build` (`vite build`) — passed with clean production output.

### Files Affected
- `src/types/farm.ts`
- `src/services/activityStorage.ts`
- `src/services/voiceExtractor.ts`
- `src/i18n/translations.ts`
- `src/components/common/QuickRecordModal.tsx`
- `src/components/common/TrustIndicator.tsx`
- `src/components/common/OfflineStatusIndicator.tsx`
- `src/components/common/EmptyState.tsx`
- `src/components/common/ErrorState.tsx`
- `src/components/layout/TopBar.tsx`
- `src/components/layout/BottomNavigation.tsx`
- `src/components/screens/RecordScreen.tsx`
- `src/components/screens/MarketScreen.tsx`
- `src/components/screens/HomeScreen.tsx`
- `src/components/screens/MyFarmScreen.tsx`
- `src/components/screens/InsightsScreen.tsx`
- `src/components/timeline/FarmTimeline.tsx`
- `src/App.tsx`
- `README.md`
- `docs/PRODUCT_MASTER_SPEC.md`
- `docs/REQUIREMENTS_TRACKER.md`
- `docs/TEST_REGISTER.md`
- `docs/CHANGELOG.md`

### Known Limitations & Deferred Work
- Real-time cloud sync and remote user accounts are deferred to Phase 1.0+.
- Generative AI advisory agent and LLM-grounded question answering are deferred to Phase 1.5+.
- Real APMC / e-NAM mandi API integration is deferred to Phase 2.0+.
