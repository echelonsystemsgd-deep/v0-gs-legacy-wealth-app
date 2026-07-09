/**
 * lib/site-copy.ts
 *
 * Centralized Copy Registry for mercianwealth.com
 *
 * Contains all copywriting for the homepage and secondary pages.
 * By updating text here, the changes propagate site-wide.
 *
 * Tone: Surgical, Restrained, Dominant.
 * Scope: National (UK Real Estate Agencies) without specific local geographic references.
 * Opening (Hero & Commodity Trap): Real Estate Agency pain points (lost listings, cold deals, slow response).
 * Body (Services, Process, Pricing, FAQ, etc.): Broad high-ticket, high-margin operators.
 */

export const SITE_COPY = {
  // Global Meta Info
  metadata: {
    layout: {
      defaultTitle: "Mercian Wealth | Luxury AI-Powered Websites",
      titleTemplate: "%s | Mercian Wealth",
      description: "Custom digital systems and autonomic AI architectures engineered to secure category dominance for market leaders. Vetted partnerships only."
    },
    home: {
      title: "Mercian Wealth | Bespoke Digital Infrastructure & Autonomic Systems",
      description: "Custom digital systems and autonomic AI architectures engineered to secure category dominance for market leaders. Vetted partnerships only.",
    },
    services: {
      title: "Our Services | Mercian Wealth",
      description: "Forensic audits, bespoke authority platforms, and automated lead conduits. View our clinical execution protocol.",
    },
    process: {
      title: "Our Process | Mercian Wealth",
      description: "Forensic audits, bespoke authority platforms, and automated lead conduits. View our clinical execution protocol.",
    },
    portfolio: {
      title: "Deployed System Registry | Mercian Wealth",
      description: "A registry of high-yield digital assets and automated operations engineered to command market authority.",
    },
    pricing: {
      title: "Capital Allocations | Mercian Wealth",
      description: "Transparent capital requirements for high-yield digital assets. Choose Authority Suite, Operations Machine, or Revenue Engine alignment.",
    },
    testimonials: {
      title: "Client Testimonials | Mercian Wealth",
      description: "Real results from ambitious businesses we have partnered with. Hear directly from our elite clientele about the impact of our premium digital solutions.",
    },
    contact: {
      title: "Concierge Assessment | Mercian Wealth",
      description: "Connect with Mercian Wealth. Let's discuss your brand, AI automation requirements, and premium web systems.",
    },
    book: {
      title: "Request Alignment Session | Mercian Wealth",
      description: "Complete the qualification criteria to request a clinical evaluation session. Strictly limited allocations — vetted partnerships only.",
    },
  },

  // Navbar Component
  navbar: {
    logo: "Mercian Wealth",
    links: [
      { label: "Services", href: "/services" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Process", href: "/process" },
      { label: "Pricing", href: "/pricing" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Contact", href: "/contact" },
    ],
    ctaText: "Request Alignment",
    ctaHref: "/book",
  },

  // Homepage Sections
  homepage: {
    // 1. Hero Section (UK Real Estate Agency Voice - National Scope)
    hero: {
      eyebrow: "Bespoke Digital Infrastructure & Autonomic Systems",
      headline: "We Build Digital Systems for Category-Dominant UK Agencies & High-Ticket Operators. The Rest Chase Them.",
      subheadline: "We do not build generic templates or standard websites. We engineer high-performance visual platforms and automated pipelines for UK operators and agencies who refuse to lose another instruction, listing, or high-value client to operational drag. Selectively aligned. Flawlessly executed.",
      primaryCtaText: "Request System Integration Audit",
      secondaryCtaText: "Deployed System Registry",
      trustItems: [
        "10+ Bespoke Deployments",
        "Autonomic Orchestrations",
        "Fluid Mobile Architecture",
        "Guaranteed Throughput",
      ],
      unsureText: "Unsure of your requirements? Review our Execution Protocol →",
    },

    // 2. Deficit Diagnostic (Speed Visualizer / Telemetry - UK Real Estate Agency Voice)
    bottleneck: {
      eyebrow: "Operational Friction",
      headline: "Your agency is leaking instructions. Stop paying the manual tax.",
      subheadline: "Relying on manual lead routing, delayed response times, and disconnected databases is operational negligence. For every day your system remains un-automated, your listing acquisition cost quietly compounds.",
      goldSlogan: "Speed is the ultimate unfair advantage. While you wait to automate, your competitors are buying speed. They aren't smarter; they simply have more leverage.",
      systemMode: "System Mode: ",
      modeAutomated: "Automated & Connected",
      modeManual: "Manual Chaos",
      triggerBtnActive: "Deactivate AI Hub",
      triggerBtnInactive: "Activate AI Hub",
      diagnosticLink: "Quantify Your System Deficit →",
      
      cards: [
        {
          title: "Deals Going Cold",
          description: "Every minute a high-value buyer or vendor lead sits unqualified in your inbox is a decay in conversion probability. We automate immediate, high-context engagement to capture intent before it cools.",
        },
        {
          title: "Wasted Agency Hours",
          description: "Your agents lose hours copying lead forms to CRMs instead of pitching properties. We build direct pipelines from capture to CRM, eliminating repetitive entry.",
        },
        {
          title: "Manual Follow-Up Failure",
          description: "Warm vendor inquiries slip through the cracks of a busy inbox. We engineer automated follow-up sequences that run indefinitely, securing your pipeline.",
        },
      ],
    },

    // 3. Commodity Trap (Market Indictment - UK Real Estate Agency Voice)
    commodityTrap: {
      eyebrow: "The Commodity Trap",
      headline: "The Hidden Cost of the \"Free\" Web Builder Illusion.",
      description: "The high-ticket B2B and agency markets are saturated with platforms promising free websites, cheap templates, and easy setups. Operators opt in, only to discover quiet compounding costs: high-value client leads dropping off due to 10-second page speeds, outdated database listings, and siloed software that requires constant manual copying. They sell you basic tools. They do not sell you outcomes. They disappear after the transaction. Mercian Wealth does not sell tools. We build high-performance digital estates and take full ownership of their operational output.",
    },

    // 4. Mercian Wealth Difference (Broadened to all High-Ticket/High-Margin Operators)
    whyMercianWealth: {
      headline: "Engineered for Leverage. Built for Prestige.",
      description: "We focus on premium, custom digital assets tailored specifically for businesses ready to dominate their space. By combining luxury visual storytelling with AI automation, we ensure your online presence acts as a 24/7 revenue-generating asset rather than a static brochure.",
      differentiators: [
        "Bespoke visual identity aligned with category dominance.",
        "Autonomous AI systems, never boilerplate templates.",
        "Rapid execution paths designed to eliminate deployment lag.",
        "Data-backed conversion architecture on every component.",
        "Dedicated optimization retention to preserve system throughput.",
      ],
      structuralRealityHeadline: "The Structural Reality",
      standardAgency: {
        title: "Standard Agency Model",
        items: [
          "Boilerplate templates and generic layout setups.",
          "Delayed deployment paths taking 2 to 3 months.",
          "Disconnected lead qualifiers and manual CRM copying.",
          "Ongoing hourly overhead without performance guarantees.",
        ],
      },
      mercianWealth: {
        title: "Autonomic Systems Lab",
        items: [
          "Bespoke authority platforms built from the ground up.",
          "Rapid execution protocol delivering assets in under 28 days.",
          "Autonomous capture funnels with direct CRM data pipelines.",
          "Clear capital investment aligned with guaranteed throughput.",
        ],
      },
    },

    // 5. Trend Adaptation Statement (Broadened)
    trendAdaptation: {
      eyebrow: "Continuous Telemetry",
      headline: "Our Systems Evolve While Your Competitors Stagnate.",
      description: "We monitor market trends, security updates, and performance telemetry continuously, rebuilding and optimizing your systems in the background. Your digital infrastructure remains permanently state-of-the-art without your team lifting a finger. It is an unfair advantage you cannot afford to operate without.",
    },

    // 6. Model Hint (Broadened)
    modelHint: {
      eyebrow: "Incentives Aligned",
      headline: "We Do Not Charge Like Traditional Agencies.",
      description: "Traditional agencies charge flat hourly rates for design revisions and busywork. Our model aligns directly with your operational leverage and growth. Specific infrastructure investment and partnership alignment parameters are discussed exclusively during the clinical audit. We only build systems we can win with.",
    },

    // 7. Exclusivity Lock (Broadened)
    exclusivityLock: {
      eyebrow: "Selective Vetting",
      headline: "We Do Not Partner With Everyone.",
      description: "To preserve absolute founder-level code quality and execution speed, we limit new client intake to exactly 2 integrations per cohort. We assess fit before we commit. Requesting an audit is an application, not a sales call. If there is mutual alignment, we initiate the build.",
    },

    // 8. Outcome Telemetry (Testimonials / Social Proof - Broadened)
    testimonials: {
      eyebrow: "Testimonials",
      headline: "Trusted by Ambitious Teams",
      guarantee: "100% successful integration rate across all audited clients",
      transformationHeadline: "The Transformation Telemetry",
      transformations: [
        {
          beforeLabel: "Before Integration",
          beforeText: "Leads sitting unqualified in emails for 12-24 hours. Deal probability decays by 40%.",
          afterLabel: "After Integration",
          afterText: "Immediate AI-concierge qualification and Calendly routing in 45 seconds. Uptime captured.",
        },
        {
          beforeLabel: "Before Integration",
          beforeText: "Sales reps wasting 10-15 hours/week copying form data into CRM dashboards.",
          afterLabel: "After Integration",
          afterText: "Direct webhook routes from capture to CRM system. 100% administrative drag eliminated.",
        },
        {
          beforeLabel: "Before Integration",
          beforeText: "Leads forgotten after initial contact. Evaporated pipeline value.",
          afterLabel: "After Integration",
          afterText: "Autonomic lead-nurturing sequences running 24/7/365. Persistent retention.",
        },
      ],
      list: [
        {
          name: "James Carter",
          role: "Bespoke Portfolio Director",
          badge: "97% FRICTION REDUCTION",
          content: "Mercian Wealth completely transformed our web operations. What used to take 3 days of manual follow-up now happens in under 45 seconds. The system reclaimed its implementation cost within the first cohort launch.",
        },
        {
          name: "Sophie Bennett",
          role: "Acquisitions Consultant",
          badge: "30+ HRS/WK RECLAIMED",
          content: "We were skeptical about AI integration, but the telemetry proved us wrong. Our property consultants recovered 30+ hours per week, and response speed dropped to under 1 minute, preventing lead drop-off.",
        },
        {
          name: "Daniel Hayes",
          role: "Boutique Fund Manager",
          badge: "24/7 AUTONOMIC CAPTURE",
          content: "The autonomous lead routing qualifiers work flawlessly around the clock. We secured 3 high-ticket client instructions while our principal directors were out of the office.",
        },
      ],
    },

    // 9. FOMO Close & CTA Section
    cta: {
      headline: "Ready to Assert Market Control?",
      subheadline: "We operate under tight bandwidth restrictions to maintain system quality. We only partner with enterprises prepared for absolute alignment. Currently accepting only 2 new integration partnerships this month (Cohort capacity at 80%).",
      buttonText: "Initiate Operational Audit",
    },

    // 10. FAQ Section
    faq: {
      eyebrow: "FAQ",
      headline: "System FAQs",
      description: "Everything you need to know about our custom build models, timelines, and integration pipeline.",
      faqs: [
        {
          question: "How do custom AI automations actually save my business time?",
          answer: "We replace manual repetitive workflows (like copying data from lead forms to CRMs, scheduling calls, drafting standard emails, or formatting customer reports) with fully automated pipelines. When a prospect submits a form, an AI qualifies them, syncs their profile to your CRM, books the call, and alerts your team via Slack—all in under a second. This typically reclaims 20 to 40 hours of admin time per week.",
        },
        {
          question: "What is the timeline for a custom platform and system build?",
          answer: "A custom high-performance authority platform with core CRM integrations and automated lead routing is fully built, tested, and launched within 28 days under our strict Execution Protocol. High-ticket custom multi-system architectures under the Enterprise tier may require up to 6 weeks.",
        },
        {
          question: "Are your pricing tiers one-time setups or recurring contracts?",
          answer: "Our core builds are structured as one-time setup capital allocations. You own 100% of the completed custom code, assets, and website layout upon sign-off. We also offer optional Monthly Growth Retainers for brands that want continuous SEO, priority design iterations, and regular AI model fine-tuning.",
        },
        {
          question: "Will the custom website and dashboard run fast on mobile?",
          answer: "Yes, absolutely. We prioritize high-speed architecture, responsive fluid layouts, and server-side optimization to guarantee a Mobile Speed Score of 90+ on Google PageSpeed Insights. Your clients will experience instant loading times on any screen size.",
        },
        {
          question: "Do you build custom integrations for existing platforms?",
          answer: "Yes. We seamlessly connect your custom website and AI agents with existing CRM, calendar, and email software—including Salesforce, HubSpot, ActiveCampaign, Slack, Google Workspace, and Calendly. We construct custom webhooks to ensure flawless cross-platform data flow.",
        },
      ],
    },
  },

  // 4. Services Page Copy (`/services`)
  servicesPage: {
    headerTitle: "Our Premium",
    headerHighlight: "Solutions",
    headerSubtitle: "Strategic AI-powered services engineered to create authority, automate growth, and generate elite revenue.",
    objectionCallout: "Standard development cycles take 3 to 6 months of back-and-forth friction. Our clinical Execution Protocol delivers custom operational systems fully verified in under 28 days.",
    
    // Services items
    list: [
      {
        title: "High-Yield Digital Infrastructure",
        description: "Web presence and Next.js platforms designed to project absolute category dominance. Built without templates, engineered for prestige.",
        outcome: "+238% Conversion Increase",
        tagline: "Engineering Category Dominance.",
        overview: "A custom website is not a marketing cost; it is your ultimate digital asset. Standard templates signal mediocrity. We build pixel-perfect, custom-designed, lightning-fast digital estates that establish your market position without compromise.",
        features: [
          { name: "Custom Art Direction", description: "Tailored styling aligned with elite luxury standards, designed from scratch for your brand." },
          { name: "Zero-Template Next.js Codebase", description: "Pure, high-performance React engineering delivering perfect mobile speeds (98+)." },
          { name: "SEO Schema Blueprint", description: "Hard-coded schemas and semantic HTML structure to command organic visibility." },
          { name: "Telemetric Auditing", description: "Integrated conversion tracking to monitor interaction accuracy and lead flow." },
        ],
        ctaText: "Apply for Platform Build",
        ctaHref: "/book?service=authority-platform",
      },
      {
        title: "Autonomous Pipeline Routing",
        description: "Custom CRM bookings and synchronized lead orchestration that triages, captures, and schedules prospects in under 1 second.",
        outcome: "97% Lead Response Speed",
        tagline: "Direct Pipeline Architecture.",
        overview: "Traffic without conversion is vanity. We design focused, distraction-free scheduling and qualification experiences engineered to guide high-intent visitors straight to your CRM with zero leakage.",
        features: [
          { name: "Frictionless Vetting Flows", description: "Short-form qualification steps that validate leads and intent in real-time." },
          { name: "Dynamic Targeting Copy", description: "Persuasive, premium copywriting focused entirely on high-ticket decision makers." },
          { name: "Speed Optimization", description: "Instant page load delivery that prevents lead drop-off and attrition." },
          { name: "Direct Routing Pipeline", description: "Automated routing that delivers hot prospects straight into your sales pipeline." },
        ],
        ctaText: "Secure Funnel Alignment",
        ctaHref: "/book?service=conversion-funnel",
      },
      {
        title: "Relational Cloud Data Architecture",
        description: "High-throughput cloud storage engines and database schemas engineered for sub-millisecond querying and complete data sovereignty.",
        outcome: "100% Data Sovereignty",
        tagline: "High-Throughput Storage Engines.",
        overview: "Scalable backend infrastructure structured on Supabase to manage complex business state, files, and users. Engineered for perfect latency and absolute data sovereignty.",
        features: [
          { name: "Bespoke Database Schema Design", description: "Custom relational tables and security policies aligned with your operational requirements." },
          { name: "Sub-Millisecond Query Speeds", description: "Performance optimized querying that eliminates database latency bottlenecks." },
          { name: "Secure Cloud Storage Buckets", description: "Fully encrypted object storage pipelines for seamless document and asset management." },
          { name: "Automated Backup Protocols", description: "Redundant snapshot backups securing total data sovereignty and recovery." },
        ],
        ctaText: "Request Database Alignment",
        ctaHref: "/book?service=database-architecture",
      },
      {
        title: "Autonomic Multi-Agent Systems",
        description: "Automated pipelines that qualify, capture, and nurture leads 24/7/365. Replacing manual drag with software leverage.",
        outcome: "30+ Hours Reclaimed Weekly",
        tagline: "Operational Leverage 24/7.",
        overview: "Human drag in qualification and data transfer is an unnecessary operational tax. We build autonomous agents and background pipelines that triage, route, and engage leads instantly.",
        features: [
          { name: "Bespoke AI Concierge", description: "Dynamic chat agents trained on your specific business knowledge to qualify queries instantly." },
          { name: "Instant Lead Routing", description: "Webhook integrations linking capture events to CRM and Slack in less than 5 seconds." },
          { name: "Continuous Nurture Scripts", description: "Automated, high-context follow-up sequences that prevent lead decay indefinitely." },
          { name: "System Telemetry", description: "Dedicated admin dashboards to track lead flow and system performance in real-time." },
        ],
        ctaText: "Request Autonomic Integration",
        ctaHref: "/book?service=ai-agents",
      },
    ],
  },

  // 5. Process Page Copy (`/process`)
  processPage: {
    headerTitle: "The Path to",
    headerHighlight: "Excellence",
    headerSubtitle: "Our clinical Execution Protocol designed to take your brand from vision to high-impact market dominance.",
    steps: [
      {
        number: "01",
        title: "Forensic Operational Audit",
        sub: "Identifying system leakage and administrative drag.",
        details: "We dissect your operations to isolate where human friction costs you margins. We do not do casual chats; we execute a forensic analysis of your current systems.",
        deliverable: "Automation Opportunity Report",
      },
      {
        number: "02",
        title: "Architecture & Blueprint",
        sub: "Designing custom pipelines built for leverage.",
        details: "We map out the system architecture, CRM pipeline routes, and design blueprints. You receive an absolute layout showing exactly where manual labor is permanently replaced.",
        deliverable: "Bespoke System Architecture Blueprint",
      },
      {
        number: "03",
        title: "Bespoke Integration & Build",
        sub: "Developing customized assets with zero templates.",
        details: "We code your custom high-converting web presence and build automated pipelines. Zero template boilerplate. We build for maximum throughput and test for absolute resilience.",
        deliverable: "Verified Production Platform & AI Hub Sync",
      },
      {
        number: "04",
        title: "Telemetric Handover",
        sub: "Transitioning control with full telemetry setups.",
        details: "We deploy the systems live under full validation. You receive complete telemetry dashboards and operational training. We don't hand over a draft; we deliver a high-yield asset.",
        deliverable: "Scalable Infrastructure & 30-Day Launch Care",
      },
    ],
  },

  // 6. Portfolio Page Copy (`/portfolio`)
  portfolioPage: {
    headerTitle: "Our Deployed",
    headerHighlight: "Registry",
    headerSubtitle: "A registry of high-yield digital assets and automated operations engineered to command market authority.",
    noticeTitle: "Proprietary System Schema Lock",
    noticeDescription: "Due to strict NDAs, active client acquisition dashboards and proprietary AI schemas are anonymized and locked. Enter your details to request access to sanitized blueprints and Loom walkthroughs.",
    constructionTitle: "Request Sanitized System Schema",
    constructionDescription: "Due to NDAs, we cannot expose this active client dashboard to public traffic. Enter your email to instantly receive a sanitized architectural blueprint, database schema, and Loom walkthrough of this build.",
    emailLabel: "Your Email Address *",
    nameLabel: "Your Name",
    submitBtnText: "Request System Schema",
    underConstructionText: "Waitlist registration for under-construction site: ",
  },

  // 7. Pricing Page Copy (`/pricing`)
  pricingPage: {
    headerTitle: "Bespoke Capital",
    headerHighlight: "Investments",
    headerSubtitle: "Transparent setup requirements for custom system assets. Choose the level of operational leverage that matches your growth path.",
    performanceSLATitle: "System Performance SLA",
    performanceSLASubtitle: "Uptime, Speed & Telemetry Guarantees",
    performanceSLAParagraph: "Every Mercian Wealth custom deployment operates under a strict performance SLA. We guarantee a Mobile PageSpeed score of 90+ and immediate database replication failovers. Our engineering team maintains active telemetry dashboards to verify system throughput 24/7/365.",
    roiCalculator: {
      eyebrow: "Deficit Diagnostics",
      title: "Quantify Your System Deficit",
      description: "Plug in your monthly revenue and weekly manual admin hours. The math is simple: manual operations cost your business £75/hour in lost productivity and leak up to 15% of your potential pipeline conversion. Adjust the sliders to see what is currently slipping through the cracks.",
      annualTimeLabel: "Annual Time Reclaimed",
      growthLiftLabel: "Est. Growth Lift (15%)",
      valueUnlockedLabel: "Total Est. Annual Value Unlocked",
      valueDisclaimer: "Value computed by applying 15% website conversion lift and valuation of manual hours saved at £75/hr.",
      recommendedLabel: "Recommended Alignment:",
      recommendedSuffix: " System Tier",
      applyBtnText: "Apply for Vetted Integration",
      currentRevenueLabel: "Current Monthly Revenue",
      weeklyHoursLabel: "Weekly Hours Spent on Manual Admin",
    },
    billingToggleSetup: "One-Time Setup",
    billingToggleRetainer: "Monthly Retainer",
    setupTiers: [
      {
        name: "Launch Catalyst",
        price: "1,850",
        interval: "£462 deposit to initiate",
        milestoneBreakdown: "4 milestone stages of 25% (£462) linked to build progress",
        description: "A high-performance visual presence and automated qualification routing. Built for early-stage scaleups looking to build immediate momentum.",
        features: [
          "Bespoke Next.js Authority Platform (5 Pages)",
          "Autonomous Lead Capture & Calendly Setup",
          "Core SEO Blueprint & Schema Setup",
          "Supercharged Speed Profile (98+ Mobile)",
          "30 Days Dedicated Post-Launch Support",
        ],
        cta: "Request Alignment",
        featured: false,
        tag: "Launch Catalyst",
      },
      {
        name: "System Leverage",
        price: "3,850",
        interval: "£962 deposit to initiate",
        milestoneBreakdown: "4 milestone stages of 25% (£962) linked to build progress",
        description: "Your complete digital systems layer. We replace manual administrative overhead with custom relational database and CRM routing pipelines.",
        features: [
          "Everything in Launch Catalyst (up to 10 Pages)",
          "Custom Relational Database Integration (Supabase)",
          "Autonomous Pipeline Routing & CRM Orchestration",
          "Custom Secure Client Portal Integration",
          "Automated Stripe Billing & Invoice Engine",
          "90 Days Dedicated Post-Launch Support",
        ],
        cta: "Initiate Audit",
        featured: true,
        tag: "System Leverage",
      },
      {
        name: "Autonomic Partner",
        price: "7,500",
        interval: "£1,875 deposit to initiate",
        milestoneBreakdown: "4 milestone stages of 25% (£1,875) linked to build progress",
        description: "The ultimate growth and automation infrastructure. We build a high-performance brand platform, launch outbound email engines, and engineer custom AI triage agents.",
        features: [
          "Everything in System Leverage (Unlimited Pages)",
          "Autonomic Cold Outreach Infrastructure",
          "Custom-Trained AI Agent Concierge",
          "Full Corporate Brand Identity Suite",
          "Direct Slack Hotline to Principal Founders",
          "Weekly Systems Scaling Strategy Roadmaps",
        ],
        cta: "Initiate Audit",
        featured: false,
        tag: "Autonomic Partner",
      },
    ],
    retainerTiers: [
      {
        name: "Launch Support",
        price: "395",
        interval: "billed monthly",
        description: "Continuous hosting, speed audits, and priority updates to preserve your digital momentum.",
        features: [
          "Premium Dedicated Ultra-Fast CDN Hosting",
          "Weekly Security & Speed Audits",
          "3 Hours Design & Copywriting Updates/mo",
          "Monthly Traffic & SEO Analytics Report",
          "24/7 Critical System Monitoring",
          "Same-Day Urgent Edits Turnaround",
        ],
        cta: "Request Alignment",
        featured: false,
        tag: "Launch Catalyst",
      },
      {
        name: "Leverage Growth",
        price: "750",
        interval: "billed monthly",
        description: "Custom growth campaigns, search engine optimization, and continuous AI model tuning.",
        features: [
          "Everything in Launch Support",
          "Continuous AI Agent Re-training & Updates",
          "1 Custom High-Converting Landing Page/mo",
          "Advanced SEO Content & Competitor Strategy",
          "10 Dedicated Developer/Designer Hours/mo",
        ],
        cta: "Initiate Audit",
        featured: true,
        tag: "System Leverage",
      },
      {
        name: "Autonomic Alliance",
        price: "1,450",
        interval: "billed monthly",
        description: "Your complete external fractional Chief Technology & Marketing advisory partner.",
        features: [
          "Everything in Leverage Growth",
          "Weekly High-Level Growth Consulting Call",
          "Unlimited Minor System & UI Adjustments",
          "New AI Workflow Builds & Automations",
          "Bespoke Cold Email/Marketing System setups",
          "Direct Slack Hotline to Core Founders",
        ],
        cta: "Initiate Audit",
        featured: false,
        tag: "Autonomic Partner",
      },
    ],
  },

  // 8. Contact Concierge Copy (`/contact`)
  contactPage: {
    headerTitle: "Contact",
    headerHighlight: "Concierge",
    headerSubtitle: "Let's build your digital authority and automate operations. Get in touch with our elite engineering team.",
    supportEyebrow: "Elite Support",
    supportTitle: "Direct Concierge Desk",
    supportDescription: "We don't use generic support tickets or ticketing bots. You deal directly with our founders and core technical team.",
    emailLabel: "Email Concierge",
    phoneLabel: "Direct Call / WhatsApp",
    slaLabel: "Average Response SLA",
    slaValue: "Under 12 Hours Guarantee",
    whatsNextTitle: "What Happens Next?",
    whatsNextItems: [
      "Initial reply confirming receipt of details.",
      "Quick technical assessment of your current website/systems.",
      "A clinical evaluation to map your automation leverage opportunity.",
    ],
  },

  // 6. Testimonials Page Copy (`/testimonials`)
  testimonialsPage: {
    headerTitle: "What Our Clients",
    headerHighlight: "Say",
    headerSubtitle: "Real results from ambitious businesses we have partnered with. Every word is from a founder who trusted us to build their legacy.",
  },

  // 9. Vetting Application Copy (`/book`)
  bookPage: {
    clinicalEvaluationLabel: "Clinical Evaluation",
    headerTitle: "Request",
    headerHighlight: "Alignment",
    headerSubtitle: "Our time is highly leveraged, and we expect the same of yours. Complete the qualification criteria below to request an alignment session. If there is a fit, we will confirm your booking.",
    trustItems: [
      "30-minute clinical evaluation",
      "Candid operational analysis",
      "Strictly limited allocations"
    ],
    socialProofQuote: "The clinical evaluation alone identified conversion gaps we had missed for two years.",
    socialProofAuthor: "Daniel K., Founder, Kensington Advisory",
  },
};
