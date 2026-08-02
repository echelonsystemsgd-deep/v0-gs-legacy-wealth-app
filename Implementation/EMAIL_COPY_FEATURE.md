# 1-Click Email Copy & Contact UX Enhancement

## Overview
To maximize conversion and eliminate browser tab issues caused by `mailto:` links, this feature provides users with two seamless choices:
1. **Submit an Inbound Enquiry Form** (Primary: direct database lead capture + instant Gmail & n8n notifications)
2. **1-Click Copy Email to Clipboard** (Secondary: copies `mercianwealthgs@gmail.com` to clipboard with visual checkmark confirmation)

## Architecture & Components
- **`components/copy-email-button.tsx`**: Reusable interactive client component with animated feedback state (`Copied!` tooltip/badge).
- Integrated across:
  - Footer Contact Column (`components/footer.tsx`)
  - Contact Page (`app/contact/page.tsx`)
