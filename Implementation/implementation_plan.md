# Implementation Plan - Interactive Audit & Fixes

Comprehensive audit of all clickable elements across the entire website and resolution of identified link and copy inconsistencies.

## Audit Summary & Approved Fixes

The exhaustive audit of 73 interactive elements identified 3 minor link/copy inconsistencies across the codebase, all approved for implementation:

### 1. [HIGH] Announcement Bar Target (`components/announcement-bar.tsx`)
- **Issue**: Announcement bar link currently routes to `/#demo`.
- **Fix**: Update `href="/#demo"` to `href="/local"`.

### 2. [HIGH] Footer Social Media Links (`components/footer.tsx`)
- **Issue**: Default social links point to generic domains (`https://instagram.com`, `https://linkedin.com`).
- **Fix**: Update `instagramLink` to `"https://instagram.com/mercianwealth"` and `linkedinLink` to `"https://www.linkedin.com/company/mercianwealth"`.

### 3. [LOW] Footer CTA Button Text (`components/footer.tsx`)
- **Issue**: Default button text reads `"Book 15-Min Quick Audit"`.
- **Fix**: Update `ctaButtonText` to `"Book your free 15 minute audit"`.

---

## Proposed File Modifications

#### [MODIFY] [announcement-bar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/announcement-bar.tsx)
- Update `href="/#demo"` -> `href="/local"`.

#### [MODIFY] [footer.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/footer.tsx)
- Update default `instagramLink` -> `"https://instagram.com/mercianwealth"`.
- Update default `linkedinLink` -> `"https://www.linkedin.com/company/mercianwealth"`.
- Update default `ctaButtonText` -> `"Book your free 15 minute audit"`.

---

## Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` to verify 0 compilation errors across all components.

### Manual Verification
1. Click announcement bar -> verify navigation to `/local`.
2. Click footer Instagram icon -> verify opens `https://instagram.com/mercianwealth` in new tab.
3. Click footer LinkedIn icon -> verify opens `https://www.linkedin.com/company/mercianwealth` in new tab.
4. Verify footer CTA button text reads `"Book your free 15 minute audit"`.

---

## Completion Note: All 3 Audit Fixes Executed (Zero Errors)

- **Completed**: Applied all 3 approved audit fixes across `components/announcement-bar.tsx` and `components/footer.tsx`.
- **Announcement Bar Link**: Updated `href` from `/#demo` to `/local`.
- **Footer Social Links**: Updated fallback links to `https://instagram.com/mercianwealth` and `https://www.linkedin.com/company/mercianwealth`.
- **Footer CTA Text**: Standardized default CTA button text to `"Book your free 15 minute audit"`.
- **Typecheck Verified**: `npx tsc --noEmit` returned **0 compilation errors**.
- **GitHub Commit**: Staged, committed, and pushed changes to `main`.
