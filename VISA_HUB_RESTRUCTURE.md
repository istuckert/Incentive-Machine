# VISA HUB RESTRUCTURE SPEC
*For Claude Code — visa/index.html only*

---

## SCOPE

**Touch only:** `visa/index.html`  
**Do not touch:** `index.html` (platform landing page), diagram SVG, all modal content, all CSS variables, `/visa/logos/`, any other file in the repo.

**Goal:** Convert `visa/index.html` from a long-form scroll into a hub page. The hub has three zones:
1. Title + thesis (no changes — keep exactly as-is)
2. Unified two-stream web diagram (no changes — keep exactly as-is, including all hover/click/modal behavior)
3. Navigation tiles (new — replaces everything currently below the diagram)

**What gets cut:** Every section below the diagram. That means:
- Section 02 — Institutional Asset Managers (accordion)
- Section 03a — The H-1B Visa
- Section 03b — The H-2 Visa
- Section 04 — The Corporate Layer
- Section 05a/05b/05c — Dichotomy panels
- Section 06 — The Political Flip
- Section 07 — Sources

The nav bar links that pointed to those sections also get updated (see Nav section below).

---

## TILE LAYOUT

Five tiles. Vertical stack. Full width of content column.

```
┌─────────────────────────────────────────────┐
│              ASSET MANAGERS                 │  ← full width
└─────────────────────────────────────────────┘
┌─────────────────────┬───────────────────────┐
│        H-1          │          H-2          │  ← 50/50 split
└─────────────────────┴───────────────────────┘
┌─────────────────────────────────────────────┐
│                  MEDIA                      │  ← full width
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│             POLITICAL FLIP                  │  ← full width
└─────────────────────────────────────────────┘
```

---

## TILE SPECS

Each tile has:
- **Label** (heading)
- **Placeholder body copy** (2–3 sentences — will be rewritten by owner, do not treat as final)
- **CTA link** (points to `#` — destination pages do not exist yet)
- **Visual treatment** (see styling notes below)

---

### Tile 1 — ASSET MANAGERS
**Link target:** `#` (placeholder — will become `asset-managers.html`)  
**Color accent:** gold (`--gold: #d4a843`)

**Placeholder copy:**
> Placeholder: Brief description of what asset managers are and their role in the system. BlackRock, Vanguard, and State Street. AUM figure. Voting power. The retirement account connection. Two to three sentences maximum.

**CTA text:** `Explore the ownership chain →`

---

### Tile 2a — H-1 (left half of split row)
**Link target:** `#` (placeholder — will become `h1.html`)  
**Color accent:** H-1B blue (`--h1b: #4a8fd4`)

**Placeholder copy:**
> Placeholder: What the H-1 program says it is versus what it actually does. Statutory framing. One to two sentences.

**CTA text:** `Explore the H-1 chain →`

---

### Tile 2b — H-2 (right half of split row)
**Link target:** `#` (placeholder — will become `h2.html`)  
**Color accent:** H-2 green (`--h2: #3db87a`)

**Placeholder copy:**
> Placeholder: What the H-2 program says it is versus what it actually does. Statutory framing. One to two sentences.

**CTA text:** `Explore the H-2 chain →`

---

### Tile 3 — MEDIA
**Link target:** `#` (placeholder — will become `media.html`)  
**Color accent:** neutral (`--bg-panel: #202840` or similar muted tone — not gold, not blue, not green)

**Placeholder copy:**
> Placeholder: Brief description of how media narratives around these programs are constructed. Who funds the think tanks. How the same raw data gets interpreted in opposite directions. Two to three sentences.

**CTA text:** `Explore the media chain →`

---

### Tile 4 — POLITICAL FLIP
**Link target:** `#` (placeholder — will become `political-flip.html`)  
**Color accent:** absorb red (`--absorb: #7B2C2C`) or muted — not primary red

**Placeholder copy:**
> Placeholder: Brief description of how both parties have held both positions on these programs within the last decade. Position shifts correlate with donor needs, not ideology. Two to three sentences.

**CTA text:** `See the evidence →`

---

## TILE STYLING NOTES

- Use existing CSS variables only — no new color definitions
- Each tile: dark background (`--bg-panel` or `--bg-mid`), left border or top accent bar in tile color, white/cream body text
- Tile label: Cormorant Garamond (serif display, already loaded), large, color-accented
- Body copy: DM Sans (already loaded), normal weight, muted cream (`--bg-light` or similar)
- CTA: DM Mono (already loaded), small caps or uppercase, color-accented, underline on hover
- Full-width tiles: padding ~2rem vertical, ~2.5rem horizontal
- Split row (H-1/H-2): same padding, a thin divider line between the two halves — NOT a gap, a line. They are one row visually split.
- Hover state: slight background lift (one shade lighter than base), no border animation, cursor pointer
- No drop shadows — consistent with existing site aesthetic
- Tiles are NOT cards with rounded corners — keep flat/sharp edges consistent with existing design language

---

## NAV BAR UPDATES

Current nav links:
- Asset Managers → `#asset-managers` (section anchor — dead after cut)
- H-1B → `#h1b` (dead after cut)
- H-2 → `#h2` (dead after cut)
- Dichotomy → `#dichotomy-h1b` (dead after cut)
- Sources → `#sources` (dead after cut)

Replace with:
- Asset Managers → `#` (placeholder)
- H-1 → `#` (placeholder)
- H-2 → `#` (placeholder)
- Media → `#` (placeholder)
- Political Flip → `#` (placeholder)

Keep nav bar styling identical — just update labels and hrefs.

---

## FOOTER UPDATES

- Remove `#sources` anchor link (section is gone)
- Keep: feedback form link, `Created by Ian` credit, AI disclosure, `← Main Platform` link
- Add: `Sources →` pointing to `#` (placeholder — will become `sources.html`)

---

## SECTION LABEL BETWEEN DIAGRAM AND TILES

Add a small section label/divider between the diagram and the tile stack. Something minimal — a line, a label, whatever fits the existing design language. Suggested text:

> `EXPLORE THE MACHINE`

or just a horizontal rule. Owner will decide final copy. Do not add decorative elements not present elsewhere on the page.

---

## WHAT DOES NOT CHANGE

- Title block (headline, tagline, thesis box, hero stats)
- Unified two-stream SVG diagram (all nodes, edges, hover behavior, modals, everything)
- Hero image and overlay
- CSS variables
- Google Fonts imports
- Logo files
- Any JS associated with the diagram

---

## VERIFICATION CHECKLIST (run before pushing)

- [ ] All five tiles visible on desktop at full viewport width
- [ ] H-1/H-2 split row renders as one visual row with a dividing line, not two stacked tiles with a gap
- [ ] All tile CTA links point to `#` (no 404s)
- [ ] Nav bar updated — no dead anchors pointing to removed sections
- [ ] Diagram still fully functional — hover, click, modals all work
- [ ] Title/thesis block unchanged
- [ ] Footer updated — sources link present, points to `#`
- [ ] No console errors
- [ ] Mobile: tiles stack single-column (split row collapses to H-1 above H-2)
- [ ] No orphaned CSS for removed sections (clean up if possible, but do not remove variables)
