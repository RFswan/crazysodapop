# CRAZY SODA POP

## AI AND DEVELOPMENT RULES

All AI tools, developers, designers, and contractors working on Crazy Soda Pop must follow these rules.

## Source of Truth

**`00_Master/Final_Business_Decisions.md` overrides all other documents and approved visuals.**

Before making changes, read (in order):

1. `00_Master/Final_Business_Decisions.md`
2. `00_Master/SOURCE_OF_TRUTH.md`
3. `00_Master/AI_RULES.md` (this file)
4. `01_Brand/Brand_Bible.md`
5. `05_Website/Homepage_Blueprint.md`
6. `05_Website/Homepage_Specification.md`
7. `05_Website/Navigation.md`
8. `06_Shopify_Theme/Theme_Specification.md`

Do not invent missing brand decisions, pricing, ratings, reviews, products, collection handles, logo text, or apps.

If required information is missing, stop and identify the missing decision.

## Brand Architecture

**Parent brand and website:** Crazy Soda Pop

**Flagship subscription program:** The Soda Discovery Club

Do **not** use **“The Soda Discovery Co.”** as the subscription name.

The Soda Discovery Club is not the name of the entire website.

Crazy Soda Pop is not exclusively a subscription company.

The website must also support:

- Individual soda purchases
- 6-packs and 12-packs
- Curated packs
- Build a Pack
- Candy
- Gifts (catalog; not a required dedicated “Gift Boxes” homepage section for v1)
- Seasonal collections and limited releases (future)
- Future international soda collections

## Customer

Primary subscription audience:

- Age 35 to 65
- Interested in nostalgia, discovery, gifting and family experiences
- Values quality, trust and authenticity

The design must not feel childish or targeted primarily at teenagers.

## Visual Direction

Use values from `01_Brand/Brand_Bible.md` and approved visual assets.

Do not use:

- Neon colors
- Cheap gradients
- Cartoon mascots
- Fake vintage establishment dates
- “EST. 2026”
- Generic stock photography
- Overly distressed fonts
- AI-looking product labels
- Excessive animation
- Dark aggressive sales design

## Logo Rule

Logo artwork is **provisional**. Production logo wording is **not finalized**.

Do not permanently embed logo text or artwork into layouts.

Logo areas must accept **editable Shopify image settings** only.

Do not use “EST. 2026.”

Do not treat ribbon or subline text in reference PNGs as final subscription naming.

## Copy Rules

Voice should be:

- Warm
- Curious
- Knowledgeable
- Friendly
- Nostalgic without pretending the company is old
- Premium without sounding formal

Avoid:

- Spammy urgency
- Fake scarcity
- Excessive exclamation marks
- Empty phrases such as “best ever”
- Claims that cannot be supported
- Childish candy-shop language
- **Star ratings or numeric review scores** until verified from an approved source
- **“Ships from North Carolina”** or similar origin claims until explicitly approved

## Ecommerce Rules

The homepage must make both shopping paths obvious:

1. Shop specialty sodas
2. Join The Soda Discovery Club

The subscription must be prominent but must not dominate the entire homepage.

**Primary navigation (Homepage v1 — frozen):**

- Shop Soda  
  - Single Bottles  
  - 6 Packs  
  - 12 Packs  
- Soda Discovery Club  
- Build a Pack  
- Candy  
- About Us  

FAQ, Contact, Shipping, and Policies may appear in the footer or supporting navigation.

**Reviews section:** Title **What Customers Say About Crazy Soda Pop**. Content **empty** until approved marketplace reviews are supplied. Do not fabricate testimonials.

## Shopify Development Rules

Build with Shopify Liquid, JSON templates, CSS and lightweight JavaScript.

Every homepage feature must be an editable Shopify section.

Every section must include a valid schema and preset when appropriate.

Do not hardcode:

- Headlines
- Buttons
- Images
- Product handles
- Collection handles
- Colors
- Spacing that should be theme settings
- Logo text

Use reusable snippets for repeated interface elements.

Mobile layouts are not optional.

Build mobile and desktop together.

## Performance Rules

- Avoid unnecessary libraries.
- Avoid autoplay video.
- Lazy-load below-the-fold images.
- Use responsive image sizes.
- Keep JavaScript small.
- Do not add decorative effects that noticeably slow the store.

## Accessibility Rules

- Maintain readable contrast.
- Use semantic headings.
- Include visible focus states.
- Include meaningful alt text.
- Buttons must be actual buttons or links.
- Do not rely on color alone to communicate meaning.

## Homepage Goal

The visitor should understand within five seconds:

- Crazy Soda Pop sells specialty sodas.
- Customers can shop without subscribing.
- The Soda Discovery Club delivers curated sodas.
- Both 6-bottle and 12-bottle subscriptions are available.
- Candy, packs, and gifts are also available.

## Decision Hierarchy

When **business** choices conflict, **`Final_Business_Decisions.md` wins** (see `SOURCE_OF_TRUTH.md`).

When **design tradeoffs** remain within approved rules, prioritize:

1. Clarity
2. Trust
3. Conversion
4. Brand consistency
5. Performance
6. Decorative creativity
