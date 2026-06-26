# Implementation Plan - Discord-Inspired Dashboard Redesign

This plan outlines the technical changes required to convert the **User (Prospect)**, **Client (Partner)**, and **Admin (Operations)** dashboards into a unified, Discord-inspired multi-tier layout styled in the **GS Legacy Wealth** luxury dark aesthetic.

---

## Proposed Changes

We will introduce a global Portal Hub switcher, refactor the sidebars of all three dashboards to support channel-style groupings, update the page layouts to host the new columns, and add custom micro-animations.

### 1. New Global Components

#### [NEW] [portal-hub.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/dashboard/portal-hub.tsx)
- The leftmost narrow column (Zone 1, 72px width).
- Displays a vertical stack of squircle/circle icons:
  - **Home**: Link to the public website (`/`).
  - **Vetting Terminal (User)**: Link to `/dashboard`.
  - **Sovereign Partner Console (Client)**: Link to `/client`.
  - **Operations & Infrastructure Terminal (Admin)**: Link to `/admin` (only shown if user has `role === 'admin'`).
  - **Profile Avatar Settings**: Bottom-anchored link.
- Fetches the user's role client-side (via Supabase client) to control the visibility of the Admin portal button dynamically.

#### [NEW] [inspector-panel.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/dashboard/inspector-panel.tsx)
- A sliding drawer panel for the right-hand side (Zone 4, 280px width) controlled by a toggle button in the header.
- Displays context-dependent information:
  - **Admin**: Selected lead answers, pricing tier selections, and audit logs.
  - **Client**: Assigned project lead profile, active tier parameters, and quick session links.

---

### 2. Layout Grid Updates

#### [MODIFY] [layout.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/(admin)/layout.tsx)
#### [MODIFY] [layout.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/(client)/layout.tsx)
#### [MODIFY] [layout.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/(user)/dashboard/layout.tsx)
- Restructure the layouts to wrap pages in the multi-tier columns:
  ```html
  <div className="flex min-h-screen bg-[#050505] text-foreground">
    <!-- Zone 1: Switcher -->
    <PortalHub />
    
    <!-- Zone 2: Navigation -->
    <Sidebar className="w-60 shrink-0 border-r border-gold/10 bg-[#0D0D0D]" />
    
    <!-- Zone 3: Main Page + Zone 4 Panel -->
    <div className="flex-1 flex flex-col min-w-0">
      <Header className="sticky top-0 z-20 h-14 border-b border-gold/10 bg-background/80 backdrop-blur-md" />
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </main>
        <InspectorPanel />
      </div>
    </div>
  </div>
  ```

---

### 3. Refactoring Sidebar Components

#### [MODIFY] [sidebar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/admin/sidebar.tsx)
- Retain the original flat-list structure, premium Lucide icons, and title-cased labels (e.g., "Dashboard", "Qualified Prospects", "Clinical Evaluations", "Active Partners", "Deployments").
- Clean obsidian-black style with subtle gold highlights for active items.
- Remove collapsible folders and lowercase channel-style formatting.

#### [MODIFY] [sidebar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/sidebar.tsx)
- Retain the original flat-list structure with premium Lucide icons and proper title-cased labels (e.g., "Overview", "Project Progress", "My Website", "Messages").
- Ensure a consistent professional aesthetic matching the brand design.

#### [MODIFY] [sidebar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/dashboard/sidebar.tsx) (User Sidebar)
- Retain the original clean list of user dashboard links (e.g., "Dashboard", "Book a Session", "My Bookings", "Notifications", "Profile Settings") with standard Lucide icons and proper typography.


---

### 4. Styling & Micro-Animations

#### [MODIFY] [globals.css](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/globals.css)
- Add utility styling classes:
  - `.discord-scroll`: Hidden or ultra-thin scrollbar indicators.
  - `.portal-icon`: Handles transition from circle to rounded squircle on hover.
  - `.channel-link-active`: Left vertical gold highlight notch indicator.
  - Thin gold dividers (`from-gold/20 via-gold/5 to-transparent`).

---

### 5. Alignment with Machiavellian Repositioning Plan
To enforce the tone of commanding authority and gatekeeping:
1. **Terminology Rules**:
   - Swapped soft terms like "Prospects", "Leads", "User settings" for "Vetting Stage", "Qualified Prospects", "Console parameters".
   - Group titles are capitalized but clean (e.g., `PARTNER PIPELINE`, `DEPLOYMENT TELEMETRY`).
2. **Posturing of Scarcity**:
   - The user/client calendars and settings represent bookings as **Clinical Evaluations** with *strictly limited allocation* messages in empty states.
3. **Visual Dignity**:
   - Clean, obsidian black backgrounds with thin gold border lines. No busy widgets or floating badges that look desperate for clicks.

---

## Verification Plan

### Automated Verification
- Run `npm run build` to confirm compilation matches all TypeScript types and next layouts.

### Manual Verification
1. **Dynamic switcher visibility**: Log in as a regular client. Verify the "Admin Operations" hub icon is hidden. Log in as an admin and verify it appears.
2. **Accordion fold-out**: Open different folders in sidebars, collapse them, and verify selection states.
3. **Responsive behaviors**: Shrink browser to tablet and mobile viewports. Ensure Zone 1 and Zone 2 merge into a collapsible hamburger drawer.
