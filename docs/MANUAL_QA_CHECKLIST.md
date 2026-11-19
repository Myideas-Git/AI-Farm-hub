# AI Farm Hub — Phase 2 Manual QA Checklist & Execution Matrix

- **Document Version**: 2.2.0 (Final Phase 2 Acceptance Preparation)
- **Last Updated**: 2026-11-19
- **Phase 2 Overall Gate**: **NOT ACCEPTED** — Implementation and automated Node verification (`59/59` tests, lint, build) are complete, but external human validation across **Track A** (live Desktop Chrome, Android Chrome `360–412px`, iPhone Safari `375–430px`), **Track B** (native Telugu & Hindi linguistic review), and **Track C** (ANGRAU / RARS Anakapalli / KVK Kondempudi agronomic review) remains `PENDING` / `BLOCKED`.
- **Allowed Status Vocabulary**: `PASS` | `FAIL` | `BLOCKED` | `PENDING` | `NOT APPLICABLE`
- **Companion External Validation Registers**:
  - **Track A (Browser & Device Evidence)**: `docs/BROWSER_DEVICE_EVIDENCE_REGISTER.md` (3-environment Coverage Matrix & full per-test execution records)
  - **Track B (Translation Review)**: `docs/TRANSLATION_REVIEW_SHEET.md` (576 keys × 10 dedicated review columns)
  - **Track C (Agronomic Validation)**: `docs/AGRONOMIC_VALIDATION_REGISTER.md` (Expert Review Package & 8-column Expert Decision Table)
  - **Consolidated Automated Register**: `docs/TEST_REGISTER.md`

---

## 1. Track A — Browser & Device Execution Summary (22 Mandatory Tests)

| Category | Test IDs | Assigned Environments (Per Track A Coverage Matrix) | Automated Node Logic Coverage | Live Browser / Device Status |
| :--- | :--- | :--- | :---: | :---: |
| **Persistence & Reload** | `MQA-PER-01` – `MQA-PER-07` | Desktop Chrome (`01..07`); Android Chrome `360–412px` & iPhone Safari `375–430px` (`01`, `03`, `05`) | `PASS` (Service layer via `MockLocalStorage`) | `BLOCKED` *(sandbox)* / `PENDING` *(human QA)* |
| **UI Rendering & Boundaries** | `MQA-UI-01` – `MQA-UI-08` | Desktop Chrome (`01..08`); Android Chrome & iPhone Safari (`01`, `05`) | `PASS` (Summary/filter/yield logic only) | `BLOCKED` *(sandbox)* / `PENDING` *(human QA)* |
| **Multilingual UI & Indic Layout** | `MQA-I18N-01` – `MQA-I18N-03` | Desktop Chrome (`01..03`); Android Chrome & iPhone Safari (`03`) | `PASS` (576/576 structural key parity only) | `BLOCKED` *(sandbox)* / `PENDING` *(human QA)* |
| **Mobile Usability & Hardware APIs** | `MQA-MOB-01` – `MQA-MOB-04` | Android Chrome `360–412px` & iPhone Safari `375–430px` (`01..04`) | `PASS` (Rule-based voice text parser only; no device/mic/camera) | `BLOCKED` *(sandbox)* / `PENDING` *(human QA)* |

---

## 2. Persistence Invariant Coverage Map (Service Automated vs. Live Browser)

| Persistence Invariant | Automated Node Test (`npm test`) | Automated Status | Live Browser Test ID(s) | Live Browser Status |
| :--- | :--- | :---: | :--- | :---: |
| Record creation survives reload | `TEST-P0-PROV-06`, `TEST-P2-FINAL-02` | `PASS` | `MQA-PER-01` (Desktop, Android, iOS) | `BLOCKED` |
| Record updates & correction history survive reload | `TEST-REG-02`, `TEST-P2-FINAL-02` | `PASS` | `MQA-PER-02` (Desktop) | `BLOCKED` |
| Farmer confirmation survives reload | `TEST-P0-PROV-06`, `TEST-P2-FINAL-02` | `PASS` | `MQA-PER-03` (Desktop, Android, iOS) | `BLOCKED` |
| Original activity source & evidence metadata preserved | `TEST-P0-PROV-02`, `TEST-P2-FINAL-02`, `TEST-P2-FINAL-05` | `PASS` | `MQA-PER-02`, `MQA-PER-03` | `BLOCKED` |
| Demo records remain distinguishable & protected after reload | `TEST-P0-DEMO-05`, `TEST-P2-FINAL-05` | `PASS` | `MQA-PER-04`, `MQA-UI-01`, `MQA-UI-02` | `BLOCKED` |
| Duplicate records are not created after reload | `TEST-P2-FINAL-04`, `TEST-P2-FINAL-05` | `PASS` | `MQA-PER-01`, `MQA-PER-02` | `BLOCKED` |
| Unknown and `null` values remain intact after reload | `TEST-P0-PROV-04`, `TEST-P2-FINAL-05` | `PASS` | `MQA-PER-01`, `MQA-PER-02` | `BLOCKED` |

