# AI Farm Hub — Agronomic Validation Register & Expert Review Document (Track C)

- **Document Version**: 2.0.0 (Final Phase 2 Acceptance Preparation — Expert Review Package)
- **Last Updated**: 2026-11-19
- **Requested Reviewing Institutions**: **ANGRAU** (Acharya N. G. Ranga Agricultural University), **RARS Anakapalli** (Regional Agricultural Research Station, Anakapalli), or **KVK Kondempudi** (Krishi Vigyan Kendra, Anakapalli District, Andhra Pradesh)
- **Track C Overall Status**: `PENDING` *(Awaiting formal review and sign-off by a qualified Andhra Pradesh agronomist; `cycle-paddy-01`'s 71-day synthetic span remains unvalidated and flagged as biologically inconsistent with BPT-5204)*
- **Allowed Status Vocabulary**: `PASS` | `FAIL` | `BLOCKED` | `PENDING` | `NOT APPLICABLE`
- **No-Fabrication & Non-Mutation Policy**:
  - Working demo dates in `src/data/mockFarmData.ts` have **NOT** been silently replaced with an assumed agronomic standard.
  - No expert comments, credentials, institutional endorsements, or sign-off dates have been invented.

---

## 1. Expert Review Package: `cycle-paddy-01` (BPT-5204 — 71-Day Demo Duration)

### 1.1 Exact Repository Source of Existing Dates
Audit of the repository (`src/data/mockFarmData.ts` and `docs/CHANGELOG.md`) confirms the exact origin of the existing dates:
- **Seeded Values in `src/data/mockFarmData.ts`**:
  - `cycle-paddy-01` (lines 103–120): `cropName: 'Paddy / Rice (BPT-5204)'`, `variety: 'BPT-5204 (Samba Mahsuri)'`, `season: 'Kharif 2026 (Prior Demo Reference)'`, `sowingDate: '2026-06-10'`, `expectedHarvestDate: '2026-08-20'`, `actualHarvestDate: '2026-08-20'`, `targetYieldQuintals: 20.0`, `actualYieldQuintals: 18.5` (`2.0 acres` = `9.25 qtl/acre`), `isDemo: true`, `agronomicValidationStatus: 'unvalidated_demo'`.
  - Linked demo events: `MEM-PAD-01` (line 314, `activityDate: '2026-06-10'`, description: *"Transplanted certified Samba Mahsuri seedlings across 2 acres"*) through `MEM-PAD-07` (line 581, `activityDate: '2026-08-20'`, *"Harvested 1,850 kg paddy grain across 2 acres"*).
- **Provenance Confirmed**: Per `docs/CHANGELOG.md` (`[Phase 2 — Farm Memory + Timeline] - 2026-10-12`, line 92), these dates were **seeded solely as an illustrative UI timeline sequence from the Phase 2 product specification ("June 10 Sowing to August 20 Harvest")**. They did **not** come from an ANGRAU, RARS Anakapalli, KVK Kondempudi, or ICAR-IIRR crop calendar or from real field measurements.

### 1.2 Why the 71-Day Assumption May Be Biologically Inconsistent
- Calendar span from `2026-06-10` to `2026-08-20` is **71 days**.
- Published general variety literature from **ANGRAU** (breeder, RARS Bapatla, released 1986) and **ICAR-IIRR** (`https://angrau.ac.in`, `https://www.icar-iirr.org`) characterizes **BPT-5204 (Samba Mahsuri)** as a **medium-late duration fine-grain variety of ~135–145 days** (broadly 130–145/150 days seed-to-seed depending on season and management).
- Even if `2026-06-10` represented transplanting of ~25–30 day old seedlings rather than nursery sowing, post-transplanting maturity for BPT-5204 is typically on the order of ~110–115 days — still ~40+ days longer than the 71-day span currently seeded in `cycle-paddy-01`.
- **Additional Internal Activity Discrepancies Found in `MEM-PAD-01..07`**:
  1. `cycle-paddy-01.sowingDate` is `'2026-06-10'`, yet `MEM-PAD-01` on `'2026-06-10'` describes **transplanting seedlings** (*"Transplanted certified Samba Mahsuri seedlings"*).
  2. `MEM-PAD-02` (`2026-06-18`) logs **Drip Irrigation** on Plot A paddy, whereas `DEMO_FARM.irrigationSource` and `DEMO_PLOTS[0].irrigationType` are `null` (unknown) and flooded/intermittent puddled transplanting is conventional for BPT-5204 unless explicitly demonstrating aerobic/drip paddy.
  3. `MEM-PAD-03` (`2026-06-25`, Day 15) logs `40 kg` Neem Coated Urea across 2 acres, and `MEM-PAD-06` (`2026-07-20`, Day 40) shows an unverified `20 kg` MOP placeholder with zero soil test data (`soilTestStatus: 'not_available'`).
- **Action Taken in Code**: None silently replaced. `cycle-paddy-01` remains tagged `isDemo: true`, `agronomicValidationStatus: 'unvalidated_demo'`, separated from Plot A's active `cycle-paddy-current` (`land_preparation`), and accompanied by localized UI disclaimers pending expert decision.

### 1.3 Explicit Questions for the Reviewing Agronomist (`cycle-paddy-01`)
1. **Milestone Semantics**: In a real Andhra Pradesh paddy crop-cycle record (and in a realistic demo), should `sowingDate` strictly capture **nursery sowing date**, or **transplanting date** (with a separate optional `nurserySowingDate` / `plantingMethod` field)? How should direct-seeded rice (DSR) vs. transplanted paddy be represented so farmers do not confuse nursery sowing with main-field transplanting?
2. **Expected Harvest Milestone**: Should `expectedHarvestDate` represent **physiological maturity** or **planned grain harvest window** (range vs. single date)?
3. **Demo Correction Approval**: For an illustrative Kharif **BPT-5204** demo cycle in **Anakapalli district (North Coastal Zone)**, what realistic nursery sowing date, transplanting date, expected harvest window, and indicative 2-acre yield range (quintals) should replace the 71-day synthetic placeholder — OR is another rice variety more representative of Rasapūdipalem / Anakapalli mandal?

---

## 2. Expert Review Package: North Coastal Zone Demo Assumptions

### 2.1 Specified Farm Context (`src/data/mockFarmData.ts`)
- **Farm & Area Baseline**: Ravi Kumar Farm (`farm-ravi-01`), **5.0 acres total** (`Plot A — Paddy`: **2.0 acres**; `Plot B — Groundnut`: **3.0 acres**).
- **Location**: **Rasapūdipalem, Anakapalli district, Andhra Pradesh** — **North Coastal Zone** of Andhra Pradesh.
- **Active Demo Cycles**:
  - `cycle-paddy-current` (Plot A, 2.0 ac): `stage: 'land_preparation'`, `status: 'active'`, `variety: null`, `season: null`, `sowingDate: null`, `expectedHarvestDate: null`, `actualHarvestDate: null`, `targetYieldQuintals: null`, `actualYieldQuintals: null`.
  - `cycle-groundnut-01` (Plot B, 3.0 ac): `stage: 'land_preparation'`, `status: 'active'`, `variety: null`, `season: null`, `sowingDate: null`, `expectedHarvestDate: null`, `actualHarvestDate: null`, `targetYieldQuintals: null`, `actualYieldQuintals: null`.
- **Mock Market Benchmarks (`DEMO_MARKET_BENCHMARKS`, `isMock: true`)**:
  - Paddy: `BPT-5204 (Samba Mahsuri)` at `Anakapalli AMC Market Yard`.
  - Groundnut: `K-6 (Kadiri)` at `Anakapalli AMC Market Yard`.

### 2.2 Explicit Inventory of Missing Information (Preserved as `null` — Never Invented)
The following agronomic parameters are **unknown / unrecorded** in the demo baseline and strictly block generating locally applicable crop schedules or input recommendations:

| Missing Field | Current Value in Code | Why Required for Locally Applicable Recommendations |
| :--- | :---: | :--- |
| **Soil Type / Texture** (`soilPrimary`, `soilType`) | `null` | North Coastal Zone contains red sandy loams, coastal sandy soils, and alluvial/clayey deltaic soils with very different water retention and groundnut/paddy suitability. |
| **Soil Test / Fertility** (`soilTestStatus`, `soilPH`, `soilOrganicCarbon`) | `'not_available'`, `null`, `null` | Required before any N-P-K (including Urea or MOP Potash) dosage can be recommended. |
| **Water Availability & Irrigation Source** (`irrigationSource`, `waterSource`, `irrigationType`) | `null`, `null`, `null` | Determines whether Plot A/Plot B are rainfed Kharif, canal/tank-irrigated, or borewell-irrigated (critical for choosing medium-late BPT-5204 vs. shorter-duration varieties and Kharif vs. Rabi groundnut). |
| **Planting Method** (transplanted vs. direct-seeded paddy; rainfed vs. irrigated groundnut) | Not captured on `CropCycle` | Directly governs duration from main-field establishment to harvest and irrigation scheduling. |
| **Variety** (`cycle-paddy-current.variety`, `cycle-groundnut-01.variety`) | `null`, `null` | Crop duration, pest/disease risk, and yield benchmarks vary sharply by variety. |
| **Season** (`cycle-paddy-current.season`, `cycle-groundnut-01.season`, `Plot.season`) | `null` | Sowing windows and crop durations differ substantially between Kharif (monsoon) and Rabi/Summer in coastal Andhra Pradesh. |

### 2.3 Separation: General Crop Guidance vs. Locally Applicable Recommendations

| Topic | General Crop Guidance (Published State / National Literature — Illustrative Context Only) | Locally Applicable Recommendation for Rasapūdipalem, Anakapalli (North Coastal Zone) | Current Status |
| :--- | :--- | :--- | :---: |
| **Paddy — BPT-5204 (Samba Mahsuri)** | ANGRAU RARS Bapatla release (1986); fine medium-slender grain; **~135–145 days** seed-to-seed duration; widely cultivated across AP irrigated Kharif/Rabi tracts; known susceptibility to Bacterial Leaf Blight (BLB) and Blast (**ANGRAU** `https://angrau.ac.in`, **ICAR-IIRR** `https://www.icar-iirr.org`). | **NOT YET VALIDATED LOCALLY.** Requires RARS Anakapalli / KVK Kondempudi confirmation of whether BPT-5204 (or locally recommended North Coastal varieties / resistant derivatives) fits Rasapūdipalem's Kharif/Rabi water availability, cyclone/heavy-rain harvest risk, and local soil type. | `PENDING` |
| **Groundnut — Kadiri-6 (K-6 / K 1240)** | Bred at RARS Kadiri (ANGRAU); Spanish bunch type; Gazette Notification **S.O. 122(E)** dated **2005-02-02**; **~95–105 days** in Kharif and **~110–115 days** in Rabi/Summer; prominent across AP rainfed Rayalaseema & irrigated Rabi tracts (**ANGRAU** `https://angrau.ac.in`, **ICAR-DGR / ICAR-IIGR** `https://icar-iigr.org.in`). | **NOT YET VALIDATED LOCALLY.** Requires RARS Anakapalli / KVK Kondempudi verification of whether K-6 is prevalent in Anakapalli district & Anakapalli AMC Market Yard (North Coastal Zone) or whether another local variety (e.g., coastal-adapted Spanish bunch varieties) should be referenced in demo benchmarks. | `PENDING` |
| **Nutrient Placeholder (`MEM-PAD-06` — 20 kg MOP)** | General basal/split potash recommendations depend on soil K status and state package of practices. | **BLOCKED — NO SOIL TEST DATA.** With `soilTestStatus: 'not_available'`, any numerical fertilizer quantity is strictly an unvalidated synthetic placeholder, never an agronomic recommendation. | `BLOCKED` |
| **Irrigation Method (`MEM-PAD-02` — Drip on Paddy)** | Standard transplanted BPT-5204 in AP is typically managed under puddled/alternate wetting and drying (AWD) or canal/borewell surface irrigation; drip paddy is specialized. | **NOT YET VALIDATED LOCALLY.** Expert to confirm whether `MEM-PAD-02` should use a representative local irrigation practice (or be explicitly labelled as an illustrative dry-spell demo event contingent on unknown irrigation source). | `PENDING` |

### 2.4 Verified Institutional Reference Register & Documented Retrieval Gaps

| Source ID | Institution | Verified Official Portal URL | Fact Verified | Known Retrieval Gap |
| :--- | :--- | :--- | :--- | :--- |
| **SRC-01** | Acharya N. G. Ranga Agricultural University (**ANGRAU**) | `https://angrau.ac.in` | Breeder of BPT-5204 (RARS Bapatla, 1986; ~135–145 d) and Kadiri-6 (RARS Kadiri; 95–105 d Kharif / 110–115 d Rabi). | Direct Anakapalli district Package of Practices PDF / North Coastal crop calendar not retrievable in sandbox; expert to supply official circular/edition. |
| **SRC-02** | ICAR–Indian Institute of Rice Research (**ICAR-IIRR**) | `https://www.icar-iirr.org` | Confirms BPT-5204 fine-grain AICRIP check status and BLB/Blast susceptibility profile. | Site-specific Anakapalli trial data not retrieved; expert to confirm local disease/variety guidance. |
| **SRC-03** | ICAR–Directorate / Institute of Groundnut Research (**ICAR-DGR / ICAR-IIGR**) | `https://icar-iigr.org.in` (`https://icar.org.in`) | Confirms Kadiri-6 (`K-6` / `K 1240`) Spanish bunch habit and Gazette Notification `S.O. 122(E)` (`2005-02-02`). | North Coastal AP market-yard varietal share not retrieved; expert to confirm Anakapalli AMC relevance. |
| **SRC-04** | India Meteorological Department (**IMD**) — Agromet Framework | `https://imdpune.gov.in` | District agromet advisories operate jointly via IMD/ANGRAU (contrasting with synthetic `MEM-PAD-02` demo weather log). | Live Anakapalli IMD station feed is not integrated in Phase 2 (`MEM-PAD-02` is synthetic demo only). |

---

## 3. Expert Decision Table (To Be Completed by ANGRAU / RARS Anakapalli / KVK Kondempudi Reviewer)

> **Instructions for Expert Reviewer**: Do not accept any synthetic demo placeholder as authoritative agronomy. For each assumption below, record your recommendation, official supporting source (e.g., ANGRAU Vyavasaya Panchangam / RARS Anakapalli bulletin / KVK Kondempudi advisory with publication year), applicable conditions/limitations, formal decision (`Accepted` / `Rejected` / `Needs more information`), credentials, and sign-off date.

| Assumption | Existing Value (in Repository) | Expert Recommendation *(To be completed by reviewer)* | Supporting Source *(Existing general ref + space for local ANGRAU/KVK source)* | Conditions and Limitations | Decision (`Accepted` / `Rejected` / `Needs more information`) | Expert Name and Credentials | Date of Sign-Off |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **AGR-01: `cycle-paddy-01` BPT-5204 Duration** | `sowingDate: '2026-06-10'`, `expectedHarvestDate: '2026-08-20'`, `actualHarvestDate: '2026-08-20'` (**71 days**; tagged `unvalidated_demo`) | `PENDING — Expert to advise realistic Kharif duration/dates for BPT-5204 in Anakapalli (or confirm whether compressed UI-only placeholder is rejected)` | General ref: `SRC-01` (ANGRAU, 1986 release, ~135–145 d), `SRC-02` (ICAR-IIRR). Local RARS Anakapalli / KVK Kondempudi circular: `PENDING`. | Dependent on season (Kharif vs. Rabi), nursery vs. transplanting date, water source (`null`), and local monsoon/cyclone calendar. | `PENDING` | `PENDING — ANGRAU / RARS Anakapalli / KVK Kondempudi` | `PENDING` |
| **AGR-02: `cycle-paddy-01` Milestone Semantics (`sowingDate` vs. `MEM-PAD-01` Transplanting)** | `cycle-paddy-01.sowingDate = '2026-06-10'` while `MEM-PAD-01` on `'2026-06-10'` says *"Transplanted certified Samba Mahsuri seedlings"* | `PENDING — Expert to confirm whether farmer records should separate nursery sowing, transplanting, and direct seeding dates` | General ref: `SRC-01` (ANGRAU Paddy Package of Practices). Local citation: `PENDING`. | Transplanted paddy includes ~25–30 day nursery stage prior to main-field transplanting; conflating dates distorts stage/harvest expectations. | `PENDING` | `PENDING` | `PENDING` |
| **AGR-03: `cycle-paddy-01` Synthetic Yield Placeholder (Plot A, 2.0 ac)** | `targetYieldQuintals: 20.0`, `actualYieldQuintals: 18.5` (`1,850 kg` across 2 acres = `9.25 qtl/acre` ≈ `22.86 qtl/ha`; `isDemo: true`) | `PENDING — Expert to verify whether 18.5–20 qtl / 2 acres is a plausible illustrative yield range for Anakapalli Kharif BPT-5204` | Local RARS Anakapalli / AP Agriculture yield statistics: `PENDING`. | Soil type, soil fertility, irrigation source, and seasonal weather are `null`/unknown; must remain labelled synthetic demo only. | `PENDING` | `PENDING` | `PENDING` |
| **AGR-04: `MEM-PAD-02` Drip Irrigation on Paddy** | `Drip Irrigation Run — 4 hours` on Plot A paddy (`2026-06-18`, `isDemo: true`) while `irrigationSource: null` | `PENDING — Expert to advise whether drip irrigation on paddy is misleading for Anakapalli farmers or acceptable as an illustrative demo` | General ref: `SRC-01` (ANGRAU), `SRC-04` (IMD). Local citation: `PENDING`. | Farm `irrigationSource` and `irrigationType` are `null`; weather log (`34.2°C`, `0 mm`) is synthetic demo only. | `PENDING` | `PENDING` | `PENDING` |
| **AGR-05: Active Demo Cycles (`cycle-paddy-current` & `cycle-groundnut-01`) Null Baseline** | Plot A (2 ac Paddy) & Plot B (3 ac Groundnut) both in `land_preparation` with `variety: null`, `season: null`, `sowingDate: null`, `expectedHarvestDate: null`, `yield: null` | `PENDING — Expert to confirm keeping unrecorded fields null until farmer enters real season/variety/sowing data is agronomically sound` | Data integrity baseline + `SRC-01` (ANGRAU). Local citation: `PENDING`. | Prevents inventing unverified soil, irrigation, sowing, or harvest assumptions before farmer input. | `PENDING` | `PENDING` | `PENDING` |
| **AGR-06: Groundnut `K-6 (Kadiri)` Reference at Anakapalli AMC Market Yard** | `DEMO_MARKET_BENCHMARKS[1]` lists `K-6 (Kadiri)` at `Anakapalli AMC Market Yard` (`isMock: true`) | `PENDING — Expert to confirm whether K-6 is regionally representative in Anakapalli (North Coastal Zone) or recommend local benchmark variety` | General ref: `SRC-01` (RARS Kadiri, ANGRAU), `SRC-03` (ICAR-DGR/IIGR Gazette `S.O. 122(E)`, `2005-02-02`). Local Anakapalli citation: `PENDING`. | K-6 is widely known in Rayalaseema/scarce-rainfall & irrigated Rabi tracts; local North Coastal prevalence and soil/season fit require KVK confirmation. | `PENDING` | `PENDING` | `PENDING` |
| **AGR-07: `MEM-PAD-06` Unverified Potash (MOP) Estimate** | `20 kg` Muriate of Potash (MOP) placeholder (`isDemo: true`, `isEstimate: true`, `soilTestStatus: 'not_available'`) | `PENDING — Expert to confirm keeping nutrient estimates blocked/unconfirmable without soil test data` | No soil test available (`soilPH: null`, `soilOrganicCarbon: null`); prior unsupported ICAR label removed in Phase 2. | Must never be surfaced as an actionable recommendation without valid soil test report and local ANGRAU nutrient schedule. | `PENDING` | `PENDING` | `PENDING` |
