# AI Farm Hub — Farm Intelligence Platform

An approachable and trustworthy agricultural platform for farmers in Andhra Pradesh, India, designed to capture, remember, and organize farm activities across the complete crop lifecycle.

> **Core Product Promise:** “You farm. We remember. We understand. We help you think. You decide.”

---

## 1. Product Purpose & Target Users

- **Target Audience**: Smallholder and commercial farmers in Andhra Pradesh (starting with Anakapalli district demo baseline), designed for outdoor mobile use under bright sunlight.
- **Core Vision**: Enable farmers to capture farm activities effortlessly via voice, touch, or camera; preserve durable, tamper-proof records; track farm inputs and costs without unnecessary data entry; and view honest benchmarks without misleading claims.
- **Demo Farmer Profile**:
  - **Farmer**: Ravi Kumar (preferred address greeting: *Ravi garu*)
  - **Location**: Rasapūdipalem, Anakapalli district, Andhra Pradesh
  - **Land**: 5 Acres total (Plot A: 2 Acres Paddy; Plot B: 3 Acres Groundnut)
  - **Experience**: 5 years · Digital comfort: Intermediate
  - **Objectives**: Profitability, reduce input costs, improve yield, save water, maintain accurate farm records.

---

## 2. Current Prototype Capabilities (Phase 0.5 — Iteration 1)

1. **Farmer Profile & Personalization Foundation**:
   - Custom address greeting (*Ravi garu*), language selection (Telugu, English, Hindi), voice language, interaction modes (*Quick*, *Assisted*, *Detailed*), and response style (*Simple*, *Balanced*, *Detailed*).
   - High-contrast sunlight glare mode, text size scaling (*Standard*, *Large*, *Extra large*), read responses aloud (SpeechSynthesis), reduced motion, and quiet hours (21:00 to 06:00).
2. **Durable Local Activity Storage**:
   - Resilient browser storage with corrupted record isolation, storage quota detection, duplicate double-click prevention (< 30s identical submissions), and clear rollback upon failure.
   - Separate persistence of farmer-entered records from baseline immutable demo data.
3. **Strict Provenance & Trust Tracking**:
   - Clear distinction between *Farmer-reported*, *Voice-extracted*, *Farmer-confirmed*, *Estimated*, *Verified*, and *Demo* records.
   - Manual entry is never auto-confirmed or marked verified without explicit user confirmation.
   - Comprehensive correction history tracking previous and updated values when records are edited.
4. **Multilingual Interface (Telugu, English, Hindi)**:
   - Complete localized interface covering navigation, forms, error dialogs, empty states, trust badges, mandi prices, and settings.
   - Automatic HTML `lang` attribute synchronization.
5. **Honest Rule-Based Voice Extractor**:
   - Uses browser Web Speech API with BCP-47 language tags (`te-IN`, `en-IN`, `hi-IN`).
   - Deterministic rule-based entity parsing. Zero invented quantities, chemical names, or acreages.
   - Timezone-safe local calendar date handling.
6. **Safe Reset & Honest Sync/Market Status**:
   - Two-step confirmation modal before any data reset with explicit explanation of what is removed and what remains.
   - Clear disclosure that sync is a local browser simulation and mandi prices are illustrative benchmarks for Phase 0.5 testing.

---

## 3. Technology Stack

- **Framework**: React 19 SPA with TypeScript
- **Bundler & Tooling**: Vite 8, Tailwind CSS v4, Lucide React icons
- **Audio & Speech**: Browser Web Speech API (`SpeechRecognition`) & `SpeechSynthesis`
- **Storage**: Browser `localStorage` with fail-safe isolation and migration helpers

---

## 4. Setup and Run Instructions

### Prerequisites
- Node.js (v20+ recommended)
- npm or bun

### Commands
```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Run TypeScript typecheck / lint
npm run lint

# Run automated regression test suite
npm test

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 5. Known Limitations (Phase 0.5)

1. **No External Generative AI Connected**: The voice extraction engine uses browser speech recognition and deterministic rule-based parsing. No cloud LLM or Generative AI backend is active in this iteration.
2. **Local Storage Only (No Cloud Sync)**: All user activities, profile changes, and preferences are saved exclusively in browser `localStorage`. No cloud database or multi-device sync is connected.
3. **Simulated Market Benchmarks**: Mandi prices and commodity trends are illustrative Phase 0.5 test data for Anakapalli crops. They do not represent live spot market prices or e-NAM feeds.
4. **Browser Speech API Compatibility**: Voice recognition requires browsers supporting Web Speech API (e.g. Chrome, Edge, Safari). Mobile browsers with microphone restrictions gracefully fall back to structured manual form entry.
5. **Sandbox Container Environment**: The development container runs without an initialized `.git` repository; code changes are applied directly to the project directory.

---

## 6. Current Release / Iteration Status

- **Product Phase**: Phase 0.5 — Profile & Personalization Foundation
- **Iteration**: Iteration 1.2 — Final Phase 0.5 Defect Closure
- **Gate Status**: READY FOR REVIEW / READY FOR ACCEPTANCE