---

## 3. Master Manual QA Checklist Matrix (`MQA-PER`, `MQA-UI`, `MQA-I18N`, `MQA-MOB`)

*(Detailed per-environment device/browser/viewport/screenshot/DevTools capture forms for every Track A test are maintained in `docs/BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.)*

| Test ID | Check | Required Environments | Expected Result | Actual Result | Status | Evidence Register Link | Tester |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **MQA-PER-01** | Create + Hard Reload + Null Preservation | Desktop Chrome, Android Chrome (`360–412px`), iPhone Safari (`375–430px`) | Created real records survive reload with zero duplicates; unknown/blank fields remain `null`; Real Spend accurate; demo records separated. | Not executed on real browsers/devices. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.1 | `PENDING` |
| **MQA-PER-02** | Edit + Correction History Reload | Desktop Chrome | Updated fields & `Correction History` survive reload; original capture source & evidence metadata preserved. | Not executed on real desktop Chrome. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.1 | `PENDING` |
| **MQA-PER-03** | Farmer Confirmation Reload | Desktop Chrome, Android Chrome (`360–412px`), iPhone Safari (`375–430px`) | Stays `Farmer Confirmed` with `Confirmed by` & timestamp; original source preserved; Independent Verification remains `Not Independently Verified`. | Not executed on real browsers/devices. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.1 | `PENDING` |
| **MQA-PER-04** | Delete + Demo Protection Reload | Desktop Chrome | Deleted farmer record remains gone after reload; all 12 demo records remain intact with no Edit/Delete/Confirm buttons. | Not executed on real desktop Chrome. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.1 | `PENDING` |
| **MQA-PER-05** | Profile & Preferences Reload | Desktop Chrome, Android Chrome (`360–412px`), iPhone Safari (`375–430px`) | Preferred name, language, dark theme, text size, and sunlight contrast persist across reload cleanly. | Not executed on real browsers/devices. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.1 | `PENDING` |
| **MQA-PER-06** | Confirmed Reset Flows | Desktop Chrome | Cancel changes nothing; confirmed resets clear targeted keys across reload while retaining baseline demo records. | Not executed on real desktop Chrome. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.1 | `PENDING` |
| **MQA-PER-07** | Corrupt `localStorage` Recovery | Desktop Chrome | App loads without crash, shows localized amber quarantine banner, saves `farm_intel_corrupt_backup_*`, refuses silent overwrite. | Not executed on real desktop Chrome. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.1 | `PENDING` |
| **MQA-UI-01** | Demo-vs-Real Summary Separation | Desktop Chrome, Android Chrome (`360–412px`), iPhone Safari (`375–430px`) | Explicit blue synthetic demo banner shown; expenditure & confirmed counts clearly labelled as synthetic demo totals. | Not executed on real browsers/devices. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.2 | `PENDING` |
| **MQA-UI-02** | Mixed Real + Demo Summary | Desktop Chrome | Displays **Real Farmer Spend: ₹540** separately from `Demo ref: ₹...` and states demo records are excluded. | Not executed on real desktop Chrome. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.2 | `PENDING` |
| **MQA-UI-03** | Estimate-Not-Fact Rendering | Desktop Chrome | `MEM-PAD-06` shows dashed amber border, amber disclaimer, no Confirm button, excluded from actual spend. | Not executed on real desktop Chrome. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.2 | `PENDING` |
| **MQA-UI-04** | No Invented Confidence | Desktop Chrome | Confidence shows localized `"Not applicable (No measured confidence score)"`; zero hardcoded `95%`/`92%`/`98%`/`88%`. | Not executed on real desktop Chrome. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.2 | `PENDING` |
| **MQA-UI-05** | Crop Lifecycle & Yield Display | Desktop Chrome, Android Chrome (`360–412px`), iPhone Safari (`375–430px`) | Plot A active `Land Preparation` + `Yield not recorded`; prior demo cycle separated (`Unvalidated Demo Agronomy`) with `18.5 Quintals (1,850 kg)`; Plot B `3 acres` (`2+3=5 ac`). | Not executed on real browsers/devices. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.2 | `PENDING` |
| **MQA-UI-06** | Evidence Badge Tooltips | Desktop Chrome | Every badge tooltip clarifies receipts, GPS, weather, photos, and farmer confirmation are not independent third-party verification. | Not executed on real desktop Chrome. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.2 | `PENDING` |
| **MQA-UI-07** | Filter, Search & Plot Agreement | Desktop Chrome | Header plot, visible cards, category tab counts (`All === Farmer + Demo`), and summaries agree across all filters & reset. | Not executed on real desktop Chrome. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.2 | `PENDING` |
| **MQA-UI-08** | Empty & Error States (EN/TE/HI) | Desktop Chrome | Localized Empty & Storage Error states render cleanly in EN, TE, HI with zero console errors. | Not executed on real desktop Chrome. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.2 | `PENDING` |
| **MQA-I18N-01** | Full-App Switching (TE → EN → HI) | Desktop Chrome | All 5 tabs and all modals switch cleanly with zero untranslated English leftovers. | Not executed on real desktop Chrome. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.3 | `PENDING` |
| **MQA-I18N-02** | Document `<html lang>` Sync | Desktop Chrome | `<html lang>` updates to `te`, `en`, and `hi`. | Not executed on real desktop Chrome. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.3 | `PENDING` |
| **MQA-I18N-03** | Indic Script Layout & Wrapping | Desktop Chrome, Android Chrome (`360–412px`), iPhone Safari (`375–430px`) | Zero clipped glyphs/matras, no overlapping text, no horizontal overflow; verify `BottomNavigation` `max-w-[55px]` watch item. | Not executed on real browsers/devices. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.3 | `PENDING` |
| **MQA-I18N-04** | Native Linguistic Sign-Off (TE & HI) | Human Native Reviewers (Track B) | Competent native Telugu (Andhra Pradesh) and Hindi reviewers approve all 576 farmer-facing strings. | 576-key 10-column workbook prepared; awaiting human native-speaker review. | `PENDING` | `TRANSLATION_REVIEW_SHEET.md` | `PENDING` |
| **MQA-MOB-01** | Mobile Viewport & Touch Targets | Android Chrome (`360–412px`), iPhone Safari (`375–430px`) | Bottom nav accessible, `>= 44px` tap targets (explicitly measure `TopBar` `min-h-[36px]` profile button), smooth modal scroll. | Not executed on real mobile devices. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.4 | `PENDING` |
| **MQA-MOB-02** | High-Contrast Sunlight Mode | Android Chrome (`360–412px`), iPhone Safari (`375–430px`) | Sunlight banner visible; strong outdoor legibility in Light & Dark themes. | Not executed on real mobile devices. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.4 | `PENDING` |
| **MQA-MOB-03** | Live Web Speech API Voice Capture | Android Chrome (`360–412px`), iPhone Safari (`375–430px`) | Generic fertilizer never invents Urea; unspoken date flagged; ASR confidence only when provided; permission denial or unsupported browser handled gracefully. | Not executed on real mobile devices. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.4 | `PENDING` |
| **MQA-MOB-04** | Camera / Receipt Flow & Offline | Android Chrome (`360–412px`), iPhone Safari (`375–430px`) | Safety disclaimer visible; captured draft requires farmer confirmation; offline mode degrades gracefully. | Not executed on real mobile devices. | `BLOCKED` | `BROWSER_DEVICE_EVIDENCE_REGISTER.md` §5.4 | `PENDING` |

---

## 4. Formal External Sign-Off Gate (Required Before Phase 2 Acceptance)

| Validation Track | Required External Sign-Off | Current Status | Approver Name / Organization / Date |
| :--- | :--- | :---: | :--- |
| **Track A** | Live Browser & Mobile Device QA (`38` required test-environment runs across Desktop Chrome, Android Chrome `360–412px`, iPhone Safari `375–430px`) | `BLOCKED` / `PENDING` | `PENDING — External QA Tester` |
| **Track B** | Native Telugu (Andhra Pradesh) & Native Hindi Linguistic Sign-Off (`576` keys in `docs/TRANSLATION_REVIEW_SHEET.md`) | `PENDING` | `PENDING — Native TE & HI Reviewers` |
| **Track C** | Agronomic Validation Sign-Off (`ANGRAU` / `RARS Anakapalli` / `KVK Kondempudi` Decision Table in `docs/AGRONOMIC_VALIDATION_REGISTER.md`) | `PENDING` | `PENDING — Qualified AP Agronomist` |
