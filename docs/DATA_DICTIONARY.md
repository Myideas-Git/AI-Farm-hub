# AI Farm Hub — Data Dictionary

- **Document Version**: 2.0.0 (Phase 2 Remediation)
- **Source of Truth**: `src/types/farm.ts`, `src/types/profile.ts`, `src/services/activityStorage.ts`, `src/utils/farmSummary.ts`
- **Core Data Integrity Rules**:
  - Unknown or unrecorded values MUST remain `null` or `undefined` — never coerced to `0`, guessed strings, or invented defaults.
  - Synthetic demo records (`isDemo: true`) are strictly separated from real farmer records (`isDemo: false`) and never contribute to real expenditure, confirmed counts, evidence tallies, input lists, or harvest yield totals.
  - Activity origin (`activitySource`), supporting evidence (`evidenceType`), farmer confirmation (`confirmationStatus` / `status`), and independent verification (`verificationStatus`) are orthogonal fields and must never be conflated.

---

## 1. Enumerated / Union Types (`src/types/farm.ts`)

| Type Name | Allowed Values | Meaning & Usage Constraints |
| :--- | :--- | :--- |
| `ActivitySource` | `'manual_entry' \| 'voice_input' \| 'camera_assisted' \| 'sensor_integration' \| 'model_estimate' \| 'unknown'` | How the activity record was originally reported or captured. Preserved immutably across farmer confirmations and edits. |
| `EvidenceType` | `'farmer_statement' \| 'photograph' \| 'receipt' \| 'gps_observation' \| 'weather_data' \| 'soil_test' \| 'none'` | Supporting evidence actually attached to the record. GPS, weather, receipt (for field application), photo, and farmer statement cannot independently verify a field activity. |
| `ConfirmationStatus` | `'pending' \| 'confirmed' \| 'rejected' \| 'not_applicable'` | Whether the farmer has reviewed and explicitly confirmed the record. Estimated records always use `'not_applicable'`. |
| `TrustStatus` | `'confirmed' \| 'unverified' \| 'estimated' \| 'demo' \| 'unknown' \| 'pending' \| 'conflicting'` | Independent verification status (`verificationStatus`) or data trust level. `'confirmed'` is permitted **only** when supported by an explicit documented `verificationMechanism` that satisfies `evaluateEvidenceVerificationSupport`. |
| `RecordStatus` | `'draft' \| 'pending_confirmation' \| 'pending_ai_processing' \| 'farmer_confirmed' \| 'conflicting' \| 'demo' \| 'demo_incomplete' \| 'estimated' \| 'unknown'` | UI & lifecycle confirmation status of a `FarmEvent`. `'farmer_confirmed'` means farmer-reviewed only — never independent verification. |
| `EventSource` | `'farmer_reported' \| 'farmer_voice' \| 'ai_extracted' \| 'ai_estimated' \| 'receipt_verified' \| 'camera_product' \| 'gps_captured' \| 'weather_data' \| 'soil_report' \| 'verified_document' \| 'demo_data' \| 'unknown' \| 'farmer_confirmed'` | Original capture/display source identifier (legacy-compatible). Note: `'receipt_verified'` is rendered in UI as **Receipt Attached (Purchase Record)**, never as independently verified. `'farmer_confirmed'` is retained for legacy read compatibility only; new confirmations preserve original `source`. |
| `CostType` | `'actual' \| 'estimated' \| 'unknown'` | Distinguishes actually incurred expenditure (`'actual'`) from projected/estimated cost (`'estimated'`, excluded from `realExpenditure`) or unrecorded cost (`'unknown'`). |
| `CropStage` | `'land_preparation' \| 'sowing' \| 'vegetative' \| 'flowering' \| 'grain_filling' \| 'maturity' \| 'harvested' \| 'unknown'` | Sequential crop lifecycle stage. Validated by `VALID_STAGE_TRANSITIONS` and `STAGE_PROGRESS_BOUNDS`. `'harvested'` is terminal. |
| `AgronomicValidationStatus` | `'unvalidated_demo' \| 'unverified' \| 'source_validated'` | Declares whether crop dates, durations, or target yields have a verified applicable agronomic source. Demo records use `'unvalidated_demo'`. |
| `ConfidenceSource` | `'web_speech_api_asr' \| 'sensor_calibration' \| 'synthetic_demo_only'` | Mandatory provenance for any numeric `confidence` value. Real records may only use `'web_speech_api_asr'` or `'sensor_calibration'`; demo records may only use `'synthetic_demo_only'`. |
| `FarmEventType` | `'land_prep' \| 'sowing' \| 'irrigation' \| 'fertilizer' \| 'pest_scouting' \| 'spray' \| 'weeding' \| 'observation' \| 'harvest' \| 'sale' \| 'other'` | Category of agricultural field operation. |
| `SyncState` | `'online' \| 'offline' \| 'pending_sync' \| 'sync_completed'` | Simulated local-device sync indicator state (Phase 0.5/2 stores data in browser `localStorage` only). |
| `SemanticHealth` | `'healthy' \| 'attention' \| 'urgent' \| 'info' \| 'unknown'` | Severity/status classification for farm insight cards. |

