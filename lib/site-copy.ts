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
      description: "Custom digital systems and automated AI architectures engineered to secure category dominance for market leaders. Vetted partnerships only."
    },
    home: {
      title: "Mercian Wealth | Bespoke Digital Infrastructure & Automated Engines",
      description: "Custom digital systems and automated AI architectures engineered to secure category dominance for market leaders. Vetted partnerships only.",
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
      title: "Active Cohort Status | Mercian Wealth",
      description: "Live system telemetry, deployment standards, and inaugural UK integration cohort updates.",
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
      { label: "Cohort Status", href: "/cohort-status" },
      { label: "Contact", href: "/contact" },
    ],
    ctaText: "Request Alignment",
    ctaHref: "/book",
  },

  // Homepage Sections
  homepage: {
    // 0. Live Telemetry Ticker
    telemetryTicker: {
      items: [
        "Engineered for 99.9% Infrastructure Uptime",
        "Sub-60s Intent Capture Architecture",
        "Q3 Cohort: 2 Allocation Slots Remaining",
        "Direct Founder SLA < 12 Hours",
        "Bespoke Digital Infrastructure",
      ]
    },

    // 1. Hero Section
    hero: {
      eyebrow: "Bespoke Digital Infrastructure & Automated Engines",
      headline: "While You Read This, Your Competitors Are Acquiring Speed. You Are Paying the Manual Tax.",
      subheadline: "Every hour your business relies on manual lead routing, delayed follow-ups, and static web pages, high-value instructions slip quietly to faster operators. We build digital engines engineered for sub-60-second intent capture.",
      primaryCtaText: "Apply for System Alignment",
      secondaryCtaText: "Review Deployed Systems",
      trustItems: [
        "Automated Pipeline Architecture",
        "Sub-60s Intent Capture Capability",
        "Fluid Mobile Architecture",
        "Guaranteed System Throughput",
      ],
      unsureText: "Unsure of your requirements? Review our 28-Day Execution Protocol →",
    },

    // Divergence Comparison (The Two-Path Mechanic)
    divergenceComparison: {
      eyebrow: "THE STRUCTURAL REALITY",
      headline: "THE DIVERGENCE: Manual Operational Drag vs. The Automated Growth Engine",
      subheadline: "Every high-margin business reaches a fork: continue paying the cumulative tax of fragmented manual systems, or deploy automated infrastructure engineered for category supremacy.",
      pathConventional: {
        badge: "CONVENTIONAL PATH",
        title: "Manual Operational Drag",
        subtitle: "Fragmented systems, manual copy-pasting, and delayed response loops.",
        points: [
          "24–48 hour lead response lag causing high-intent drop-off and lost instructions.",
          "Fee-earners wasting 15+ hours weekly copy-pasting form inputs into CRMs.",
          "Static, slow-loading templates (6-10s) that project low-tier brand authority.",
          "Recurring agency retainer overhead with zero performance throughput SLA.",
        ]
      },
      pathMercian: {
        badge: "MERCIAN AUTOMATED PATH",
        title: "The Automated Growth Engine",
        subtitle: "Bespoke digital assets, 0-second AI triage, and direct CRM data conduits.",
        points: [
          "Sub-60-second intent capture & automated qualification firing 24/7/365.",
          "Direct pipeline webhooks routing prospect data instantly to your CRM.",
          "Sub-1-second mobile load speeds projecting instant category authority.",
          "Dedicated 28-day execution protocol backed by ongoing telemetry support.",
        ],
        ctaText: "Secure Cohort Alignment →",
      }
    },

    // 2. Deficit Diagnostic
    bottleneck: {
      eyebrow: "UNSEEN REVENUE DECAY",
      headline: "You Are Contracting While Faster Operators Scale.",
      subheadline: "High-ticket clients do not wait 3 hours for a response. When an instruction inquiry reaches your inbox, the clock starts. If you take 30 minutes to reply, a competitor with automated lead triage has already booked the session.",
      goldSlogan: "Speed is the ultimate unfair advantage. While you wait to automate, your competitors are buying speed. They aren't smarter; they simply have more leverage.",
      systemMode: "System Mode: ",
      modeAutomated: "Automated & Connected",
      modeManual: "Manual Drag",
      triggerBtnActive: "Deactivate Automated Engine",
      triggerBtnInactive: "Activate Automated Engine",
      diagnosticLink: "Quantify Your Operational Deficit →",
      
      cards: [
        {
          title: "Deals Going Cold",
          description: "Unqualified inquiries sitting in email inboxes for hours cause immediate competitive lead drop-off.",
        },
        {
          title: "Wasted Agency Hours",
          description: "Fee-earners wasting hours copy-pasting form inputs into CRM dashboards instead of closing instructions.",
        },
        {
          title: "Manual Follow-Up Failure",
          description: "Warm vendor inquiries forgotten after initial contact due to disconnected follow-up sequences.",
        },
      ],
    },

    // 3. Commodity Trap
    commodityTrap: {
      eyebrow: "The Commodity Trap",
      headline: "A Cheap Website Is the Most Expensive Asset You Will Ever Own.",
      description: "Budget web builders look economical until you calculate lost instructions. 10-second mobile load times, clunky lead forms, and manual copy-pasting into CRMs quietly bleed your margins. Commodity agencies sell you graphics. We build high-converting infrastructure engineered for market dominance.",
    },

    // 4. Mercian Wealth Difference
    whyMercianWealth: {
      headline: "We Build Leverage. The Rest Build Overhead.",
      description: "Traditional agencies bill you by the hour to push pixels and stretch deadlines. We build autonomous sales infrastructure designed to eliminate administrative drag.",
      differentiators: [
        "Sub-60-Second Triage Capability — Automated engagement funnels engineered to capture and qualify prospect intent instantly.",
        "Zero-Drag CRM Routing — Direct pipeline webhooks that route intake data directly into your CRM without manual input.",
        "Category-Dominant Authority — Pixel-perfect custom platforms that project immediate prestige and load in under 1 second on mobile.",
        "28-Day Execution Protocol — Rapid deployment path designed to eliminate build lag.",
        "Continuous Telemetry Support — Ongoing optimization retention to preserve system throughput.",
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
        title: "Automated Systems Lab",
        items: [
          "Bespoke authority platforms built from the ground up.",
          "Rapid execution protocol delivering assets in under 28 days.",
          "Autonomous capture funnels with direct CRM data pipelines.",
          "Clear capital investment aligned with guaranteed throughput.",
        ],
      },
    },

    // 5. Trend Adaptation Statement
    trendAdaptation: {
      eyebrow: "Continuous Telemetry",
      headline: "Our Systems Evolve While Your Competitors Stagnate.",
      description: "We monitor market trends, security updates, and performance telemetry continuously, optimizing your systems in the background. Your digital infrastructure remains permanently state-of-the-art without your team lifting a finger. It is an unfair advantage your competitors are acquiring right now.",
    },

    // 6. Model Hint
    modelHint: {
      eyebrow: "TRANSPARENT CAPITAL ALLOCATION",
      headline: "Capital Allocations Aligned with System Leverage.",
      description: "We do not charge hourly rates for design tweaks. Our setup investments are linked directly to operational leverage and reclaimed bandwidth. Specific infrastructure parameters are reviewed during your clinical audit.",
    },

    // 7. Exclusivity Lock
    exclusivityLock: {
      eyebrow: "Selective Vetting",
      headline: "We Do Not Partner With Everyone.",
      description: "To preserve absolute founder-level code quality and execution speed, we limit new client intake strictly to 2 integrations per cohort. We assess fit before we commit. Requesting an audit is an application, not a sales call. If there is mutual alignment, we initiate the build.",
    },

    // 8. Outcome Telemetry (Testimonials / Social Proof - Broadened)
    testimonials: {
      eyebrow: "ACTIVE DEPLOYMENT COHORT",
      headline: "Active Deployment Cohort",
      subheadline: "Independent System Telemetry Under Verification",
      guarantee: "Transparent Build Telemetry · Zero Fabricated Claims Policy",
      
      cohortCard: {
        badge: "COHORT INTAKE UNDER DEPLOYMENT",
        title: "Selective Cohort Onboarding · Live System Telemetry",
        paragraph1: "Mercian Wealth is currently engineering digital infrastructure for our inaugural UK agency cohort. While you read this, operators already inside this cohort are deploying sub-60-second lead routing engines, eliminating administrative drag, and securing high-value instructions around the clock.",
        paragraph2: "To preserve absolute market authority, verified case study blueprints, latency audits, and pipeline telemetry will be published directly to this registry upon deployment sign-off.",
        paragraph3: "The question is not whether your agency requires automated leverage — it is whether you will secure your infrastructure before your direct competitors do.",
        enquiryCtaText: "To enquire about current cohort deployment availability or review system architecture during a clinical evaluation session, request alignment below.",
      },

      trustPoints: [
        "Zero Fabricated Claims Policy",
        "Sub-60-Second System Capability",
        "Verified System Architecture Benchmarks",
      ],
    },

    // 9. FOMO Close & CTA Section
    cta: {
      headline: "Ready to Assert Market Control?",
      subheadline: "We operate under tight bandwidth restrictions to maintain system quality. We only partner with enterprises prepared for absolute alignment. Currently accepting strictly 2 new integration partnerships per deployment cohort.",
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
    headerTitle: "Infrastructure Built to",
    headerHighlight: "Command Market Share",
    headerSubtitle: "We do not offer generic design packages. We build focused digital assets engineered to solve specific revenue leaks in high-margin businesses.",
    objectionCallout: "Standard development cycles take 3 to 6 months of friction. Our 28-Day Execution Protocol delivers custom operational systems fully verified in under 28 days.",
    
    // Services items
    list: [
      {
        title: "Category-Dominant Digital Platforms",
        description: "Replace slow, forgettable websites with pixel-perfect visual platforms that establish immediate market authority and load instantly on mobile.",
        outcome: "Sub-1-Second Mobile Load Speed Capability",
        tagline: "Engineering Category Dominance.",
        overview: "A custom website is not a marketing cost; it is your ultimate digital asset. Standard templates signal mediocrity. We build pixel-perfect, custom-designed, lightning-fast digital estates that establish your market position without compromise.",
        features: [
          { name: "Custom Art Direction", description: "Tailored styling aligned with elite luxury standards, designed from scratch for your brand." },
          { name: "Zero-Template Next.js Codebase", description: "Pure, high-performance React engineering delivering sub-1-second mobile speeds." },
          { name: "SEO Schema Blueprint", description: "Hard-coded schemas and semantic HTML structure to command organic search visibility." },
          { name: "Performance Telemetry", description: "Integrated conversion tracking to monitor interaction accuracy and lead flow." },
        ],
        ctaText: "Apply for Platform Build",
        ctaHref: "/book?service=authority-platform",
      },
      {
        title: "Sub-60-Second Lead Routing",
        description: "Engineered for sub-60-second lead triage capability so warm prospects are qualified and routed straight to your calendar.",
        outcome: "Engineered for Sub-60s Triage",
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
        title: "Cloud Data Architecture & Pipelines",
        description: "High-throughput storage engines and database schemas engineered for sub-millisecond querying and complete data sovereignty.",
        outcome: "Complete Data Sovereignty & Isolation",
        tagline: "High-Throughput Storage Engines.",
        overview: "Scalable backend infrastructure structured on Supabase to manage complex business state, files, and users. Engineered for latency reduction and absolute data sovereignty.",
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
        title: "Automated Systems Architecture",
        description: "Automated pipelines that qualify, capture, and nurture leads 24/7/365. Replacing manual drag with software leverage.",
        outcome: "Targeted Bandwidth Reclaimed",
        tagline: "Operational Leverage 24/7.",
        overview: "Human drag in qualification and data transfer is an unnecessary operational tax. We build automated engines and background pipelines that triage, route, and engage leads instantly.",
        features: [
          { name: "Bespoke AI Concierge", description: "Dynamic chat agents trained on your specific business knowledge to qualify queries instantly." },
          { name: "Instant Lead Routing", description: "Webhook integrations linking capture events to CRM and Slack in less than 5 seconds." },
          { name: "Continuous Nurture Scripts", description: "Automated follow-up sequences that prevent lead decay indefinitely." },
          { name: "System Telemetry", description: "Dedicated admin dashboards to track lead flow and system performance in real-time." },
        ],
        ctaText: "Request Automated Systems Integration",
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
    constructionTitle: "Request Project Case Study and Blueprint",
    constructionDescription: "Due to client confidentiality and active NDAs, the production build cannot be exposed to public traffic. Submitting your details will result in receiving a sanitised architectural blueprint, case study, and system walkthrough.",
    emailLabel: "Business Email Address",
    nameLabel: "Full Name",
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
        name: "Enterprise Partner",
        price: "7,500",
        interval: "£1,875 deposit to initiate",
        milestoneBreakdown: "4 milestone stages of 25% (£1,875) linked to build progress",
        description: "The ultimate growth and automation infrastructure. We build a high-performance brand platform, launch outbound email engines, and engineer custom AI triage agents.",
        features: [
          "Everything in System Leverage (Unlimited Pages)",
          "Automated Cold Outreach Infrastructure",
          "Custom-Trained AI Agent Concierge",
          "Full Corporate Brand Identity Suite",
          "Direct Slack Hotline to Principal Founders",
          "Weekly Systems Scaling Strategy Roadmaps",
        ],
        cta: "Initiate Audit",
        featured: false,
        tag: "Enterprise Partner",
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
          "Priority 4-Hour Urgent SLA Response",
        ],
        cta: "Initiate Audit",
        featured: true,
        tag: "System Leverage",
      },
      {
        name: "Enterprise Alliance",
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

  // 6. Cohort Status Page Copy (`/cohort-status`)
  testimonialsPage: {
    headerTitle: "Active Cohort",
    headerHighlight: "Status",
    headerSubtitle: "Live system telemetry, deployment standards, and inaugural UK integration cohort updates.",
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
    socialProofQuote: "Our clinical evaluation maps your exact operational friction before a single line of code is written.",
    socialProofAuthor: "Mercian System Benchmark Standard",
  },
}
