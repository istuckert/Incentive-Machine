# VISA MACHINE DIAGRAM — CLAUDE CODE BUILD SPEC
**Project:** The Manufactured Divide — H-1B / H-2 Visa Incentive Machine  
**File target:** `visa/index.html` (or a dedicated `visa/diagram.html`)  
**Repo:** https://github.com/istuckert/Incentive-Machine/  
**Date spec written:** April 2026  

---

## WHAT THIS IS

A single self-contained HTML file (no React, no build tools, no external dependencies except Google Fonts and optionally company logo images). It is an interactive node-and-edge diagram showing how institutional asset managers profit from both the H-1B and H-2 visa programs using American retirement savings. Two parallel vertical streams (H-1B left, H-2 right) flow downward from shared nodes at the top to American People nodes at the bottom.

**Must work:** Desktop browser at full viewport width. No horizontal scrolling. Mobile-responsive is secondary but should not be broken.

---

## TECH CONSTRAINTS

- Plain HTML / CSS / JS only — no React, no Vue, no build step
- Single `.html` file, self-contained
- SVG for the diagram canvas (not Canvas element)
- Vanilla JS for interactions
- Google Fonts allowed (already used across site)
- No external JS libraries required
- Must integrate with existing site styles if dropped into repo (dark background, existing nav)

---

## LAYOUT STRUCTURE

### Overall page layout
- Full viewport width diagram canvas
- Fixed or sticky top nav bar (match existing site nav)
- Legend bar below nav, above diagram
- Diagram fills remaining viewport height, scrollable vertically if needed — NO horizontal scroll
- Info modal overlays diagram on node click

### Two-stream layout with shared nodes
- **LEFT HALF:** H-1B stream (blue color family)
- **RIGHT HALF:** H-2 stream (green color family)  
- **CENTER TOP:** Shared nodes (Asset Managers, Narrative Infrastructure)
- **CENTER BOTTOM:** Two separate "American People" nodes — one at the bottom of each stream (same label, same color, connected by a thin horizontal line underneath to show they are the same entity)
- **Vertical center divider line:** subtle dashed line separating the two streams

### Lateral plane rules (nodes at same vertical level must not overlap)
Nodes on the same tier sit at the same Y position. Use horizontal spacing within each stream half.

---

## NODE DEFINITIONS

Each node has: ID, display label, sub-label (members/examples), tier (vertical position), stream, color, and modal content.

### SHARED NODES

**ID: `am`**  
Label: The Big Three Asset Managers  
Sub-label: BlackRock · Vanguard · State Street  
Tier: 1 (top)  
Stream: Shared (centered, spans both halves)  
Color: #1F3864 (dark navy)  
Logo slots: BlackRock logo, Vanguard logo, State Street logo (display beneath label inside node or in modal)  
Modal content: See MODAL CONTENT section below

**ID: `ni`**  
Label: Narrative Infrastructure  
Sub-label: NFAP · AFBF · CSIS · MPI · EIG · NCAE  
Tier: 1 (top, side node — sits lateral to Asset Managers, not in main vertical flow)  
Stream: Shared  
Color: #374151 (dark gray)  
Note: Side node. Connections are lateral/diagonal, not straight vertical.

---

### H-1B STREAM NODES (left half, blue family)

**ID: `univ`**  
Label: Universities  
Sub-label: Stanford · MIT · Harvard · Michigan +22 more  
Tier: 2 (side node — off to the left, lateral connections only, NOT in main vertical chain)  
Stream: H-1B  
Color: #2366A8  
Note: Lateral connections to Asset Managers and Tech Direct Sponsors only. Does not connect vertically downward into the main chain.

**ID: `tds`**  
Label: Tech Direct Sponsors  
Sub-label: Amazon · Meta · Microsoft · Google  
Tier: 2 (same lateral plane as H-1B End-Client Companies)  
Stream: H-1B  
Color: #1B4F8C  
Logo slots: Amazon, Meta, Microsoft, Google logos  

**ID: `ecc`**  
Label: H-1B End-Client Companies  
Sub-label: Citi · JPMorgan · Goldman · Verizon · AT&T · Walmart  
Tier: 2 (same lateral plane as Tech Direct Sponsors)  
Stream: H-1B  
Color: #1B4F8C  
Logo slots: Citi, JPMorgan, Goldman, Verizon logos  

