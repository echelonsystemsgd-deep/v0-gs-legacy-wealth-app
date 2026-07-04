# Sovereign Tech Lab Rebranding Implementation Plan

This plan outlines the visual updates to refine `gslegacywealth.com` into a **"Sovereign Tech Lab"** aesthetic. We will preserve the high-contrast dark layout (black background) that provides prestige and depth, but shift the style towards a cutting-edge systems engineering laboratory.

---

## 1. Visual Theme Updates (CSS Variables)

We will modify `app/globals.css` to increase the ratio of Royal Purple accents and transition standard card borders from traditional gold to technical slate-purple:

*   **Glowing Amethyst:** Set `--color-accent-purple` to a more vibrant neon amethyst (`#8B5CF6`) for razor-sharp tech visibility in dark mode.
*   **System Borders:** Change `--color-border` from traditional gold (`#8B6914`) to a deep slate-purple (`rgba(139, 92, 246, 0.20)`). This ensures standard card containers are framed in technical purple rather than gold.
*   **Prestige Accents:** Retain `--color-accent-gold` (`#C9A227`) strictly for the primary logo, checkmarks, and the success states to represent royal gold quality.

---

## 2. Typography & Label Overhaul (Sovereign Tech Style)

To transition from a "financial advisory" feel to a "systems laboratory," we will replace standard gold serif uppercase labels with monospaced purple labels enclosed in technical brackets (`[ Label ]`):

### A. Hero Section (`components/hero.tsx`)
*   Change eyebrow text style:
    *   *Current:* `<span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">`
    *   *Proposed:* `<span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent-purple">[ {data.eyebrow} ]</span>`

### B. The Bottleneck Section (`components/bottleneck.tsx`)
*   Change eyebrow text style:
    *   *Current:* `<span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">`
    *   *Proposed:* `<span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent-purple">[ Operational Friction ]</span>`

### C. Differentiator Section (`components/why-gs-legacy.tsx`)
*   Change headers of comparison tables:
    *   *Standard Agency:* Change to `<span className="font-mono text-[9px] font-bold uppercase tracking-wider text-red-400">[ Standard Agency Model ]</span>`
    *   *GS Legacy:* Change to `<span className="font-mono text-[9px] font-bold uppercase tracking-wider text-accent-purple">[ Autonomic Systems Lab ]</span>`

### D. FAQ Section (`components/faq-home.tsx`)
*   Change eyebrow text style:
    *   *Current:* `<span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">`
    *   *Proposed:* `<span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent-purple">[ {data.eyebrow} ]</span>`

---

## 3. Auditing & Compilation Verification

1.  Run local Next.js build to confirm no syntax or TypeScript warnings are present.
2.  Perform a browser visual audit to verify elements render with high-contrast readability and look correct on desktop and mobile resolutions.
