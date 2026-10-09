# AI Farm Hub — Test Register

- **Document Version**: 1.2.0
- **Execution Date**: October 2026
- **Test Harness**: TypeScript Verification (`npm run lint`), Production Build Compilation (`npm run build`), Node/TSX Automated Test Suite (`npm test`)

---

## 1. Automated Test Execution Summary

Command: `npm test` (`tsx --test src/tests/regression.test.ts`)
Total Tests: **15 passed, 0 failed, 0 skipped**
Execution Duration: **628 ms**

| Test ID | Suite | Scenario | Test Inputs / Procedure | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TEST-BUILD-01** | Repository Integrity | TypeScript Typecheck | `npm run lint` (`tsc --noEmit`) | 0 TypeScript diagnostic errors | Exited with code 0, 0 errors | **Tested—Passed** |
| **TEST-BUILD-02** | Repository Integrity | Production Vite Build | `npm run build` (`vite build`) | Successful output in `dist/` | Build succeeded, zero asset errors | **Tested—Passed** |
| **TEST-REG-01** | Defect 1: Provenance | Source Preservation on Confirm | Call `confirmRecord` on event with `source: 'ai_extracted'` | `status` becomes `farmer_confirmed`; `source` remains `ai_extracted`; `verificationStatus` remains `pending` | `source` retained as `ai_extracted`, verification unchanged | **Tested—Passed** |
| **TEST-REG-02** | Defect 1: Provenance | Correction History Tracking | Call `updateRecord` sequentially on quantity and title | Each change appends item to `correctionHistory` with old/new values | `correctionHistory` length is 2; fields accurately tracked | **Tested—Passed** |
| **TEST-REG-03** | Defect 1: Provenance | Baseline Demo Immutability | Attempt `deleteRecord` on demo ID `DEMO-EVT-01` | Returns `success: false, code: 'NOT_FOUND'` | Rejection with `NOT_FOUND` error; demo data untouched | **Tested—Passed** |
| **TEST-REG-04** | Defect 2 & 3: Reset | Successful Records Reset | Call `resetAllFarmerRecords` with existing user records | Clears user records from storage key; returns `success: true` | `data.length === 0`, `success: true` | **Tested—Passed** |
| **TEST-REG-05** | Defect 2 & 3: Reset | Storage Write Failure on Reset | Force storage error on `resetAllFarmerRecords` | Returns `success: false` with explicit error string | `success: false`, error string returned; no false success | **Tested—Passed** |
| **TEST-REG-06** | Defect 4: Localization | Dictionary Section Parity | Inspect `TRANSLATIONS` for Telugu, English, Hindi | All 11 major dictionary sections exist in each language | All sections present in TE, EN, HI | **Tested—Passed** |
| **TEST-REG-07** | Defect 4: Localization | Profile Label Coverage | Inspect `preferencesModal` across all 3 languages | All 10 profile labels, notices, and options present | Full key parity across all 3 languages | **Tested—Passed** |
| **TEST-REG-08** | Defect 4: Localization | Sample Insight Strings | Inspect `insights` across all 3 languages | `sampleInsightTitle`, `sampleInsightDetail`, `sampleInsightRecommendation` exist | Valid translations in TE, EN, HI | **Tested—Passed** |
| **TEST-REG-09** | Defect 5: Voice/Date | Local Timezone Date String | Call `getLocalDateString(new Date())` | Output matches local calendar format `YYYY-MM-DD` | Returns local calendar format; no UTC drift | **Tested—Passed** |
| **TEST-REG-10** | Defect 5: Voice/Date | Anti-Invention: Generic Fertilizer | Transcript: "రెండు ఎకరాలలో ఎరువు వేశాను" | `fertilizerName: null`, question in `needsClarification` | Zero invented chemical names; null preserved | **Tested—Passed** |
| **TEST-REG-11** | Defect 5: Voice/Date | Explicit Chemical Recognition | Transcript: "ప్లాట్ A లో 50 కిలోల యూరియా వేశాను" | `fertilizerName: 'Urea'`, `quantity: 50`, `plotId: 'plot-a'` | Urea, 50kg, and Plot A recognized accurately | **Tested—Passed** |
| **TEST-REG-12** | Defect 5: Voice/Date | Date Not Spoken Review Flag | Transcript: "వరి పొలంలో నీళ్లు పెట్టాను" | `isDateAssigned: true`, question in `needsClarification` | `isDateAssigned: true` flagged for farmer review | **Tested—Passed** |
| **TEST-REG-13** | Defect 5: Voice/Date | Spoken "Yesterday" Recognition | Transcript: "నిన్న వరి పొలంలో నీళ్లు పెట్టాను" | `isDateAssigned: false`, date set to yesterday's local date | Yesterday parsed; `isDateAssigned: false` | **Tested—Passed** |
| **TEST-REG-14** | Defect 5: Voice/Date | Spoken Correction Phrases | Transcript: "40 కాదు, 20 కిలోలు యూరియా" | `isCorrection: true`, `quantity: 20` | Adopts corrected quantity (20) | **Tested—Passed** |
| **TEST-REG-15** | Defect 5: Voice/Date | Rule-Based Attribution | Inspect `extractionEngine` on extracted draft | Property is `'rule_based'` (never claims generative AI) | `extractionEngine === 'rule_based'` | **Tested—Passed** |