**ID: `osf`**  
Label: Outsourcing / Staffing Firms  
Sub-label: TCS · Cognizant · Infosys · Wipro · HCL  
Tier: 3 (below both Tier-2 H-1B nodes)  
Stream: H-1B  
Color: #1B4F8C  
Logo slots: TCS, Cognizant, Infosys logos  

**ID: `h1w`**  
Label: H-1B Workers  
Sub-label: ~730,000 active · 71–73% Indian nationals  
Tier: 4  
Stream: H-1B  
Color: #0D3B6B (deepest blue)  

**ID: `ustw`**  
Label: U.S. Tech Workers  
Sub-label: Displaced · Wage-suppressed  
Tier: 5 (bottom of H-1B stream, left)  
Stream: H-1B (bottom absorber)  
Color: #7B2C2C (dark red — cost absorber)  

**ID: `ap_h1b`**  
Label: American People  
Sub-label: 128M retirement holders  
Tier: 6 (bottom of H-1B stream)  
Stream: H-1B  
Color: #4A0000 (darkest red)  
Note: Same entity as `ap_h2`. Connect the two with a thin horizontal line at the bottom.

---

### H-2 STREAM NODES (right half, green family)

**ID: `pe`**  
Label: Private Equity  
Sub-label: Teays River · Butterfly Equity · Arable Capital · Paine Schwartz  
Tier: 2 (side node — off to the right, lateral connection to Asset Managers and Large AG Operators. NOT in main vertical chain)  
Stream: H-2  
Color: #1E7A4A  

**ID: `lao`**  
Label: Large AG / Seasonal Operators  
Sub-label: Grimmway · Bolthouse · Dole · Taylor Farms · Ocean Mist  
Tier: 2 (same lateral plane as H-2B Direct Sponsors)  
Stream: H-2  
Color: #375623  
Logo slots: Dole logo, Taylor Farms logo  

**ID: `h2ds`**  
Label: H-2B Direct Sponsors  
Sub-label: ABC Tree Services · Progressive Solutions · Genuine Builders · Landscape Workshop  
Tier: 2 (same lateral plane as Large AG Operators)  
Stream: H-2  
Color: #375623  

**ID: `euf`**  
Label: H-2A End-User Farms  
Sub-label: Ocean Mist · Taylor Farms · NCGA member farms (600+)  
Tier: 3  
Stream: H-2  
Color: #375623  

**ID: `flc`**  
Label: Farm Labor Contractors (FLCs)  
Sub-label: NCGA · Foothill Packing · Wafla · Fresh Harvest · Temp Labor LLC  
Tier: 4 (BELOW End-User Farms — the human logic is: farms come first, FLCs service them)  
Stream: H-2  
Color: #2D4A1E  
Note: FLCs sit BELOW farms in the visual even though economically they are the certified sponsor. The visual hierarchy follows the human/labor logic, not the legal/economic hierarchy. Arrows carry the directionality.

**ID: `h2aw`**  
Label: H-2A Workers  
Sub-label: ~400,000 active · 90–92% Mexican nationals  
Tier: 5  
Stream: H-2  
Color: #1A5C38  

**ID: `h2bw`**  
Label: H-2B Workers  
Sub-label: ~169,000 active · 62% Mexican nationals  
Tier: 5 (same lateral plane as H-2A Workers)  
Stream: H-2  
Color: #1A5C38  
Note: H-2A and H-2B are SEPARATE worker nodes at the same tier level. H-2A connects upward through FLC chain. H-2B connects upward directly to H-2B Direct Sponsors.

**ID: `usfw`**  
Label: U.S. Farm / Seasonal Workers  
Sub-label: Wage-suppressed · Rural communities hollowed  
Tier: 6 (bottom of H-2 stream, right)  
Stream: H-2 (bottom absorber)  
Color: #7B2C2C  

**ID: `ap_h2`**  
Label: American People  
Sub-label: 128M retirement holders  
Tier: 7 (bottom of H-2 stream)  
Stream: H-2  
Color: #4A0000  
Note: Same entity as `ap_h1b`. Connect the two with a thin horizontal line at the bottom.