---

## 2. Core Entities (`src/types/farm.ts`)

### 2.1 `FarmEvent`

| Field | Type | Required | Allowed Values / Format | Meaning & Integrity Rule |
| :--- | :--- | :---: | :--- | :--- |
| `eventId` | `string` | Yes | Unique ID (e.g. `EVT-...`, `DEMO-001`, `MEM-PAD-01`) | Stable primary identifier for the event. |
| `eventType` | `FarmEventType` | Yes | See `FarmEventType` | Type of farm operation. |
| `farmerId` | `string` | Yes | Active farmer ID (demo: `'farmer-ravi-01'`) | Owner farmer reference. |
| `farmId` | `string` | Yes | Active farm ID (demo: `'farm-ravi-01'`) | Farm reference. |
| `plotId` | `string \| null` | Yes | Plot ID (`'plot-a'`, `'plot-b'`, …) or `null` | Associated plot; `null` explicitly means plot unspecified. |
| `plotName` | `string` | Yes | Plot label or `'Not specified'` | Display name of the plot at capture time. |
| `cropCycleId` | `string` | No | `CropCycle.id` | Links event to a specific crop cycle. |
| `cropName` | `string` | Yes | Crop label or `'Not specified'` | Crop associated with the event. |
| `activityDate` | `string \| null` | Yes | Local calendar `YYYY-MM-DD` or `null` | Date the field activity occurred; `null` if unknown. |
| `recordedDate` | `string` | Yes | ISO-8601 timestamp | Timestamp when the event was logged in the app. |
| `title` | `string` | Yes | Non-empty string | Short human-readable summary of the event. |
| `description` | `string` | No | Free text | Optional field notes or narrative. |
| `inputName` | `string` | No | Product/input label | Primary agricultural input or equipment used (e.g. Urea, Drip Irrigation). |
| `fertilizerName` | `string` | No | Fertilizer name | Specific fertilizer name when spoken/entered (never invented). |
| `productName` | `string` | No | Product name | Specific chemical/spray product name when spoken/scanned. |
| `quantity` | `number \| null` | No | Finite number `>= 0` or `null` | Recorded amount; `null` when unknown (never coerced to `0`). |
| `unit` | `string \| null` | No | `'kg'`, `'quintals'`, `'hours'`, `'bags'`, `'liters'`, `'ml'`, `'acres'`, custom, or `null` | Measurement unit localized via `formatUnitLabel`. |
| `areaCoveredAcres` | `number \| null` | No | Positive acres or `null` | Field area covered by the activity. |
| `cost` | `number \| null` | No | Finite INR amount `>= 0` or `null` | Incurred or projected cost; `null` if unrecorded. |
| `currency` | `string` | Yes | `'INR'` | Currency code for `cost`. |
| `costType` | `CostType` | No | `'actual' \| 'estimated' \| 'unknown'` | Derived via `inferCostType` if absent; only `'actual'` non-demo costs count toward `realExpenditure`. |
| `source` | `EventSource` | Yes | See `EventSource` | Original capture source; preserved across confirmation & edits. |
| `originalSource` | `EventSource` | No | See `EventSource` | Immutable initial capture source preserved on edits/confirmations. |
| `activitySource` | `ActivitySource` | No | See `ActivitySource` | Separated origin field (derived via `inferActivitySource` if omitted). |
| `evidenceType` | `EvidenceType` | No | See `EvidenceType` | Separated evidence classification (derived via `inferEvidenceType` if omitted). |
| `status` | `RecordStatus` | Yes | See `RecordStatus` | Lifecycle / confirmation state of the record. |
| `confirmationStatus` | `ConfirmationStatus` | No | See `ConfirmationStatus` | Explicit farmer review/confirmation state. |
| `verificationStatus` | `TrustStatus` | Yes | See `TrustStatus` | Independent third-party verification state; downgraded by `normalizeEventProvenance` if unsupported. |
| `verificationMechanism` | `string` | No | Non-empty documented mechanism | Required whenever `verificationStatus === 'confirmed'`. |
| `isDemo` | `boolean` | Yes | `true \| false` | `true` for synthetic demo records; `false` for farmer-created persisted records. Immutable once saved. |
| `isDateAssigned` | `boolean` | No | `true \| false` | `true` when voice capture auto-assigned today's local date for farmer review. |
| `isEstimate` | `boolean` | No | `true \| false` | `true` when record is an estimate rather than an established field fact. |
| `estimateRationale` | `string` | No | Free text | Explanation and limitations of an estimated record. |
| `isTentative` | `boolean` | No | `true \| false` | Optional marker for provisional draft capture. |
| `rawTranscript` | `string` | No | Spoken transcript text | Raw speech text captured during voice input. |
| `evidence` | `FarmEventEvidence` | Yes | See §2.2 | Structured attachment metadata. |
| `confidence` | `number` | No | `(0, 1]` or `undefined` | Present **only** with a valid `confidenceSource`; stripped on manual/GPS/sourceless records by `sanitizeEventConfidence`. |
| `confidenceSource` | `ConfidenceSource` | No | See `ConfidenceSource` | Documented origin of `confidence`. |
| `createdBy` | `string` | Yes | Farmer name or `'Demo System'` | Creator attribution. |
| `confirmedBy` | `string` | No | Farmer name | Populated when farmer explicitly confirms record. |
| `confirmedAt` | `string` | No | ISO-8601 timestamp | Timestamp of farmer confirmation. |
| `correctionHistory` | `CorrectionHistoryItem[]` | No | Append-only array | Immutable field-level edit audit trail. |
| `conflicts` | `ConflictItem[]` | No | Array | Conflicting field values detected during review. |
| `createdAt` | `string` | Yes | ISO-8601 timestamp | Creation timestamp (also used for 30s duplicate guard). |
| `updatedAt` | `string` | Yes | ISO-8601 timestamp | Last modification timestamp. |

