# The Manufactured Divide — Project Instructions

## What This Is
An independent investigative platform mapping verifiable incentive structures across major American policy sectors. Built as a hosted static site on GitHub Pages.

**Live URL:** https://istuckert.github.io/Incentive-Machine/
**GitHub Repo:** https://github.com/istuckert/Incentive-Machine
**Created by:** Ian

---

## Architecture
Multi-page static site. No framework. No build tools. No backend. Plain HTML, CSS, JavaScript.

Each page is a standalone HTML file sharing inline CSS and JS. No separate stylesheet or script files exist — everything is self-contained per page.

**File structure:**
- index.html — Platform landing page (The Manufactured Divide)
- visa/index.html — H-1B / H-2 Visa Machine module (LIVE, substantially complete)
- healthcare/index.html — Preview page only
- defense/index.html — Preview page only
- banking/index.html — Preview page only
- education/index.html — Preview page only
- reference/visa/ — Research documents (do not modify)

---

## Design System
All pages share these design decisions. Never change them without explicit instruction.

**Fonts (loaded from Google Fonts):**
- Playfair Display — hero titles, section headings
- Cormorant Garamond — italic body, quotes, purpose statements
- DM Mono — labels, nav, data, code-like elements
- DM Sans — body prose

**Colors:**
- Background: #f4f1ec (cream) for content sections
- Dark: #1c1f2e (navy) for nav, hero, dark bands
- Accent: #2d5fa6 (blue) — primary interactive color
- Red: #b93a2b — tension, warnings, argument nodes
- Teal: #1a7a6e — H-2 program color

**Key CSS variables:** --bg, --bg-2, --bg-dark, --ink, --ink-2, --ink-3, --accent, --red, --teal, --serif, --serif-2, --mono, --sans

---

## The Web (index.html)
D3.js force-directed network graph. Five module nodes. No center node.

**Five nodes:**
- visa → visa/index.html (ACTIVE — blue stroke)
- healthcare → healthcare/index.html (inactive — navy stroke)
- defense → defense/index.html (inactive — navy stroke)
- banking → banking/index.html (inactive — navy stroke)
- education → education/index.html (inactive — navy stroke)

**Links (pentagon + no cross-links):**
visa→healthcare, healthcare→defense, defense→banking, banking→education, education→visa

**Node appearance:** Ring only, no fill. Active visa node uses blue (#2d5fa6). Inactive nodes use navy rgba(28,31,46,0.7).

**Callout labels:** Auto-positioned away from center. Box with title + status line. Clickable for active nodes.

---

## Content Rules
- Every factual claim requires a primary source link
- No claim without a source — placeholder text must be clearly marked
- Political neutrality is a core requirement — no partisan framing
- Phase 4 (Corporate Layer) and Phase 6 (Political Flip) are pending research — do not fabricate data for these sections
- Pending sections are marked with placeholder blocks, not omitted

---

## Build Rules
- Build one file at a time
- Verify locally with: open [filename].html before every git push
- Run git status before every git add
- Never push without local verification
- One focused instruction at a time for precise CSS changes
- Always read the file and report current state before making changes

---

## Phase Status (April 2026)
- Platform landing page: ✓ Live
- Visa module shell: ✓ Live
- Asset Managers section: ✓ Substantially complete
- H-1B section: 🔶 Partial — Phase 4 research pending
- H-2 section: 🔶 Partial — Phase 4 research pending
- Corporate Layer (Phase 4): ⬜ Pending research
- Dichotomy of Truth (Phase 5): ✓ Populated
- Political Flip (Phase 6): ⬜ Pending research
- Healthcare module: ⬜ Preview only
- Defense module: ⬜ Preview only
- Banking module: ⬜ Preview only
- Education module: ⬜ Preview only
- Polish and mobile (Phase 7): ⬜ Pending

---

## Pending Research Gaps
**Phase 4 — Corporate Layer:**
- Per-company H-1B visa counts and year-over-year trend (USCIS Employer Data Hub)
- Estimated labor cost savings per employer (EPI prevailing wage methodology)
- Full ownership chain: Company → Parent → Institutional Holder → Asset Manager (SEC 13F)
- Federal contract receipts per top H-1B sponsor (USASpending.gov)
- Lobbying expenditures per company (OpenSecrets)
- PAC contributions per company (FEC)
- Layoff records vs H-1B hiring (WARN Act / 8-K filings)
- H-2 sponsor → PE intermediary → Big Three chain (KKR/Blackstone confirmation)

**Phase 6 — Political Flip:**
- Congressional vote records on H-1B/H-2 expansion with party breakdowns
- Donor tracking by company and party by year (OpenSecrets)
- Exact quotes with dates from Sanders, Grassley, Durbin, Musk, GOP establishment
- Party platform language 2008–2024 (both parties)
- Pew Research polling data on immigration views by party and year

---

## Decisions Log
- April 2026: Migrated from single HTML file to multi-page static site on GitHub Pages
- April 2026: Platform renamed from "The H-1B/H-2 Visa Incentive Machine" to "The Manufactured Divide"
- April 2026: Home screen redesigned as D3 force-directed web with five module nodes
- April 2026: Color scheme — cream/navy/blue (v8 palette) replacing dark red theme
- April 2026: No center node on web — modules connect directly to each other
- April 2026: Tagline confirmed: "The argument is the product."
- April 2026: Jefferson 1820 quote added to hero — primary source linked
- April 2026: AI disclosure added — research by human, AI used for coding and organization
- April 2026: Google Form feedback: https://forms.gle/fLaPAhALSbHqioBa6
- April 2026: University of Kentucky College of Law removed from all attribution
- April 2026: Credit: "Created by Ian" only