---

## EDGE DEFINITIONS

Format: FROM → TO | stream type | one-sentence label (shown in modal/tooltip on hover)

### Ownership / Control edges (top-down, Asset Managers downward)
- `am` → `tds` | h1b-solid | Owns 7–10% via index funds · votes 98.7% with management · rewards H-1B labor-cost strategies
- `am` → `ecc` | h1b-solid | Owns 5–10% · proxy votes capture margin gains from outsourced H-1B labor savings
- `am` → `pe` | h2-solid | Pension & endowment capital flows as LP allocations into PE funds targeting ag labor arbitrage
- `am` → `lao` | h2-solid | Owns Dole plc (BlackRock 5.11% / State Street 1.36% / Vanguard 0.82%) + public ag stakes
- `am` → `h2ds` | h2-solid | Owns parent companies of H-2B direct sponsors via broad S&P index holdings

### Narrative Infrastructure edges (lateral/diagonal)
- `ni` → `tds` | narrative-dashed | NFAP/EIG/CSIS frame same DOL data as net fiscal surplus — provides legislative cover
- `ni` → `lao` | narrative-dashed | AFBF Market Intel + NCAE advocacy frames H-2 as essential for genuine labor shortages

### University edges (lateral, side node)
- `univ` → `tds` | h1b-side-dashed | F-1 OPT graduates cycle directly into H-1B at sponsoring companies
- `univ` → `am` | h1b-side-dashed | Lobbies alongside tech for cap-exempt preservation · Harvard $1M+ lobbying 2025
- `tds` → `univ` | h1b-side-dashed | Funds STEM programs · TCS $35M CMU · Amazon/Google/Meta AI research centers

### Private Equity edges (lateral, side node)
- `pe` → `lao` | h2-solid | Acquires at scale (Grimmway 2021, Bolthouse 2019, Dole Fresh Veg Aug 2025 $140M) · installs H-2A labor discipline for 20–30% IRR target

### H-1B labor chain — PATH 1 (solid): Workers → Outsourcing → End-Client
- `h1w` → `osf` | h1b-solid | Outsourcing firm is employer of record · controls visa · imposes bench time · charges illegal fees ($100s–$1,000s)
- `osf` → `ecc` | h1b-solid | Deploys H-1B workers to end-client sites (Citi: ~3,000 TCS workers 2020–24) at 30–40% below direct hire cost

### H-1B labor chain — PATH 2 (dashed): Workers → Tech Direct Sponsors
- `h1w` → `tds` | h1b-dashed | SECOND PATH: direct H-1B employment at tech sponsors — no outsourcing intermediary

### H-1B downstream effects
- `h1w` → `ustw` | h1b-solid | LCA wage floors suppress IT sector wages · visa tether prevents collective organizing
- `ustw` → `ap_h1b` | h1b-solid | Reduced family income · depleted community tax base · career displacement costs never measured
- `h1w` → `ap_h1b` | h1b-solid | $15k–25k annual remittances to India · capital extracted from U.S. communities

### H-2 labor chain — PATH 1 (solid): H-2A Workers → End-User Farms → FLCs → Large AG
- `h2aw` → `euf` | h2-solid | Workers deployed to end-user farms · geographic isolation · no transit or legal aid
- `euf` → `flc` | h2-solid | FLCs certify, house, and manage H-2A crews placed at end-user farm sites
- `flc` → `lao` | h2-solid | Supplies tethered labor · large operators avoid sponsorship liability via FLC intermediary
- `flc` → `h2aw` | h2-solid | Triple tether: visa + housing + employment controlled by single entity · debt bondage · 60-day deportation clock

### H-2 labor chain — PATH 2 (dashed): H-2B Workers → H-2B Direct Sponsors
- `h2bw` → `h2ds` | h2-dashed | SECOND PATH: direct H-2B employment · no FLC intermediary · seasonal services sector (landscaping, construction, home services)