### 2.2 `FarmEventEvidence` & Sub-Structures

| Structure | Field | Type / Allowed Values | Meaning |
| :--- | :--- | :--- | :--- |
| `FarmEventEvidence` | `type` | `'photo' \| 'receipt' \| 'audio_note' \| 'lab_report' \| 'gps' \| 'weather' \| 'soil_test' \| 'none'` | Attachment media/signal category. |
| `FarmEventEvidence` | `label`, `uri`, `notes` | `string` (optional) | Display title, attachment URI, and contextual notes. |
| `FarmEventEvidence` | `isDocumentVerified` | `boolean` (optional) | `true` **only** for third-party verified documents; always `false`/omitted on seeded demo records. |
| `FarmEventEvidence` | `isSimulatedAi` | `boolean` (optional) | Marks simulated camera/AI extraction output. |
| `ProductInspectionDetails` | `productName`, `manufacturer`, `activeIngredient`, `batchNumber`, `expiryDate`, `clarityIssue` | `string \| null` | Extracted packaging details from camera inspection. |
| `ReceiptInspectionDetails` | `seller`, `date`, `product`, `unit` (`string \| null`); `quantity`, `amount` (`number \| null`); `currency` (`string`) | Structured invoice fields | Purchase/weighment receipt data (supports purchase/weighment only, not field application). |
| `GpsCoordinatesEvidence` | `latitude`, `longitude` (`number`); `accuracyMeters` (`number?`); `capturedAt`, `locationName` (`string?`) | Geo coordinates | Location log only (never equated to activity confidence or verification). |
| `WeatherDataEvidence` | `condition` (`string`); `temperatureC`, `rainfallMm`, `humidityPercent` (`number?`); `recordedAt`, `sourceStation` (`string?`) | Weather log | Station observation only (does not prove irrigation occurred). |
| `SoilReportEvidence` | `sampleId`, `labName` (`string`); `testDate`, `recommendation` (`string?`); `ph`, `nitrogenKgPerHa`, `phosphorusKgPerHa`, `potassiumKgPerHa` (`number?`) | Lab soil report | Laboratory test fields (not invented in demo data). |

