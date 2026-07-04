-- Seed pricing tiers into website_content CMS table
-- This is set to DO UPDATE so that running migrations updates the values.

INSERT INTO public.website_content (section_key, content, updated_at)
VALUES (
  'pricing_setup_tiers',
  '[
    {
      "id": "authority-suite",
      "name": "Authority Suite",
      "price": "3,500",
      "interval": "£875 deposit to initiate",
      "milestoneBreakdown": "4 milestone stages of 25% (£875) linked to build progress",
      "description": "A luxury digital front-office that projects absolute authority. Engineered without templates to secure and convert elite clients.",
      "features": [
        "Bespoke Next.js Authority Platform (5 Pages)",
        "Autonomous Lead Capture & Calendly Setup",
        "Stripe Payment Gateway Integration",
        "Core SEO Blueprint & Schema Setup",
        "Supercharged Speed Profile (98+ Mobile)",
        "30 Days Dedicated Post-Launch Support"
      ],
      "cta": "Request Alignment",
      "featured": false,
      "tag": "Authority Suite"
    },
    {
      "id": "operations-machine",
      "name": "Operations Machine",
      "price": "5,800",
      "interval": "£1,450 deposit to initiate",
      "milestoneBreakdown": "4 milestone stages of 25% (£1,450) linked to build progress",
      "description": "Your complete digital systems layer. We replace manual administrative overhead with custom software leverage so your business runs on autopilot.",
      "features": [
        "Everything in Authority Suite (up to 10 Pages)",
        "Custom Relational Database Integration (Supabase)",
        "Autonomous Pipeline Routing & CRM Orchestration",
        "Custom Secure Client Portal Integration",
        "Automated Stripe Billing & Invoice Engine",
        "90 Days Dedicated Post-Launch Support"
      ],
      "cta": "Initiate Audit",
      "featured": true,
      "tag": "Operations Machine"
    },
    {
      "id": "revenue-engine",
      "name": "Revenue Engine",
      "price": "9,800",
      "interval": "£2,450 deposit to initiate",
      "milestoneBreakdown": "4 milestone stages of 25% (£2,450) linked to build progress",
      "description": "The ultimate growth and automation infrastructure. We build a high-performance brand platform, launch your automated cold email prospecting system, and engineer your AI lead triage.",
      "features": [
        "Everything in Operations Machine (Unlimited Pages)",
        "Autonomic Cold Outreach Infrastructure",
        "Custom-Trained AI Agent Concierge",
        "Full Corporate Brand Identity Suite",
        "Direct Slack Hotline to Principal Founders",
        "Weekly Systems Scaling Strategy Roadmaps"
      ],
      "cta": "Initiate Audit",
      "featured": false,
      "tag": "Revenue Engine"
    }
  ]'::jsonb,
  now()
)
ON CONFLICT (section_key) 
DO UPDATE SET 
  content = EXCLUDED.content,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.website_content (section_key, content, updated_at)
VALUES (
  'pricing_retainer_tiers',
  '[
    {
      "id": "authority-suite",
      "name": "Pilot Support",
      "price": "499",
      "interval": "billed monthly",
      "milestoneBreakdown": "",
      "description": "Continuous hosting, top-tier performance audits, and priority developer hours.",
      "features": [
        "Premium Dedicated Ultra-Fast CDN Hosting",
        "Weekly Security & Speed Audits",
        "3 Hours Design & Copywriting Updates/mo",
        "Monthly Traffic & SEO Analytics Report",
        "24/7 Critical System Monitoring",
        "Same-Day Urgent Edits Turnaround"
      ],
      "cta": "Request Alignment",
      "featured": false,
      "tag": "Authority Suite"
    },
    {
      "id": "operations-machine",
      "name": "Co-Pilot Growth",
      "price": "1,450",
      "interval": "billed monthly",
      "milestoneBreakdown": "",
      "description": "Custom scaling campaigns, search engine dominance, and continuous autonomic AI system tuning.",
      "features": [
        "Everything in Pilot Support",
        "Continuous AI Agent Re-training & Updates",
        "1 Custom High-Converting Landing Page/mo",
        "Advanced SEO Content & Competitor Strategy",
        "Weekly Lead Funnel Optimisation",
        "10 Dedicated Developer/Designer Hours/mo"
      ],
      "cta": "Initiate Audit",
      "featured": true,
      "tag": "Operations Machine"
    },
    {
      "id": "revenue-engine",
      "name": "Enterprise Autonomic Partner",
      "price": "2,950",
      "interval": "billed monthly",
      "milestoneBreakdown": "",
      "description": "Your complete external fractional Chief Technology & Marketing Team.",
      "features": [
        "Everything in Co-Pilot Growth",
        "Weekly High-Level Growth Consulting Call",
        "Unlimited Minor System & UI Adjustments",
        "New AI Workflow Builds & Automations",
        "Bespoke Cold Email/Marketing System setups",
        "Direct Slack Hotline to Core Founders"
      ],
      "cta": "Initiate Audit",
      "featured": false,
      "tag": "Revenue Engine"
    }
  ]'::jsonb,
  now()
)
ON CONFLICT (section_key) 
DO UPDATE SET 
  content = EXCLUDED.content,
  updated_at = EXCLUDED.updated_at;
