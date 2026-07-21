# Crazy Soda Pop — Navigation Specification

**Version:** Homepage v1 (frozen)

**Authority:** **`00_Master/Final_Business_Decisions.md` overrides all other documents and visuals.** See `00_Master/SOURCE_OF_TRUTH.md`.

**Visual reference (composition only):** `14_Reference/Approved_Visuals/01_APPROVED_HOMEPAGE_DIRECTION.png` — header bar, logo placement, utility icons, and uppercase nav styling. Mockup labels are **not** live nav copy.

---

## Primary navigation (frozen — do not rename for v1)

| Label | Behavior |
|-------|----------|
| **Shop Soda** | Parent item; opens dropdown |
| ↳ **Single Bottles** | Links to single-bottle collection or catalog (URL TBD in Shopify Admin) |
| ↳ **6 Packs** | Links to 6-pack collection or catalog (URL TBD) |
| ↳ **12 Packs** | Links to 12-pack collection or catalog (URL TBD) |
| **Soda Discovery Club** | Links to subscription landing or plan selector (URL TBD) |
| **Build a Pack** | Links to Build a Pack experience (URL TBD) |
| **Candy** | Links to candy collection or catalog (URL TBD) |
| **About Us** | Links to About page (URL TBD) |

This list is the **only** approved v1 primary navigation. Use the same structure in AI_RULES, Homepage_Blueprint, Theme_Specification, and Shopify menu configuration.

### Mockup label mapping (implement frozen labels, mockup styling only)

| Mockup label (`01_APPROVED_HOMEPAGE_DIRECTION.png`) | Frozen v1 label |
|------------------------------------------------------|-----------------|
| SHOP ALL (dropdown) | **Shop Soda** (dropdown: Single Bottles, 6 Packs, 12 Packs) |
| 6-PACKS (top-level in mockup) | **6 Packs** (under Shop Soda only) |
| 12-PACKS (top-level in mockup) | **12 Packs** (under Shop Soda only) |
| SUBSCRIPTIONS (highlighted) | **Soda Discovery Club** |
| BUILD A PACK | **Build a Pack** |
| CANDY | **Candy** |
| ABOUT US | **About Us** |

---

## Header utilities (from approved homepage direction)

Right-aligned icons (as shown in mockup):

- Search
- Account
- Cart (with item count badge when applicable)

**Logo:** Left-aligned; approved production asset `14_Reference/Approved_Visuals/03_APPROVED_LOGO.png` (see `01_Brand/Brand_Bible.md`), rendered via editable Shopify logo image setting.

---

## Announcement bar

**Approved messaging themes (continental United States per Final_Business_Decisions):**

- Free shipping over **$39** on merchandise
- Free shipping on **all subscriptions**

**Do not use verbatim mockup copy:** “FREE SHIPPING ON ALL ORDERS IN THE CONTINENTAL U.S.” (conflicts with $39 merchandise threshold).

**Approved social-proof lines** (also usable in announcement rotation where appropriate):

- 100,000+ Orders Shipped
- Free Shipping Over $39
- Free Shipping on Every Subscription

Do not claim free shipping outside the continental United States.

Do **not** add “Ships from North Carolina” until explicitly approved.

---

## Footer and supporting navigation (Final_Business_Decisions)

May appear in footer or secondary nav (exact groupings not frozen for v1):

- FAQ
- Contact
- Shipping
- Policies

Link targets and legal copy live in Shopify admin / `12_Legal` when available.

---

## Not in primary navigation for v1

- Home (implicit via logo)
- FAQ (footer/supporting)
- Gift Boxes / Gifts (catalog may exist; **not** a required homepage section or top-level nav item for v1)

---

## Accessibility and UX (AI_RULES)

- Semantic `<nav>` and clear focus states
- Dropdown usable by keyboard and touch
- Do not rely on color alone for current page indication