---

## 2. Screen-by-Screen UI Localization Checklist

Verified across Telugu (తెలుగు), English, and Hindi (हिन्दी):

### 1. Navigation & Header (`TopBar.tsx`, `BottomNavigation.tsx`)
- [x] App Name and Phase Badge (`t.appName`, `t.phaseBadge`)
- [x] Tab Labels: Home, My Farm, Record, Insights, Market (`t.nav.*`)
- [x] Quick Action Button: Record (`t.actions.record`)
- [x] Sync & Storage State Indicator: Online, Offline, Pending, Simulation disclosure (`t.sync.*`)
- [x] HTML Document Lang synchronization (`<html lang="te|en|hi">`)

### 2. Home Screen (`HomeScreen.tsx`)
- [x] Greeting & Sub-greeting (`t.home.greeting`, `t.home.subGreeting`)
- [x] Holding Area & Plot breakdown (`{farm.totalAreaAcres} ఎకరాలు / एकड़ / Acres`)
- [x] Objectives Tags: Localized via `getObjectiveLabel` (`t.preferencesModal.obj*`)
- [x] Weather Snapshot Card: Condition, Humidity, Wind, Mock disclosure (`t.home.weather*`)
- [x] Plot Status Card: Plot names, areas, crop stages (`t.home.fieldStatusTitle`, `t.home.crop*`)
- [x] Pending Action Card: Land prep reminder (`t.home.pendingTasksTitle`, `t.home.landPrepPending`)
- [x] Hero Sample Insight Card: Title, detail, recommendation prompt, demo badge (`t.insights.*`)
- [x] Recent Timeline Snapshot: Title, subtitle, view all records button (`t.home.recentTimeline*`)

### 3. My Farm Screen (`MyFarmScreen.tsx`)
- [x] Farm Overview Header: Total acres, manager greeting, soil test status, irrigation source (`t.myFarm.*`)
- [x] Plot Selector Bar: Plot cards, area with localized units, crop stage, trust indicators (`t.myFarm.*`)
- [x] Plot Specification Grid: Soil type, water source, sowing variety, yield targets (`t.myFarm.*`)
- [x] Plot Activity Timeline: Header, count, embedded timeline component (`t.myFarm.recordedEventsFor`)

### 4. Record Activity Screen (`RecordScreen.tsx`)
- [x] Mode Switcher: Voice, Form, Quick 1-tap (`t.record.*`)
- [x] Voice Recording Panel: Microphone permission alerts, listening prompts, language notes (`t.record.voice.*`)
- [x] Extracted Draft Review: Entity fields, clarification questions, explicit confirmation buttons (`t.record.*`)
- [x] Manual Detailed Form: Title, plot select, date, quantity, units, notes, submit (`t.record.form.*`)
- [x] 1-Tap Quick Action Grid: Irrigation, spray, fertilizer, weeding quick actions (`t.record.quick.*`)
- [x] Localized Save Feedback: Multilingual success and failure messages in TE, EN, HI

