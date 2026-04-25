# UTILITY TRIANGLE — EDGE INVENTORY v1 — PASS 2 (EDGES)

Pass 2 of 2. Builds edges against the six clusters approved in Pass 1. Each edge has: short in-line label, direction, color category, cluster membership(s), source. Orphan edges (no cluster) have short click-modal text.

Color categories:
- **money-out** — People paying
- **money-in** — returns flowing to Companies (and into affiliated entities)
- **legal-power** — permits, authorizations, enforcement instruments, statutory disarmament
- **suppressed** — new category for this diagram: a flow that is structurally expected but functionally blocked. Rendered as a half-length arrow terminating in an X, not an arrowhead. Only one edge uses this category: E-UTIL-23 below.
- Cluster-active state: base color preserved, gold border added

---

## EDGES — Government → Companies

**E-UTIL-01 — Service Territory Monopoly**
G → C. legal-power. Clusters: CL-UTIL-4. Source: EIA utility market structure data (eia.gov/todayinenergy/detail.php?id=40913); Martin & Peskoe, "Extracting Profits from the Public" (Harvard ELI, March 2025).

**E-UTIL-02 — Authorized Rate of Return**
G → C. money-in. Clusters: CL-UTIL-1, CL-UTIL-2. Source: S&P Global Market Intelligence 2024 ROE data; Mark Ellis, "Rate of Return Equals Cost of Capital," American Economic Liberties Project (economicliberties.us, Jan 2025).

**E-UTIL-03 — Rate Base Approval (CapEx Inclusion)**
G → C. money-in. Clusters: CL-UTIL-1, CL-UTIL-2. Source: Energy at the Edge, "How Utilities Make Money" (energyattheedge.substack.com, Jul 2025); Averch & Johnson, *American Economic Review*, 52(5), 1962.

**E-UTIL-04 — Confidential Treatment of Contracts**
G → C. legal-power. Clusters: CL-UTIL-1. Source: Martin & Peskoe (Harvard ELI, March 2025) — 40 state PUC proceedings reviewed; "PUCs reflexively grant utility requests for confidential treatment."

**E-UTIL-05 — Bailout Statutes (Direct Ratepayer Surcharges)**
G → C. money-in. Clusters: CL-UTIL-3. Source: Ohio HB6 (2019); West Virginia Pleasants Power tax break (2019); Indiana HB1414 (2020); Leah Stokes, Vox (vox.com, Jul 22, 2020); LPM Ohio Valley ReSource reporting (lpm.org, Jul 27, 2020).

**E-UTIL-06 — Statutory Disarmament of Regulators**
G → C. legal-power. Clusters: CL-UTIL-3, CL-UTIL-5. Source: Mississippi Code § 77-3-271(3); Kansas Statute Annotated § 66-101i.

**E-UTIL-07 — Federal Subsidies and Loan Guarantees**
G → C. money-in. Clusters: *none — orphan; operates at the federal layer where subsidies flow to utilities, developers, and affiliated manufacturers without routing through the PUC process.*

*Click modal:*

The federal government transfers capital to the utility industry and adjacent sectors through multiple channels that bypass state rate regulation entirely. DOE's Advanced Technology Vehicles Manufacturing program extended over $1 billion in loans to Nissan and Ford. Federal loan guarantee programs route capital to what the Heritage analysis described as "giant tech firms, massive energy utilities, large investment banks." Federal EV tax credits distribute primarily upward — the Pacific Research Institute found more than 99% of the benefit flows to households earning $50,000 or more, and roughly 75% to households earning $100,000 or more. The point is not that any single subsidy is corrupt on its face; the point is that the capital stack available to utilities and their adjacent industries includes a federal tier that state ratepayers fund through federal taxes and that state PUCs have no visibility into. Source: Heritage Foundation analysis of federal energy subsidies (heritage.org, Jul 2018); Pacific Research Institute data via Wayne Winegarden.

---

## EDGES — Companies → Government

