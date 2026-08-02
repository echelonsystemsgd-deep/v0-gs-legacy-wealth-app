# Updated Implementation Plan: Stickman Character Suite & 6-Service Overhaul

Overhaul the website to align **100% with your 6 core offerings** (**Web Design, Lead Capture, Bookings & Stripe Deposits, CRM, Email Automation, and WhatsApp Alerts via Make.com**), incorporating a full suite of **playful stickman character illustrations** (inspired by TRW character art) across the site.

---

## 🎨 Stickman Character Suite Assets

We have generated 4 stickman character illustrations saved directly to `public/`:

1. `public/stickman_speed_automation.png` — Speed Kart Automation
2. `public/stickman_baker_order.png` — Baker Order Smartphone Alert
3. `public/stickman_crm_autopilot.png` — CRM Autopilot Dashboard
4. `public/stickman_relax_saved_time.png` — Relaxing Saved Time & Revenue

---

## Proposed Component Integration

### 1. Hero Section ([hero.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/hero.tsx))
- Incorporate `public/stickman_speed_automation.png` as an interactive hero floating graphic alongside integration badges (`Web Design`, `Lead Capture`, `Bookings & Deposits`, `Supabase CRM`, `Email & WhatsApp Alerts`).

### 2. Stickman Interactive Workflow ([stickman-workflow.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/stickman-workflow.tsx))
- **Step 1 (Order Received)**: Displays `public/stickman_baker_order.png` showing customer 3-tap order entry.
- **Step 2 (Autopilot Sync)**: Displays `public/stickman_crm_autopilot.png` showing Make.com WhatsApp alert + Supabase CRM logging.
- **Step 3 (Saved Admin Time)**: Displays `public/stickman_relax_saved_time.png` showing owner relaxing while bookings & deposits flow in.

### 3. Real 3-Tap Interactive Simulator ([interactive-phone-demo.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/interactive-phone-demo.tsx))
- Real 3-step interactive order simulation:
  - Step 1: Pick cake size / service package.
  - Step 2: Pick date & deposit option.
  - Step 3: Click "Submit Test Order" to trigger a live WhatsApp notification popup with `[ Triggered via Make.com Webhook ]` telemetry!

### 4. ROI & Time Saved Calculator ([interactive-roi-calculator.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/interactive-roi-calculator.tsx))
- Enhanced slider widget featuring `public/stickman_relax_saved_time.png` calculating annual hours saved.

---

## Verification Plan

### Automated Verification
- Run `npm run build` to verify TypeScript types, Next.js build compilation, and page routing without any errors.

### Manual Verification
- Verify all 4 stickman images render cleanly and responsively across mobile, tablet, and desktop screens.