### H-2 downstream effects
- `h2aw` → `usfw` | h2-solid | AEWR wage floor suppression · $2.7–3.3B/yr documented impact on domestic farmworker wages
- `h2bw` → `usfw` | h2-solid | H-2B occupational wage depression in landscaping, construction, seasonal services
- `usfw` → `ap_h2` | h2-solid | Rural economic hollowing · spending multiplier collapse · seasonal income lost to rural families
- `h2aw` → `ap_h2` | h2-solid | $20k–25k annual remittances to Mexico & Central America · capital exits rural U.S.
- `h2bw` → `ap_h2` | h2-solid | Seasonal worker remittances · capital outflow from rural and suburban communities

### Return loops — profit flows back to asset managers (dashed red, curved)
- `ap_h1b` → `am` | return | 401(k)/IRA/pension auto-contributions → Big Three AUM → proxy voting power (128M U.S. households)
- `ap_h2` → `am` | return | Same retirement capital funds PE funds (via pension LP) and ag company stock held in index funds
- `tds` → `am` | return | Higher margins from H-1B cost suppression → share price rise → index fund gains → asset manager fee income
- `lao` → `am` | return | PE IRR + Dole plc stock appreciation → index fund returns → asset manager fee base growth

### Bottom connector
- `ap_h1b` ↔ `ap_h2` | connector | Thin horizontal line, same color as nodes, labeled "same entity" — these are the same 128M Americans

---

## EDGE STYLE TYPES

| Type | Color | Weight | Dash |
|---|---|---|---|
| h1b-solid | #4472C4 | 2px | solid |
| h1b-dashed | #4472C4 | 2px | 8px dash, 4px gap |
| h1b-side-dashed | #9DC3E6 | 1.5px | 5px dash, 3px gap |
| h2-solid | #548235 | 2px | solid |
| h2-dashed | #548235 | 2px | 8px dash, 4px gap |
| narrative-dashed | #C9A227 | 1.5px | 5px dash, 3px gap |
| return | #D95B5B | 1.5px | 8px dash, 4px gap |
| connector | #4A0000 | 1px | solid |

All edges have arrowheads at the target end indicating direction of flow.

---

## HOVER BEHAVIOR

When user hovers over any edge:
- That edge highlights (increases stroke weight to ~3–4px)
- All other edges dim to ~10% opacity
- The two connected nodes highlight (bright border ring)
- All other nodes dim to ~25% opacity
- A small tooltip appears near the cursor showing the one-sentence edge label

When user hovers over any node:
- All edges connected to that node highlight
- All other edges dim
- All connected nodes highlight
- All other nodes dim
- No tooltip on node hover (save that for click/modal)

When nothing is hovered:
- All edges at 48% opacity (readable but not overwhelming)
- All nodes at 100% opacity

---

## CLICK BEHAVIOR (MODAL)

Clicking a node opens a modal overlay. Clicking outside or pressing Escape closes it.

### Modal structure
- Dark semi-transparent backdrop
- Centered white/dark card (match site theme)
- Close button top-right
- Contents:
  1. Node title (large)
  2. Company logos (if applicable — see logo slots above)
  3. Classification paragraph (2–3 sentences on what this group is)
  4. Key data bullets (sourced stats from master research)
  5. Upstream effects (what this node sends downstream)
  6. Downstream effects (what flows back up to this node)
  7. Primary source links

### Modal content — The Big Three Asset Managers (`am`)
**Classification:** BlackRock, Vanguard, and State Street manage retirement accounts for more than half of all U.S. households — 128 million individual investors. When you signed up for your 401(k), buried in the terms and conditions nobody reads, you handed them something far more valuable than your money: your vote.

**Key data:**
- Combined AUM: >$26 trillion (BlackRock $13.89T confirmed Q1 2026)
- Largest shareholder in ~88% of S&P 500 companies
- 20–25% median voting power at any shareholder meeting
- 98.7% management proposal support rate, 2025 proxy season
- ~74% of U.S. equity ETF market
- 56.4% of U.S. households hold accounts through them (128M investors)
- ERISA §403(a)(2): proxy voting is the fiduciary duty of the manager, not the account holder
- BlackRock federal lobbying 2025: $3.4M — almost none on immigration
- Vanguard federal lobbying 2025: $2.58M — almost none on immigration
- Portfolio companies do the direct lobbying; managers vote aligned blocks

**Sources:** BlackRock Q1 2026 earnings · ICI 2025 · Morningstar 2025 · DOL Federal Register Dec 2020 · OpenSecrets 2025

---

