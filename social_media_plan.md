# Add Social Media Handles

## Goal Description

Add LinkedIn and Instagram social media handles to the website, providing users with quick access to the company's social profiles. The handles should be displayed prominently, match the site's visual style, be responsive, accessible, and SEO‑friendly.

## User Review Required

> [!IMPORTANT] Choose the placement for the social media icons.
>
> - **Header** – visible on all pages, integrates with primary navigation.
> - **Footer** – traditional location, less visual prominence.
> - **Both Header and Footer** – maximum visibility.
>
> Please let us know your preferred location (or any other location you have in mind).

## Open Questions

> [!WARNING] Clarify icon style preferences.
>
> - Should we use brand‑official icons, custom‑styled icons, or simple text links?
> - Do you have existing SVG assets, or should we source them from a public icon library (e.g., Font Awesome, Simple Icons)?
>
> Also confirm whether the icons should adopt the site's color scheme or retain their brand colors.

## Proposed Changes

---
### Component: Social Media UI

- **[NEW] `src/components/SocialMediaLinks.jsx`** – component rendering clickable icons for LinkedIn and Instagram.
- **[NEW] `src/assets/social/`** – directory for SVG/icon assets.
- **[MODIFY] Existing layout files** (e.g., `Header.jsx` and/or `Footer.jsx`) to import and include the new component at the chosen location.

### Styling

- **[MODIFY] `src/styles/_socialMedia.scss`** (or equivalent) – styles for icon size, hover effects, responsive behavior, and dark‑mode support.
- Add CSS variables for brand colors if using custom styling.

### Configuration

- **[NEW] `src/config/socialLinks.js`** – central config containing URLs for LinkedIn and Instagram.

### Accessibility & SEO

- Ensure each link has `aria-label` describing the platform.
- Use `rel="noopener noreferrer"` and `target="_blank"` for external links.
- Add `link[rel=me]` tags in the HTML `<head>` for verification if desired.

### Testing

- Unit tests for the `SocialMediaLinks` component (e.g., using Jest/React Testing Library) to verify correct rendering and link URLs.
- Visual regression snapshots for both light and dark themes.

### Documentation

- Update README or project docs with a section on "Social Media Links" detailing how to modify URLs or replace icons.

### Deployment Steps

1. Add icons/assets to `src/assets/social/`.
2. Implement `SocialMediaLinks` component.
3. Integrate component into the chosen layout (header/footer).
4. Run unit and visual tests.
5. Perform manual QA on multiple viewports and browsers.
6. Merge changes via PR and deploy.

## Verification Plan

### Automated Tests
- Run `npm test` to ensure component tests pass.
- Execute `npm run lint` to verify code style.

### Manual Verification
- Inspect the site on desktop and mobile to confirm icons appear correctly and are clickable.
- Verify that the links open in a new tab and direct to the correct profiles.
- Check hover states and dark‑mode rendering.
---