**E-UTIL-08 — Rate Case Filings**
C → G. legal-power. Clusters: CL-UTIL-1. Source: Martin & Peskoe (Harvard ELI, March 2025); Mark Ellis/AELP (economicliberties.us, Jan 2025).

**E-UTIL-09 — SURFA Rate-Case Consulting**
C → G. legal-power. Clusters: CL-UTIL-1. Source: David Dayen, "The Secret Society Raising Your Electricity Bills," American Prospect (prospect.org, Feb 21, 2025); Mark Ellis/AELP report.

**E-UTIL-10 — Lobbying and EEI Coordination**
C → G. money-out (visually thin). Clusters: *none — operates upstream of the clusters rather than as a member of one.*

*Click modal:*

Utility lobbying and its associated trade architecture — principally the Edison Electric Institute — function as coordination infrastructure that gives the national capture pattern its coherence. A relatively small dollar investment in lobbying and industry-body dues produces a much larger return in favorable rules, bailout authorizations, and regulatory treatment. The visual thinness of this edge relative to the thick money-in flows returning from Government to Companies is part of the argument. EEI is not itself a utility but functions as an arm of the industry — the institute awarded FirstEnergy for its work passing HB6, treating the bailout legislation as an industry accomplishment rather than a scandal. The Stokes framing: the industry celebrates it. Source: Leah Stokes, Vox (vox.com, Jul 22, 2020); Martin & Peskoe (Harvard ELI, March 2025).

**E-UTIL-11 — Ratepayer-Funded Political Spending**
C → G. money-in (from ratepayers, routed through utility accounting into political activity). Clusters: CL-UTIL-1, CL-UTIL-3. Source: FERC FirstEnergy Audit Report, Docket FA19-1-000 (Feb 4, 2022); California PUC Decision 24-12-074 (SoCalGas, Dec 2024); California PUC Decision 22-04-034 (SoCalGas, April 2022); 2024 FERC Report on Enforcement, Docket AD07-13-018.

**E-UTIL-12 — Dark Money to Candidate Pipelines**
C → G. money-out (large). Clusters: CL-UTIL-3, CL-UTIL-6. Source: FBI Householder affidavit (documentcloud.org/documents/6999130); Leah Stokes, Vox (vox.com, Jul 22, 2020); ComEd/Exelon federal settlement (Illinois, 2020).

**E-UTIL-13 — Regulator-Election Capture**
C → G. money-out. Clusters: CL-UTIL-3, CL-UTIL-6. Source: Leah Stokes, Vox (vox.com, Jul 22, 2020) on Arizona Public Service and former Commissioner Gary Pierce.

---

## EDGES — Companies → People

**E-UTIL-14 — Electricity Delivery (Baseline)**
C → P (service delivery); dollar moves P → C. money-in. Clusters: *none — baseline service relationship; every other Companies → People edge is a mechanism added on top of this baseline.*

*Click modal:*

Standard utility service. The company delivers electricity; the ratepayer pays a monthly bill. This edge represents the baseline the diagram is built around — every other Companies → People edge describes something that has been added on top of the ordinary service relationship. Without the underlying delivery, no extraction mechanism could attach. Source: EIA utility market structure data (eia.gov/todayinenergy/detail.php?id=40913).

**E-UTIL-15 — Rate-Base Return (Embedded in Bill)**
C → P (service delivery); dollar moves P → C. money-in. Clusters: CL-UTIL-2. Source: Energy at the Edge (energyattheedge.substack.com, Jul 2025); Isaac Orr and Mitch Rolling, "Green-Plating the Grid," Energy Bad Boys (energybadboys.substack.com, Mar 2024).

**E-UTIL-16 — Bailout Surcharges**
C → P (billed directly); dollar moves P → C. money-in. Clusters: CL-UTIL-3. Source: Ohio HB6 (2019); LPM (lpm.org, Jul 27, 2020); Stokes Vox piece.

**E-UTIL-17 — Cost-Shifted Transmission Charges**
C → P (billed directly); dollar moves P → C. money-in. Clusters: CL-UTIL-5. Source: Martin & Peskoe (Harvard ELI, March 2025); PJM Interconnection, 187 FERC ¶ 61,012 (2024).