*(Additional modal content for each node to be filled in from Visa_Incentive_Machine_Master_Research_v2.docx — the reference document. Key chapters: Ch01 for program scale, Ch04 for wage data, Ch06 for enforcement, Ch09 for asset manager tie-ins.)*

---

## COMPANY LOGOS

Display beneath the node title label inside the node box, or in the modal header.

**Nodes with logo slots:**
- `am`: BlackRock, Vanguard, State Street
- `tds`: Amazon, Meta, Microsoft, Google (Alphabet)
- `ecc`: Citigroup, JPMorgan Chase, Goldman Sachs, Verizon
- `osf`: Tata Consultancy Services, Cognizant, Infosys
- `lao`: Dole, Taylor Farms

**Implementation:** Use company SVG logos or PNG logos via `<img>` tags. Store in `/visa/logos/` directory. Display at ~24–28px height, grayscale by default, full color on hover/in modal. If logos cannot be sourced, use company name text badges instead.

**Do not display logos for:** `univ`, `pe`, `h2ds`, `flc`, `euf`, worker nodes, absorber nodes, American People nodes.

---

## LEGEND

Fixed bar below nav. Contains:
- Stream color key: Blue = H-1B stream | Green = H-2 stream
- Line style key: Solid = main labor/ownership chain | Dashed = second/direct path | Gold dashed = narrative/influence | Red dashed = profit return loop
- Note: "Dashed lines = direct paths (no intermediary)"

---

## STRUCTURAL NOTES FOR CLAUDE CODE

1. **No horizontal scroll.** The diagram must fit within viewport width. Use relative/percentage positioning or SVG viewBox that scales. If nodes are too many to fit, reduce node width before adding scroll.

2. **SVG or HTML/CSS flex?** SVG is recommended for the diagram canvas (precise edge routing, arrowheads, curved return loops). Node boxes can be SVG foreignObject or pure SVG rect+text.

3. **Arrow routing:** Edges between nodes on the same lateral plane (e.g., `ecc` and `tds`) should curve outward, not draw a straight horizontal line that cuts across. Use quadratic bezier curves. Return loop edges (`ap` → `am`) should arc widely on the outer edges of the diagram.

4. **Two "American People" nodes** connected by a horizontal line at the bottom. This is intentional — one per stream, same entity, showing the American retiree funds both sides simultaneously.

5. **FLCs sit BELOW End-User Farms** in the visual vertical order. This is not an error. It reflects the human labor logic (workers → farms → FLCs → Large AG), not the legal certification order.

6. **H-2A and H-2B workers are separate nodes** at the same vertical level. H-2A connects up through FLCs. H-2B connects directly to H-2B Direct Sponsors (dashed).

7. **Universities and Private Equity are side nodes** — they have lateral connections only and are not in the main vertical flow. They should be visually offset to the sides, not blocking the main chain.

8. **Mobile:** The diagram will not be fully interactive on mobile. On small screens, display a static version or a simplified summary card. Do not break the desktop layout to accommodate mobile.

9. **Reference document:** Full sourced data for all modal content is in `Visa_Incentive_Machine_Master_Research_v2.docx` in the repo at `reference/visa/`. Each node's modal content should pull from the corresponding chapter.

---

## FILES TO REFERENCE IN REPO

- `reference/visa/Visa_Project_Outline_v9.docx` — architecture and section structure
- `reference/visa/Visa_Incentive_Machine_Master_Research_v2.docx` — all sourced data, organized by chapter
- `visa/index.html` — active module file (this diagram goes here or in `visa/diagram.html`)
- `index.html` — platform landing page (do not modify)

---

## WHAT IS ALREADY BUILT (DO NOT REBUILD)

- Platform landing page (`index.html`) with D3 force-directed module web
- Site nav, color palette, typography
- Section shells for Home, Asset Managers, H-1B, H-2, Corporate Layer, Dichotomy of Truth, Political Flip, Sources

## WHAT THIS SPEC IS BUILDING

The interactive chain diagram that lives in the visa module — the visual centerpiece that shows all actors, their connections, and the extraction loop. This is the "chain" referenced in the project outline Section 01.

---

*Spec written April 2026. Hand this file to Claude Code as the first message along with access to the repo.*