### 2.3 `Farmer`, `Farm`, `Plot`, `Crop`, `CropCycle`

| Entity | Field | Type / Allowed Values | Meaning & Constraints |
| :--- | :--- | :--- | :--- |
| `Farmer` | `id`, `name`, `preferredName?`, `role`, `phone?`, `village`, `district`, `state`, `country`, `digitalComfort` (`'Basic' \| 'Intermediate' \| 'Advanced'`), `experienceYears` (`number`), `primaryObjectives` (`string[]`) | Farmer identity | Demo baseline: Ravi Kumar (`farmer-ravi-01`), Rasapūdipalem, Anakapalli, Andhra Pradesh, India; `phone: ''`. |
| `Farm` | `id`, `farmerId`, `name`, `totalAreaAcres` (`number`), `location`, `village`, `district`, `state`, `country`, `irrigationSource` (`string \| null`), `soilPrimary` (`string \| null`), `soilTestStatus` (`'not_available' \| 'pending' \| 'verified'`) | Farm holding | Demo baseline: `totalAreaAcres: 5.0`, `irrigationSource: null`, `soilPrimary: null`, `soilTestStatus: 'not_available'`. |
| `Plot` | `id`, `farmId`, `name`, `areaAcres` (`number`), `cropName`, `soilType` (`string \| null`), `waterSource` (`string \| null`), `irrigationType` (`string \| null`), `season?` (`string \| null`), `currentCropCycleId?` (`string`), `status` (`'active_crop' \| 'fallow' \| 'preparation' \| 'unknown'`), `soilOrganicCarbon?` (`number \| null`), `soilPH?` (`number \| null`), `soilDataTrust` (`TrustStatus`) | Individual field plot | Demo baseline: Plot A Paddy `2.0` acres + Plot B Groundnut `3.0` acres = `5.0` acres. All unknown soil/water fields remain `null` (never `0`). |
| `Crop` | `id`, `commonName`, `scientificName?`, `variety` (`string \| null`), `season?` (`string \| null`), `standardDurationDays?` (`number`) | Crop catalog entry | Reference crop definition. |
| `CropCycle` | `id`, `plotId`, `cropId`, `cropName`, `variety` (`string \| null`), `season` (`string \| null`), `sowingDate` (`YYYY-MM-DD \| null`), `expectedHarvestDate` (`YYYY-MM-DD \| null`), `actualHarvestDate?` (`YYYY-MM-DD \| null`), `stage` (`CropStage`), `stageProgressPercent?` (`0–100`), `targetYieldQuintals` (`number \| null`), `actualYieldQuintals?` (`number \| null`), `status` (`'active' \| 'completed' \| 'abandoned' \| 'unknown'`), `isDemo?` (`boolean`), `agronomicValidationStatus?` (`AgronomicValidationStatus`), `notes?` (`string`) | Crop season lifecycle | Validated by `validateCropCycleState`: `expectedHarvestDate` is strictly distinct from `actualHarvestDate`; `'harvested'` requires `status === 'completed'`, `stageProgressPercent === 100`, and non-null `actualHarvestDate`; progress bounds enforced per stage (`land_preparation` `0–15%`, `sowing` `10–25%`, `vegetative` `25–55%`, `flowering` `50–75%`, `grain_filling` `70–90%`, `maturity` `85–99%`, `harvested` `100%`). |

### 2.4 Audit, Market & Insight Types (`src/types/farm.ts`)

