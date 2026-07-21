# Crazy Soda Pop — Theme Specification (Homepage v1)

**Purpose:** Define how the Shopify theme implements Homepage v1 without hardcoding business decisions.

**Authority:** **`00_Master/Final_Business_Decisions.md` overrides all other documents and approved visuals.** See `00_Master/SOURCE_OF_TRUTH.md`.

**Do not implement theme code until approved.** This document is specification only.

**Read before build:**

1. `00_Master/Final_Business_Decisions.md`
2. `00_Master/SOURCE_OF_TRUTH.md`
3. `01_Brand/Brand_Bible.md`
4. `05_Website/Homepage_Blueprint.md`
5. `05_Website/Homepage_Specification.md`
6. `05_Website/Navigation.md`
7. `00_Master/AI_RULES.md`

**Visual references (composition and identity—not overriding Final):**

- `14_Reference/Approved_Visuals/01_APPROVED_HOMEPAGE_DIRECTION.png`
- `14_Reference/Approved_Visuals/02_APPROVED_BRAND_GUIDE.png`

---

## Platform and stack (AI_RULES)

- Shopify Online Store 2.0: JSON templates, Liquid sections, CSS, lightweight JavaScript.
- Every homepage feature is an **editable section** with valid **schema** and **presets** where appropriate.
- Mobile and desktop layouts built together.
- No unnecessary libraries; no autoplay video.

---

## Theme settings (global — not hardcoded in sections)

### Brand colors (from Brand Bible — hex fixed until new approved asset)

| Setting label | Default hex |
|---------------|-------------|
| Vintage Red | `#B8322A` |
| Soda Teal | `#1F6B67` |
| Cream | `#F5EFE2` |
| Warm Tan | `#F0CFAB` |
| Root Beer Brown | `#4A2720` |
| Hero Navy | Sample from homepage direction PNG during theme build (document exact hex in theme—do not invent without sampling reference) |

### Typography (from Brand Bible)

| Setting | Default |
|---------|---------|
| Headings font | Playfair Display Bold |
| Subheadings font | Oswald SemiBold |
| Body font | Lato Regular |

Load via Shopify font picker or approved webfont pipeline; do not substitute typefaces.

### Logo and favicon

- **Provisional logo artwork**; production logo wording **not finalized**.
- Image pickers for header logo (and optional alternate lockup)—**no logo text in Liquid/HTML**.
- Favicon image picker.

### Spacing and buttons

- Theme-level border radius, button padding, and section vertical spacing scales.

---

## Homepage template structure

**Template:** `templates/index.json`

**Sections (in order)** — must match `05_Website/Homepage_Blueprint.md`:

| # | Section handle (suggested) | Mockup reference |
|---|---------------------------|------------------|
| 1 | `announcement-bar` | Yes |
| 2 | `header` (theme header group) | Yes |
| 3 | `hero-home-v1` | Yes |
| 4 | `social-proof-strip` | Partial (badges in hero mockup; strip is separate section per Blueprint) |
| 5 | `shop-category-tiles` | Yes (SHOP ALL column / cream grid) |
| 6 | `build-a-pack-promo` | Yes (BUILD A PACK column) |
| 7 | `soda-discovery-club-promo` | Yes (SUBSCRIPTIONS column) |
| 8 | `club-how-it-works` | Yes |
| 9 | `candy-promo` | Yes (CANDY column) |
| 10 | `packaging-shipping-trust` | No detailed layout in PNG |
| 11 | `marketplace-reviews` | No — **content empty until approved reviews** |
| 12 | `faq-home` | No |
| 13 | `email-signup` | No |
| 14 | `footer` (theme footer group) | No |

**Not included for v1:** `gift-boxes`, `featured-products` (see Blueprint).

Sections 5–9 may be implemented as one **four-tile** section plus separate narrative sections, or as separate sections—provided storefront order matches Blueprint. Do not invent layouts beyond Homepage_Specification notes.

---

## Section requirements (summary)

### `announcement-bar`

Editable text; defaults aligned with `05_Website/Navigation.md`. No mockup all-orders-free default.

### `header`

- Menu: frozen v1 structure (`05_Website/Navigation.md`).
- Nested **Shop Soda** → Single Bottles, 6 Packs, 12 Packs.
- Highlight **Soda Discovery Club** (mockup SUBSCRIPTIONS styling).
- Logo: image setting only.

### `hero-home-v1`

Editable: frozen headline, supporting line, body, primary/secondary buttons, hero image, optional plan CTAs.

**Do not include:** star rating badges; “The Soda Discovery Co.” copy; hardcoded collection handles.

Subscription prices: only via theme settings/metaobjects populated from admin using **Final_Business_Decisions** values—never invented in code.

### `social-proof-strip`

Three editable text blocks defaulting to Final-approved non-review statements. **No rating UI.**

### `shop-category-tiles`, `build-a-pack-promo`, `soda-discovery-club-promo`, `candy-promo`

Image, title, description, button label, URL per `Homepage_Specification.md`. URLs **TBD in Admin**—no hardcoded handles.

### `club-how-it-works`

Three steps; defaults from mockup copy in Homepage Specification.

### `packaging-shipping-trust`

Icon + text blocks; themes from Final. **No “Ships from North Carolina”** default.

### `marketplace-reviews`

- Section title default: **What Customers Say About Crazy Soda Pop**
- **No default review entries**; section disabled or empty state until approved marketplace content is supplied.
- **No star rating aggregates** until verified from an approved source.

### `faq-home`, `email-signup`

Editable blocks; empty/minimal defaults—no invented FAQ or offer copy in theme presets.

### `footer`

Menu blocks for FAQ, Contact, Shipping, Policies.

---

## Prohibited in theme defaults

- Product or collection handles
- Subscription app selection
- Fabricated reviews or ratings
- Logo text strings in markup
- “The Soda Discovery Co.” as subscription naming
- Unapproved ship-from origin claims

---

## Snippets (suggested)

- `icon-truck`, `icon-cart`, `icon-account`, `icon-search` (SVG)
- `trust-badge`
- `button-primary`, `button-secondary`

---

## Data dependencies (Admin / other folders)

| Dependency | Status |
|------------|--------|
| Navigation URLs | TBD in Shopify Admin |
| Collections for Single Bottles, 6 Packs, 12 Packs, Candy | TBD — not documented as handles |
| Build a Pack destination | TBD |
| Soda Discovery Club products + subscription billing | TBD; test per Final |
| Hero and tile photography | `07_Images` (empty) |
| Approved marketplace reviews | **Not supplied** |
| FAQ copy | TBD |
| Legal pages | `12_Legal` when available |
| Final logo asset | **Provisional** |

---

## Performance and accessibility (AI_RULES)

- Lazy-load below-fold images; responsive `srcset`; minimal JS.
- One h1 (typically frozen hero headline); focus states; meaningful alt text.

---

## QA checklist before launch

- [ ] `Final_Business_Decisions.md` rules reflected in defaults
- [ ] Frozen v1 nav and hero copy
- [ ] No star ratings or unverified scores
- [ ] No “Soda Discovery Co.” subscription naming
- [ ] No “Ships from North Carolina”
- [ ] Reviews section empty or hidden until approved content
- [ ] Logo via image setting only
- [ ] Shipping: $39+ merchandise + subscription rules (continental U.S.)
- [ ] Subscription billing tested in Shopify
- [ ] No Gift Boxes homepage section required for v1

---

## Repository status

Theme implementation files (`sections/`, `assets/`, `config/`) are **not** present yet. Specification only until approved for development.
