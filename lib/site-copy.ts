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
      { label: "Interactive Demo", href: "/#demo" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Process", href: "/process" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
    ctaText: "Get Started",
    ctaHref: "/book",
  },

  // Homepage Sections
  homepage: {
    // 0. Live Telemetry Ticker
    telemetryTicker: {
      items: [
        "Sub-1-Second Mobile Load Architecture",
        "Instant WhatsApp & SMS Order Notifications",
        "Automated 5-Star Google Review Engine",
        "Q3 Cohort: 2 Regional Slots Remaining",
        "Direct Founder SLA < 12 Hours",
      ]
    },

    // 1. Hero Section
    hero: {
      eyebrow: "AI AUTOMATION & DIGITAL STOREFRONTS FOR LOCAL BUSINESSES",
      headline: "We Diagnose Inefficiencies & Deploy Custom AI Automations That Scale Your Operations — On Autopilot.",
      subheadline: "We eliminate manual admin for bakeries, food artisans, local services, and growing operators across Berkshire & the UK. From sub-second mobile storefronts to automated WhatsApp order alerts and 5-star Google review engines.",
      primaryCtaText: "Test Interactive Demo",
      secondaryCtaText: "View Solutions & Pricing",
      trustItems: [
        "Sub-1-Second Mobile Storefront",
        "Instant WhatsApp & SMS Order Alerts",
        "Automated 5-Star Google Review Engine",
        "Guaranteed 30-Day Throughput",
      ],
      unsureText: "Want to see how it works live? Try our interactive 3-tap order builder →",
    },

    // Divergence Comparison (The Two-Path Mechanic)
    divergenceComparison: {
      eyebrow: "THE DIVERGENCE",
      headline: "Manual Admin Drag vs. The Automated Storefront Engine",
      subheadline: "Every local business reaches a fork: continue scrawling order notes on paper receipts after 12-hour prep shifts, or deploy an automated storefront taking orders and deposits 24/7.",
      pathConventional: {
        badge: "MANUAL DRAG",
        title: "The Paper & Scramble Method",
        subtitle: "Scrawling notes on receipts, lost WhatsApp messages, and delayed replies.",
        points: [
          "Scrawling custom cake orders or catering specs on scrap paper during 6am prep rush.",
          "Waiting until 9pm after a 12-hour shift to reply to email quote requests.",
          "Chasing bank transfers via text for 50% deposits while managing foot traffic.",
          "0 Google reviews because you forget to follow up with busy customers after pickup.",
        ]
      },
      pathMercian: {
        badge: "AUTOMATED ENGINE",
        title: "The Mercian Growth Engine",
        subtitle: "Sub-second mobile storefront, 3-tap order builder, and instant phone alerts.",
        points: [
          "3-tap online order builder collecting custom specs & deposit payments 24/7.",
          "Instant WhatsApp phone alert arriving with complete order details as soon as a deposit is paid.",
          "Sub-1-second mobile load speeds projecting instant artisan quality & market authority.",
          "Automated text sent 2 hours after pickup asking for a 5-star Google review.",
        ],
        ctaText: "Explore Order Engine Demo →",
      }
    },

    // 2. Deficit Diagnostic
    bottleneck: {
      eyebrow: "THE 6 AM REALITY",
      headline: "While You're Baking at 6 AM, Orders Are Slipping Away.",
      subheadline: "When a customer wants a custom birthday cake or a £300 catering platter for Saturday, they won't wait 3 hours for a reply. If you don't take the order instantly, a supermarket chain or faster competitor takes the deposit.",
      goldSlogan: "Speed & convenience win every time. While competitors scramble with paper notes, an automated storefront captures orders and collects deposits while you sleep.",
      systemMode: "System Mode: ",
      modeAutomated: "Automated Storefront",
      modeManual: "Manual Scramble",
      triggerBtnActive: "Deactivate Automated Engine",
      triggerBtnInactive: "Activate Automated Engine",
      diagnosticLink: "Test Interactive Order Builder →",
      
      cards: [
        {
          title: "Flour-Dusted Order Notes",
          description: "Scrawling custom cake orders or catering specs on scrap paper while busy serving customers in-store.",
        },
        {
          title: "Chasing WhatsApp Deposits",
          description: "Spending your evenings sending bank details back and forth trying to get 50% deposits paid.",
        },
        {
          title: "Invisible on Google Maps",
          description: "Baking the best artisan breads or cakes, but losing local searches to chains with 150+ Google reviews.",
        },
      ],
    },

    // 3. Commodity Trap
    commodityTrap: {
      eyebrow: "The Commodity Trap",
      headline: "A Slow, Clunky Website Costs More Than Building It Right.",
      description: "Generic DIY site builders look cheap until you realize how many custom orders they bleed. 10-second mobile load times, clunky contact forms, and missing deposit payment links cost you thousands in lost business. We build sub-second mobile storefronts engineered to capture deposits and ping your phone instantly.",
    },

    // 4. Mercian Wealth Difference
    whyMercianWealth: {
      headline: "Built Specifically for Bakeries, Food Artisans & Local Services",
      description: "Traditional agencies charge thousands for static, slow websites that sit idle. We build automated storefronts engineered to capture custom orders, collect deposits, and text your phone.",
      differentiators: [
        "Sub-1-Second Mobile Storefront — Lightning-fast custom mobile pages that showcase your artisan creations in full luxury resolution.",
        "3-Tap Custom Order & Catering Builder — Let customers pick cake sizes, flavors, dietary options, event dates, and pay deposits in 30 seconds.",
        "Instant WhatsApp Phone Alerts — Immediate notification on your phone with full order details (name, date, deposit paid) when a booking goes through.",
        "Automated 5-Star Google Review Engine — Text happy customers after pickup to build 5-star Google Maps dominance on autopilot.",
      ],
      structuralRealityHeadline: "The Structural Reality",
      standardAgency: {
        title: "Standard Agency Model",
        items: [
          "Generic templates taking 2 to 3 months to launch.",
          "No order customization or instant deposit collection.",
          "No automated phone alerts or WhatsApp notifications.",
          "Ongoing monthly fees with zero order performance guarantee.",
        ],
      },
      mercianWealth: {
        title: "Mercian Automated Storefront",
        items: [
          "Custom sub-second mobile storefront built in 7 to 14 days.",
          "3-tap order builder with instant Stripe deposit collection.",
          "Instant WhatsApp & SMS phone notifications on every order.",
          "Backed by our 30-day 10-order / 20-review performance guarantee.",
        ],
      },
    },

    // 5. Trend Adaptation Statement
    trendAdaptation: {
      eyebrow: "Continuous Optimization",
      headline: "Your Storefront Upgrades Automatically While You Focus on Baking.",
      description: "We handle hosting, SSL security, speed optimizations, and seasonal menu updates in the background. Your mobile storefront stays fast, secure, and ready to take orders 365 days a year without you touching a line of code.",
    },

    // 6. Model Hint
    modelHint: {
      eyebrow: "TRANSPARENT PRICING",
      headline: "Simple Setup Fee + Flat Monthly Retainer.",
      description: "No hidden hourly fees. One upfront setup investment to build your custom storefront and order engine, plus a flat monthly retainer for hosting, WhatsApp alerts, and edits.",
    },

    // 7. Exclusivity Lock
    exclusivityLock: {
      eyebrow: "Regional Exclusivity",
      headline: "We Limit New Onboarding to 2 Local Businesses Per Month.",
      description: "To ensure absolute custom quality and 7-day launch speeds, we onboard strictly 2 local businesses per month per region. We partner with dedicated artisans and local operators who want to lead their category.",
    },

    // 8. Outcome Telemetry (Testimonials / Social Proof - Broadened)
    testimonials: {
      eyebrow: "OUR LOCAL GUARANTEE",
      headline: "100% Risk-Free Performance Guarantee",
      subheadline: "Tested & Proven Results for Independent Operators",
      guarantee: "Transparent Build Guarantee · Zero Risk Policy",
      
      cohortCard: {
        badge: "30-DAY PERFORMANCE GUARANTEE",
        title: "Guaranteed Results for Berkshire & UK Local Businesses",
        paragraph1: "If your new digital storefront and order engine does not generate at least 10 new custom orders or 20 new 5-star Google reviews in your first 30 days, we refund 100% of your setup fee. No questions asked.",
        paragraph2: "We build high-performance systems for bakeries, food artisans, specialty food shops, and local service operators who want to eliminate manual admin drag and capture orders on autopilot.",
        paragraph3: "Your competitors are still taking orders on scrap paper and chasing bank transfers via email. Give your business the ultimate digital unfair advantage today.",
        enquiryCtaText: "To claim your regional onboarding slot or test the live demo, request a 15-minute quick call below.",
      },

      trustPoints: [
        "100% Setup Refund Guarantee",
        "Sub-1-Second Mobile PageSpeed",
        "Instant WhatsApp Order Alerts",
      ],
    },

    // 9. FOMO Close & CTA Section
    cta: {
      headline: "Ready to Automate Your Orders & Reviews?",
      subheadline: "We only onboard 2 new local businesses per region each month to maintain 7-day launch speeds. Claim your setup slot today and start capturing automated orders.",
      buttonText: "Claim Your Onboarding Slot",
    },

    // 10. FAQ Section
    faq: {
      eyebrow: "FAQ",
      headline: "Frequently Asked Questions",
      description: "Everything you need to know about our storefront build, order engine, and 30-day guarantee.",
      faqs: [
        {
          question: "Do I need to be tech-savvy to manage this?",
          answer: "Not at all. Orders and catering requests arrive directly on your phone via WhatsApp or SMS. You manage everything from the phone you already use every day, without touching any code or complex dashboards.",
        },
        {
          question: "How do custom cake and catering deposits work?",
          answer: "Customers select their items, event date, and options on your website. They pay a 50% (or 100%) deposit via Stripe before the order goes through, so you never buy ingredients or reserve calendar dates for an unpaid order.",
        },
        {
          question: "Can I update seasonal flavors or menu items?",
          answer: "Yes! You get simple access to swap photos, update prices, or add seasonal specials (e.g., Easter, Christmas, Valentine's packs) in seconds. Our monthly retainer also includes complimentary edits handled by our team.",
        },
        {
          question: "How fast can my new storefront be live?",
          answer: "Your complete mobile storefront, 3-tap order builder, and review engine are custom built, tested, and launched within 7 to 14 days under our Execution Protocol.",
        },
        {
          question: "What is included in the 30-day money-back guarantee?",
          answer: "If your new storefront and order engine does not generate at least 10 new custom orders or 20 new 5-star Google reviews within 30 days of launch, we will refund 100% of your setup fee instantly.",
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
        name: "Digital Storefront",
        price: "495",
        interval: "one-time setup + £99/mo retainer",
        milestoneBreakdown: "Instant setup & launch within 7 days",
        description: "A fast, sub-second custom mobile storefront designed for local bakeries, food artisans, and service businesses needing immediate online visibility.",
        features: [
          "3–5 Page Custom Next.js Mobile Storefront",
          "Google Maps & Local 3-Pack SEO Blueprint",
          "Automated 5-Star Google Review Engine",
          "Fast Sub-1-Second Mobile PageSpeed",
          "Hosting, SSL, Security & Edits Included (£99/mo)",
          "30 Days Dedicated Launch Support",
        ],
        cta: "Select Storefront",
        featured: false,
        tag: "Digital Storefront",
      },
      {
        name: "Growth & Order Engine",
        price: "895",
        interval: "one-time setup + £195/mo retainer",
        milestoneBreakdown: "Full custom order & payment setup in 14 days",
        description: "Automate custom orders, cake/catering quotes, and deposit collection with instant phone alerts and zero lost notes.",
        features: [
          "Everything in Digital Storefront",
          "Custom 3-Tap Cake & Catering Order Builder",
          "Stripe & Instant Deposit Payment Gateways",
          "Instant WhatsApp & SMS Phone Notifications",
          "Automated Pickup & Delivery Booking Calendar",
          "Direct CRM & Order Management Dashboard",
        ],
        cta: "Select Order Engine",
        featured: true,
        tag: "Growth & Order Engine",
      },
      {
        name: "Autonomic Scale",
        price: "1,850",
        interval: "one-time setup + £395/mo retainer",
        milestoneBreakdown: "Full AI concierge & custom workflow integration in 21 days",
        description: "The complete automated growth system for scaling operators, featuring a custom AI Chat Concierge, automated CRM pipelines, and monthly content packs.",
        features: [
          "Everything in Growth & Order Engine",
          "Custom-Trained AI Chat Concierge & Lead Triage",
          "Monthly Photo Asset & Content Refresh Pack",
          "Automated Outbound Email & CRM Pipelines",
          "100% White-Labeled Proprietary Code Base",
          "Direct WhatsApp Hotline to Lead Engineers",
        ],
        cta: "Select Autonomic Scale",
        featured: false,
        tag: "Autonomic Scale",
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
          "Discreet \"Built by Mercian Wealth\" Digital Seal Included",
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
          "Optional \"Built by Mercian Wealth\" Seal or Complimentary Removal",
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
          "100% White-Labeled & Unbranded Enterprise Infrastructure",
          "Bespoke Cold Email/Marketing System setups",
          "Direct Slack Hotline to Core Founders",
        ],
        cta: "Initiate Audit",
        featured: false,
        tag: "Enterprise Alliance",
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