**E-UTIL-18 — Peak-Demand Cost Pass-Through**
C → P (billed directly); dollar moves P → C. money-in. Clusters: CL-UTIL-5. Source: Martin & Peskoe (Harvard ELI, March 2025).

**E-UTIL-19 — Solar PPA Obligation (Captive-by-Deed)**
C → P (recurring service); dollar moves P → C. money-in. Clusters: CL-UTIL-4. Source: Solar Panel Exit (solarpanelexit.com); Solar to the People (solar-to-the-people.com); Blue Raven Solar (blueravensolar.com); Solar.com (solar.com/learn/selling-a-home-with-leased-solar-panels).

**E-UTIL-20 — Deferred-Maintenance Consequences**
C → P. legal-power (non-monetary — surfaces delivery gap). Clusters: *none — orphan; quality-of-delivery edge rather than a dollar flow.*

*Click modal:*

The incentive structure that rewards capital deployment and penalizes maintenance has physical consequences at the point of delivery. The PG&E Caribou-Palermo transmission line that sparked the 2018 Camp Fire was on an inspection schedule — operating expense — rather than a replacement timeline — capital expense. Maintaining a pole well enough that it lasts 60 years instead of 40 suppresses the utility's own profit growth because it delays capital replacement that would add to rate base. The rational utility decision is to let the old asset age to failure and then replace it as a new capital project. The ratepayer receives the consequence of that calculation as unreliable service, wildfires, and outages. Northern Foundry in Hibbing, Minnesota closed in 2023 after Minnesota Power industrial rates rose 62% across 2009–2023. The edge sits on the diagram without a cluster because it is not a dollar flow; it is the gap between what was paid for and what was delivered. Source: Research Section 7 (Camp Fire); Energy at the Edge; Energy Bad Boys (Mar 2024).

---

## EDGES — People → Companies

**E-UTIL-21 — Monthly Utility Bill**
P → C. money-out. Clusters: CL-UTIL-2, CL-UTIL-3, CL-UTIL-5. Source: EIA; Stokes Vox piece; Martin & Peskoe (Harvard ELI, March 2025).

**E-UTIL-22 — PPA Payment**
P → C. money-out. Clusters: CL-UTIL-4. Source: Solar PPA industry documentation (blueravensolar.com; solar.com).

---

## EDGES — Government → People

**E-UTIL-23 — Suppressed Ratemaking Transparency**
G → P. **suppressed** (half-length arrow with X terminator; click opens modal). Clusters: CL-UTIL-1.

*Click modal:*

This edge represents a flow that is structurally expected but functionally blocked. In principle, government is the party responsible for ensuring ratepayers can understand and challenge utility rate-setting — PUCs are public bodies, rate cases are public proceedings, and the utility's filings are public records. In practice, the flow is suppressed by three structural features documented by Kovvali and Macey and by Martin and Peskoe. First, the inherent subjectivity and complexity of ratemaking — Bonbright wrote in 1961 of "notorious disagreements among the experts as to the choice of the most rational method of cost allocation, a disagreement which seems to defy resolution." Second, utilities' substantial control over the information and process, including filing voluminous records the PUC must trust in good faith. Third, confidential treatment of contracts and data, which PUCs reflexively grant. The ratepayer receiving the monthly bill has no visible path from their cost back to the decisions that produced it. The diagram renders this as a half-length arrow with an X rather than an arrowhead: the flow exists in legal form and dies in practice. Source: Kovvali & Macey, "Hidden Value Transfers in Public Utilities," 171 U. Pa. L. Rev. 2129 (2023); Martin & Peskoe (Harvard ELI, March 2025); Bonbright, *Principles of Public Utility Rates* (1961).

**E-UTIL-24 — Democratic Process Suppression**
G → P. legal-power (non-protection; shows as the state failing to protect referendum rights from utility interference). Clusters: CL-UTIL-6. Source: Leah Stokes, Vox (vox.com, Jul 22, 2020) — Ohio HB6 referendum blocking; Arizona Public Service 2018 ballot initiative.

