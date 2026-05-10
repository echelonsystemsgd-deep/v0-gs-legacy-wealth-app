# Multi-Page Architecture Implementation Plan

## Overview
Transitioning from a single-page scroll layout to a multi-page architecture is an excellent strategy for a luxury AI web agency. It elevates the brand by providing a more curated, "pacing" experience, improves SEO capabilities, and allows for deeper content exploration without overwhelming the user on the home page.

## The Strategy: The "Teaser" Landing Page
The Home page will act as a high-impact executive summary. It will feature the best elements of the agency and naturally guide users to dedicated pages for more depth.

### Proposed Page Structure

#### 1. Home (`/`)
- **Hero**: High-impact value proposition and primary CTA.
- **Featured Services**: A sleek overview of the 3-4 main offerings with a "View All Services" button leading to `/services`.
- **Featured Case Study / Portfolio**: Highlight the single best piece of work, linking to `/portfolio`.
- **Process Snippet**: A brief 3-step timeline linking to `/process`.
- **Testimonials Showcase**: 2-3 elite testimonials.
- **Sticky CTA / Footer CTA**: "Ready to elevate your brand? Start the conversation."

#### 2. Services (`/services`)
- In-depth breakdown of all services (e.g., AI Automation, Luxury Web Design, Next.js Development).
- Detailed deliverables for each service.
- Micro-animations for each service card.

#### 3. Portfolio (`/portfolio` or `/work`)
- Grid or masonry layout of previous projects.
- Individual case study potential (e.g., `/portfolio/luxury-real-estate`) showing ROI, before/after, and design assets.

#### 4. Process (`/process` or `/how-we-work`)
- Detailed step-by-step engagement model (e.g., 1. Discovery, 2. Strategy, 3. Execution, 4. Handover).
- Addresses client objections and builds massive trust.

#### 5. Pricing / Investment (`/pricing`)
- Detailed tier breakdowns.
- ROI calculators or transparent starting prices to qualify leads.

## Implementation Steps

### Phase 1: Structural Setup & Routing
1. **Create New Page Directories**:
   - `app/services/page.tsx`
   - `app/portfolio/page.tsx`
   - `app/process/page.tsx`
   - `app/pricing/page.tsx`
2. **Update Navbar**: 
   - Refactor `components/navbar.tsx` to use Next.js `<Link>` components routing to the new paths instead of anchor tags (`#services`).
   - Ensure the mobile menu also reflects these new routes.

### Phase 2: Refactoring Components
1. **Component Duplication / Refinement**:
   - Modify existing components like `Services` to have a `limit` prop (e.g., `<Services limit={3} />`) for the home page, while the dedicated `/services` page renders the full list.
   - Alternatively, create distinct "Preview" components (e.g., `ServicesPreview`) for the home page.
2. **Update Home Page (`app/page.tsx`)**:
   - Adjust the layout to incorporate the new "Preview" versions of sections.
   - Add clear CTA buttons under each preview section ("See Our Work", "Explore Our Services").

### Phase 3: Page Construction
1. **Build `Services` Page**: Import the full `Services` component. Add a unique page header/hero.
2. **Build `Portfolio` Page**: Import the full `Portfolio` component. Add a unique page header/hero.
3. **Build `Process` Page**: Import the full `Process` component. Add a unique page header/hero.
4. **Build `Pricing` Page**: Import the full `Pricing` component. Add FAQ section specifically tailored to pricing.

### Phase 4: SEO and Polish
1. **Meta Tags**: Add unique `<title>` and `<meta name="description">` to each new page.
2. **Animations**: Ensure Framer Motion/GSAP animations trigger correctly on page load for the new routes.
3. **Testing**: Verify all internal links, mobile navigation, and overall page flow.

## Next Steps
Awaiting approval on this structure. Once confirmed, we can begin Phase 1 immediately by setting up the new routes and updating the navigation.