### 5. Farm Insights Screen (`InsightsScreen.tsx`)
- [x] Screen Header: Subtitle, title, tagline, demo badge, grounded notice (`t.insights.*`)
- [x] Policy & Style Indicators: Localized recommendation mode & AI style (`t.preferencesModal.*`)
- [x] Observation Narrative: Observation number, localized sample title, context title, detail (`t.insights.*`)
- [x] Primary Objectives Alignment: Objective labels localized via `getObjectiveLabel`
- [x] Farmer Decision Panel: "You Decide" prompt, acknowledge button, record button, decision note (`t.insights.*`)

### 6. Mandi Market Screen (`MarketScreen.tsx`)
- [x] Mandatory Commercial Safety Banner: Title, badge, warning explanation (`t.market.commercialBanner*`)
- [x] Header: Readiness label, title, subtitle (`t.market.*`)
- [x] Registered Crops: Stage, estimated harvest unrecorded note, localized acreage units (`t.market.*`)
- [x] Mandi Price Benchmarks: Minimum, modal, maximum price labels, per quintal, localized trend (`Rising` / `పెరుగుతోంది` / `बढ़ रहा है`) (`t.market.*`)

### 7. Profile & Personalization Modal (`ProfileModal.tsx`)
- [x] Tab Switcher: Application Preferences vs Farmer Profile (`t.preferencesModal.preferencesTab`, `profileTab`)
- [x] Preferences Tab: App language, voice language, independent setting notice, interaction mode, AI response style, display section (theme, text size, contrast), read aloud, quiet hours, alerts and reminders (`t.preferencesModal.*`)
- [x] Profile Tab: Demo farmer notice, full name, preferred name greeting, role, experience, digital comfort levels, location (village, district, state, country), primary objectives (`t.preferencesModal.*`)
- [x] Modal Actions: Cancel, Save & Apply, dismiss error (`t.preferencesModal.*`, `t.actions.cancel`)

### 8. Farm Timeline & Details Modal (`FarmTimeline.tsx`)
- [x] Timeline Nodes: Date, plot, demo record badge (`t.timeline.demoBadge`), edit count (`t.timeline.editsCount`)
- [x] Action Buttons: View Details, Edit, Delete, Confirm Record (`t.timeline.*`)
- [x] Event Details Modal: Specifications grid (quantity, area, source, confirmation status, verification status) (`t.timeline.*`)
- [x] Captured Voice Transcript: Displayed in modal when present with localized header
- [x] Application-Assigned Date Notice: Displayed in modal when date was auto-assigned today for review
- [x] Edit Record Modal: Title, audit notice, form labels, cancel, save (`t.timeline.*`)
- [x] Delete Confirmation Dialog: Warning, local deletion notice, confirm, cancel (`t.timeline.*`)

### 9. Common Modals & Fallbacks
- [x] Safe Reset Modal (`App.tsx`): Warning, what is deleted, what is retained, success, error (`t.resetModal.*`)
- [x] Quick Record Modal (`QuickRecordModal.tsx`): Plot, event type, date, title, quantity, unit, cost, saving (`t.quickRecordModal.*`)
- [x] Offline Status Popup (`OfflineStatusIndicator.tsx`): Simulation badge, local memory note, states (`t.sync.*`)
- [x] Empty State (`EmptyState.tsx`): Heading, description, action button (`t.emptyState.*`)
- [x] Error State (`ErrorState.tsx`): Heading, description, retry button (`t.errorState.*`)

---

## 3. Environment & Execution Limitations

1. **Git Version Control in Sandbox**:
   - The AI Studio sandbox container environment is not initialized as a git repository (`fatal: not a git repository: .git`).
   - All changes are applied directly to the filesystem workspace.
2. **Headless Browser Constraints**:
   - Headless CLI environment lacks physical audio hardware / microphone devices for interactive audio capture.
   - Speech synthesis and speech recognition runtime behaviors are verified via deterministic service unit tests and mock event structures.