---

## EDGES — People → Government

**E-UTIL-25 — Federal Tax**
P → G. money-out. Clusters: *none — orthogonal; funds the federal subsidy tier and loan guarantees that reach utilities through E-UTIL-07.*

*Click modal:*

Federal income tax paid by ratepayers funds the federal tier of the utility capital stack — loan guarantees, DOE program disbursements, EV tax credits, tax equity subsidies that back solar PPA financing. The same person who pays a state-regulated monthly utility bill is also, as a federal taxpayer, funding the federal subsidies that flow to the same corporate family. The federal and state layers of the system are legally separate but route back to the same captive person. Source: Heritage Foundation (heritage.org, Jul 2018); Pacific Research Institute analysis.

**E-UTIL-26 — State Tax**
P → G. money-out. Clusters: *none — orthogonal; funds the state-level tax breaks and direct bailouts that appear in CL-UTIL-3 but flows through general revenue rather than direct ratepayer surcharge.*

*Click modal:*

State income tax and sales tax fund the portion of utility bailouts that runs through state general revenue rather than through direct ratepayer surcharges. The West Virginia Pleasants Power Station $12.5 million tax break appeared as forgone state revenue. Virginia's data-center sales-tax exemption cost the state approximately $1 billion in 2023 alone. The Mississippi Amazon package combined workforce subsidies, construction reimbursement, and tax exemptions totaling hundreds of millions. Unlike the bailout surcharges in CL-UTIL-3, which are visible as line items on utility bills, these amounts are absorbed into general state budgets and are rarely perceptible to the individual taxpayer. Source: Stokes Vox piece; Martin & Peskoe (Harvard ELI, March 2025).

---

## WHAT HAPPENS NEXT

1. You read through and mark any edits.
2. If changes are needed, I build a v2. If it passes, the utility inventory is complete and ready for JSON conversion (separate chat).
3. The three v3-equivalent documents (exaction inventory, utility Pass 1, utility Pass 2) together form the source of truth for both triangles.

---

## SUMMARY OF DESIGN NOTES

- **26 edges total.** G→C (7), C→G (6), C→P (7), P→C (2), G→P (2), P→G (2).
- **New color category "suppressed"** introduced for E-UTIL-23 (Suppressed Ratemaking Transparency). Half-length arrow with X terminator instead of arrowhead. Click opens modal.
- **EEI and NARUC have no dedicated edges.** They live inside the Companies node modal and their influence routes through E-UTIL-10 (Lobbying and EEI Coordination) and E-UTIL-09 (SURFA Rate-Case Consulting).
- **Orphan edges with click-modal text:** E-UTIL-07 (Federal Subsidies), E-UTIL-10 (Lobbying and EEI Coordination), E-UTIL-14 (Electricity Delivery Baseline), E-UTIL-20 (Deferred-Maintenance Consequences), E-UTIL-25 (Federal Tax), E-UTIL-26 (State Tax). Six orphans out of 26.
- **Multi-cluster edges:** E-UTIL-02 (Rate of Return — CL-UTIL-1, CL-UTIL-2), E-UTIL-03 (Rate Base — CL-UTIL-1, CL-UTIL-2), E-UTIL-06 (Statutory Disarmament — CL-UTIL-3, CL-UTIL-5), E-UTIL-11 (Ratepayer-Funded Political Spending — CL-UTIL-1, CL-UTIL-3), E-UTIL-12 (Dark Money — CL-UTIL-3, CL-UTIL-6), E-UTIL-13 (Regulator-Election Capture — CL-UTIL-3, CL-UTIL-6), E-UTIL-21 (Monthly Utility Bill — CL-UTIL-2, CL-UTIL-3, CL-UTIL-5).
- **No edge shares the exaction side's structure by design.** Where the patterns happen to rhyme (captive geography, cost externalization, jurisdictional fragmentation), the rhyming is structural rather than authored.
