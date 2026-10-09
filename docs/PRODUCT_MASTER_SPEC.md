# AI Farm Hub — Product Master Specification

- **Document Version**: 1.1.0
- **Phase Target**: Phase 0.5 — Profile, Personalization & Activity Foundation
- **Date**: October 2026
- **Status**: Approved Prototype Specification

---

## 1. Product Vision & Positioning

### Positioning Statement
> "AI Farm Hub — Farming guidance you can understand, records you can trust, and support you can approach."

### Core Philosophy
1. **You farm. We remember.** The application captures records effortlessly (voice, 1-tap, or form) without burdening the farmer with endless required fields.
2. **We understand.** The application organizes field history by plot, crop cycle, and calendar timeline with complete provenance.
3. **We help you think. You decide.** The application provides structured observations, but decisions remain firmly in the farmer's hands.

---

## 2. Target Users & Problems Addressed

### Target Audience
Farmers in Andhra Pradesh (starting with Anakapalli district demo baseline), cultivating Paddy (wetland/irrigated) and Groundnut (dryland/rainfed).

### Core Problems Addressed
1. **Uncertainty on appropriate action**: Knowing what activity happened when, and what stage the crop is in.
2. **Input and cost tracking friction**: Paper notebooks get lost, complex software requires too much typing.
3. **Language barriers**: English-only interfaces alienate rural farmers; complex technical terminology confuses rather than assists.
4. **Trust deficit in digital agriculture**: Black-box advice, fake "AI" claims, and unverified data erode trust. Farmers need to know *who* recorded an item and *why* it was classified.

---

## 3. Architecture & Separation of Concerns

The architecture strictly distinguishes:
- **Profile ("Who am I?")**: Farmer name, preferred greeting (*Ravi garu*), experience (5 years), location (Rasapūdipalem), digital comfort.
- **Preferences ("How should the app behave?")**: App language (Telugu/English/Hindi), voice language, text size (Large), contrast (Sunlight mode), read-aloud, quiet hours.
- **Farm ("What land do I manage?")**: Ravi Kumar Farm, 5 Acres, Plot A (2 Ac Paddy), Plot B (3 Ac Groundnut).
- **Crop Cycle ("What am I growing?")**: Active cycles linked to plots.
- **Activities & Events ("What happened?")**: Farm events with durable persistence and provenance.

---

## 4. Provenance & Trust Model

Every record must distinguish:
1. **Source**:
   - `farmer_reported`: Directly entered by farmer via form, touch, or note.
   - `ai_extracted`: Parsed by speech recognition or rule-based extractor.
   - `farmer_confirmed`: Explicitly reviewed and confirmed by farmer.
   - `verified_document`: Supported by verified physical receipt or soil test certificate.
   - `demo_data`: Illustrative sample data.
2. **Status**:
   - `pending_confirmation`: Draft or newly entered record awaiting farmer confirmation.
   - `farmer_confirmed`: Explicitly confirmed by farmer.
   - `conflicting`: Contradicts existing records.
   - `demo`: Baseline demo activity.
3. **Verification**:
   - `confirmed`: Verified through physical document/process.
   - `pending`: Unverified.
   - `estimated`: Derived calculation.
   - `unknown`: Not recorded. Never guess.

**Mandatory Rule**: Manual form submission is `farmer_reported` and `pending_confirmation`. It is NEVER auto-confirmed or marked verified without an explicit confirmation action.

---

## 5. Phase-Wise Roadmap

| Phase | Title | Scope Summary | Current Status |
| :--- | :--- | :--- | :--- |
| **Phase 0.5** | Profile, Personalization & Activity Foundation | Complete profile, Telugu/Hindi/English i18n, durable activity storage, strict provenance, rule-based voice parsing, honest status indicators. | **ACTIVE (Iteration 1 Completed)** |
| **Phase 1.0** | Full Crop Lifecycle Records | Multi-plot timeline, input expense ledger, crop cycle transitions, offline service worker (PWA). | Planned |
| **Phase 1.5** | Generative AI Advisory Engine | Gemini API grounding on farmer's verified plot records, voice chat assistant. | Planned |
| **Phase 2.0** | Market & Weather Grounding | Live e-NAM mandi prices, localized IMD weather forecasts. | Future |
| **Phase 3.0** | Diagnostic & Agronomy Intelligence | Image disease scouting, soil test laboratory integration. | Future |

---

## 6. Out of Scope for Current Iteration

The following are strictly out of scope for Phase 0.5 / Iteration 1:
- Live external API integrations (weather, mandi prices, satellite).
- Cloud backend database or user account authentication.
- Autonomous AI recommendations or automated diagnosis.
- Image recognition or machine learning computer vision.