| Entity | Fields & Allowed Values | Meaning |
| :--- | :--- | :--- |
| `CorrectionHistoryItem` | `id` (`string`), `timestamp` (ISO string), `field` (`string`), `oldValue` (`string \| number \| null \| undefined`), `newValue` (`string \| number \| null \| undefined`), `reason?` (`string`) | Append-only record of every user edit to tracked event fields. |
| `ConflictItem` | `field` (`string`), `existingValue`, `incomingValue`, `description` (`string`) | Captured conflict between existing and incoming field values. |
| `MarketBenchmark` | `cropId`, `cropName`, `variety`, `marketName`, `minPricePerQuintal`, `modalPricePerQuintal`, `maxPricePerQuintal`, `currency`, `trend` (`'up' \| 'down' \| 'stable'`), `lastUpdatedDate`, `isMock` (`true`) | Simulated mandi price benchmark; `isMock: true` enforces non-live disclaimer. |
| `FarmInsight` | `id`, `title`, `summary`, `detail`, `severity` (`SemanticHealth`), `plotId?`, `plotName?`, `recommendationPrompt`, `isDemo` (`true`) | Demo field intelligence observation card. |

---

## 3. Profile & Personalization Types (`src/types/profile.ts`)

| Type / Field | Allowed Values | Default | Meaning |
| :--- | :--- | :--- | :--- |
| `FarmerProfile` | `id`, `fullName`, `preferredName`, `role`, `experienceYears` (`number`), `village`, `district`, `state`, `country`, `digitalComfort` (`'Basic' \| 'Intermediate' \| 'Advanced'`), `primaryObjectives` (`string[]`), `phone` (`string`), `avatarInitials` (`string`) | Ravi Kumar demo profile | Editable farmer profile persisted to `farm_intel_farmer_profile`. |
| `appLanguage` | `'Telugu' \| 'English' \| 'Hindi'` | `'Telugu'` | Active UI dictionary language; syncs `<html lang>`. |
| `voiceLanguage` | `'Telugu' \| 'English' \| 'Hindi'` | `'Telugu'` | Independent voice recognition language. |
| `interactionMode` | `'Quick' \| 'Assisted' \| 'Detailed'` | `'Quick'` | UI guidance density mode. |
| `aiResponseStyle` | `'Simple' \| 'Balanced' \| 'Detailed'` | `'Simple'` | Response verbosity preference. |
| `recommendationMode` | `'All recommendations' \| 'Important situations' \| 'Only when requested'` | `'Important situations'` | Advisory notification frequency. |
| `theme` | `'System' \| 'Light' \| 'Dark'` | `'System'` | Color theme preference. |
| `textSize` | `'Standard' \| 'Large' \| 'Extra large'` | `'Large'` | Root typography scale (`14px` / `15px` / `17px`). |
| `highContrast` | `boolean` | `false` | Enables High-Contrast Sunlight Mode. |
| `readAloud` | `boolean` | `true` | Enables read-aloud preference. |
| `reduceMotion` | `boolean` | `true` | Enables `motion-reduce` class. |
| `interactionPreference` | `'Touch' \| 'Voice' \| 'Balanced'` | `'Balanced'` | Preferred input modality. |
| `notificationPreferences` | `{ importantAlerts: string[], reminders: string[] }` | 5 alerts / 4 reminders | Alert and reminder subscriptions. |
| `quietHours` | `{ start: string, end: string }` (`HH:mm`) | `21:00`–`06:00` | Quiet hours window. |
| `unitLand?` | `'acres' \| 'bigha' \| 'hectares' \| 'guntha'` | `'acres'` | Preferred land area unit. |
| `unitWeight?` | `'quintals' \| 'kg' \| 'bags' \| 'tons'` | `'quintals'` | Preferred harvest weight unit. |

---

## 4. Browser Local Storage Keys

| Storage Key | Payload Schema | Persistence & Failure Behavior |
| :--- | :--- | :--- |
| `farm_intel_farmer_records_v1` | `FarmEvent[]` (JSON, real farmer records only; `isDemo: false`) | Validated & normalized via `normalizeEventProvenance` on both save and reload. Never stores demo records. |
| `farm_intel_corrupt_backup_<timestamp>` | Raw unparseable string | Quarantine backup created when `farm_intel_farmer_records_v1` contains invalid JSON or non-array data; prevents silent overwrite. |
| `farm_intel_farmer_profile` | `FarmerProfile` (JSON) | Persisted on Save & Apply; React state updates only after verified write. |
| `farm_intel_farmer_preferences` | `FarmerPreferences` (JSON) | Persisted on Save & Apply; safely migrated via `migratePreferences` on reload. |
