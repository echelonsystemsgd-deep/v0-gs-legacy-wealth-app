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
      defaultTitle: "Mercian Wealth | Mobile Storefronts & Automation for Bakeries, Catering & Local Services",
      titleTemplate: "%s | Mercian Wealth",
      description: "Custom mobile storefronts, 3-tap order builders, WhatsApp alerts, and automated Google review engines for cake bakeries, catering businesses, food artisans, and local services across Berkshire & the UK."
    },
    home: {
      title: "Mercian Wealth | Mobile Storefronts & Order Automation for Bakeries & Local Services",
      description: "We eliminate manual admin for cake bakeries, catering businesses, food artisans, and local service providers. Sub-second mobile storefronts, instant WhatsApp order alerts, automated deposits & 5-star Google review engines.",
    },
    services: {
      title: "Our Services | Mercian Wealth — Web Design, Order Builders & WhatsApp Alerts",
      description: "Custom order engines, instant WhatsApp notifications, automated 5-star Google review systems, and sub-second mobile storefronts for bakeries, catering, artisans, and local services.",
    },
    process: {
      title: "Our 7-Day Launch Protocol | Mercian Wealth",
      description: "15-minute operational audit, custom mobile storefront build, WhatsApp alert setup, and 7-day launch protocol for local service providers and food businesses.",
    },
    portfolio: {
      title: "Deployed Systems | Mercian Wealth",
      description: "A showcase of high-converting mobile storefronts and automated order engines built for cake bakeries, catering brands, food artisans, and local services.",
    },
    pricing: {
      title: "Pricing | Mercian Wealth — One-Time Setup, Monthly Retainer or % Revenue Share",
      description: "Transparent pricing for bakeries, catering businesses, artisans, and local service providers. One-time setup from £495, flat monthly retainer, or % revenue share options.",
    },
    testimonials: {
      title: "Pricing Models | Mercian Wealth",
      description: "Flexible setup, monthly retainer, and % revenue share models for bakeries, catering operators, food artisans, and local service providers.",
    },
    contact: {
      title: "Get In Touch | Mercian Wealth",
      description: "Connect with Mercian Wealth. Let's discuss your cake bakery, catering business, food artisan, or local service automation needs.",
    },
    book: {
      title: "Book a 15-Min Operational Audit | Mercian Wealth",
      description: "Book a quick 15-minute operational audit to see how much manual admin time we can eliminate for your bakery, catering, artisan, or local service business.",
    },
  },

  // Navbar Component
  navbar: {
    logo: "Mercian Wealth",
    links: [
      { label: "Solutions", href: "/services" },
      { label: "Interactive Demo", href: "/#demo" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Process", href: "/process" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
    ctaText: "Book Quick Audit",
    ctaHref: "/book",
  },

  // Homepage Sections
  homepage: {
    // 0. Live Telemetry Ticker
    telemetryTicker: {
      items: [
        "Sub-1-Second Custom Web Design",
        "24/7 Lead Capture & Enquiry Builders",
        "Automated Bookings & Upfront Deposits",
        "Secure CRM Customer Database Sync",
        "Instant WhatsApp & Email Order Alerts",
      ]
    },

    // 1. Hero Section
    hero: {
      eyebrow: "WEB DESIGN, LEAD CAPTURE & WORKFLOW AUTOMATION FOR LOCAL BUSINESSES",
      headline: "Custom Web Design, Lead Capture & Automated CRM Systems Built for Local Growth.",
      subheadline: "We eliminate manual admin drag for local service providers, trades, bakeries, and independent businesses across Berkshire & the UK. From sub-second mobile web design and 24/7 lead capture to instant WhatsApp order alerts and secure CRM customer database sync.",
      primaryCtaText: "Test Interactive Demo",
      secondaryCtaText: "View Solutions & Pricing",
      trustItems: [
        "Custom Mobile Web Design",
        "24/7 Lead & Booking Capture",
        "Automated Bookings & Stripe Deposits",
        "Instant WhatsApp & Email Alerts",
      ],
      unsureText: "Want to see how it works live? Try our interactive 3-tap order builder →",
    },

    // Divergence Comparison (The Two-Path Mechanic)
    divergenceComparison: {
      eyebrow: "THE DIVERGENCE",
      headline: "Manual Admin Drag vs. The Automated Storefront Engine",
      subheadline: "Every local business reaches a fork: continue scrawling customer notes on scrap paper and chasing quotes after 12-hour workdays, or deploy an automated growth engine capturing inquiries, bookings, and deposits 24/7.",
      pathConventional: {
        badge: "MANUAL DRAG",
        title: "The Paper & Scramble Method",
        subtitle: "Scrawling notes on paper, lost WhatsApp messages, and delayed email replies.",
        points: [
          "Scrawling custom orders, service quotes, or booking specs on scrap paper during busy work shifts.",
          "Waiting until late in the evening after a 12-hour day to reply to email quote requests.",
          "Chasing bank transfers via text message for upfront deposits while managing daily operations.",
          "0 automated Google reviews because you forget to follow up with busy customers after service.",
        ]
      },
      pathMercian: {
        badge: "AUTOMATED ENGINE",
        title: "The Mercian Growth Engine",
        subtitle: "Sub-second mobile storefront, 3-tap booking builder, and instant phone alerts.",
        points: [
          "3-tap online booking & order builder collecting custom specs & deposit payments 24/7.",
          "Instant WhatsApp phone alert arriving with complete job details as soon as a deposit is paid.",
          "Sub-1-second mobile load speeds projecting instant professional authority & high quality.",
          "Automated review text sent after service completion asking for a 5-star Google review.",
        ],
        ctaText: "Explore Interactive Demo →",
      }
    },

    // 2. Deficit Diagnostic
    bottleneck: {
      eyebrow: "THE DAILY REALITY",
      headline: "While You're Busy On The Job, High-Value Leads Are Slipping Away.",
      subheadline: "When a customer wants a service quote, custom order, or weekend booking, they won't wait 3 hours for a reply. If you don't capture the lead instantly, a faster local competitor or national chain takes the deposit.",
      goldSlogan: "Speed & convenience win every time. While competitors scramble with paper notes, an automated system captures inquiries and collects deposits while you focus on your work.",
      systemMode: "System Mode: ",
      modeAutomated: "Automated Storefront",
      modeManual: "Manual Scramble",
      triggerBtnActive: "Deactivate Automated Engine",
      triggerBtnInactive: "Activate Automated Engine",
      diagnosticLink: "Test Interactive Order Builder →",
      
      cards: [
        {
          title: "Scattered Paper Notes & Messages",
          description: "Scrawling customer specs or service details on scrap paper while busy serving clients or managing jobs on-site.",
        },
        {
          title: "Chasing Manual Deposits & Invoices",
          description: "Spending your evenings sending bank details back and forth trying to get upfront deposits paid.",
        },
        {
          title: "Invisible on Google Search & Maps",
          description: "Delivering top-tier local service or artisan quality, but losing search leads to competitors with 150+ Google reviews.",
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
      headline: "Built Specifically for Local Services, Cake Bakeries, Food Artisans & Catering",
      description: "Traditional agencies charge thousands for static, slow websites that sit idle. We build complete automated storefronts and 24/7 lead engines powered by Supabase backend infrastructure and Stripe payment deposits.",
      differentiators: [
        "Sub-1-Second Mobile Storefront — Lightning-fast custom mobile pages that showcase your service packages, custom cakes, catering platters, or artisan creations in full resolution.",
        "Supabase Backend Infrastructure — Full cloud database integration securing customer bookings, custom orders, lead triage, and 100% data sovereignty.",
        "Stripe Payment & Deposit Collection — Collect upfront deposits via Apple Pay, Google Pay, and cards before reserving calendar dates or preparing orders.",
        "Instant WhatsApp Phone Alerts — Immediate notification on your phone with full client details (name, date, deposit paid) the instant a booking or inquiry arrives.",
        "Automated 5-Star Google Review Engine — Text happy clients after service completion or pickup to build 5-star Google Maps dominance on autopilot.",
      ],
      structuralRealityHeadline: "The Structural Reality",
      standardAgency: {
        title: "Standard Agency Model",
        items: [
          "Generic templates taking 2 to 3 months to launch.",
          "No backend database integration or instant deposit collection.",
          "No automated phone alerts or WhatsApp notifications.",
          "Ongoing monthly fees with zero booking performance guarantee.",
        ],
      },
      mercianWealth: {
        title: "Mercian Wealth Automated Engine",
        items: [
          "Custom sub-second mobile storefront built in 7 to 14 days.",
          "Full Supabase backend database & Stripe payment integration.",
          "Instant WhatsApp & SMS phone notifications on every lead & order.",
          "Backed by our 30-day performance guarantee.",
        ],
      },
    },

    // 5. Trend Adaptation Statement
    trendAdaptation: {
      eyebrow: "Continuous Optimization",
      headline: "Your Storefront Upgrades Automatically While You Focus on Your Work.",
      description: "We handle hosting, SSL security, speed optimizations, and seasonal service or menu updates in the background. Your mobile storefront stays fast, secure, and ready to capture clients 365 days a year without you touching a line of code.",
    },

    // 6. Model Hint
    modelHint: {
      eyebrow: "TRANSPARENT PRICING MODELS",
      headline: "One-Time Build, Flat Monthly, or % Revenue Share.",
      description: "Choose the pricing model that fits your cash flow best: one-time setup fee, flat monthly retainer, or a performance % share of online orders for maximum trust.",
    },

    // 7. Exclusivity Lock
    exclusivityLock: {
      eyebrow: "Regional Exclusivity",
      headline: "We Limit New Onboarding to 2 Local Businesses Per Month.",
      description: "To ensure absolute custom quality and 7-day launch speeds, we onboard strictly 2 local businesses per month per region. We partner with dedicated artisans and local operators who want to lead their category.",
    },

    // 8. Flexible & Honest Pricing Structure
    testimonials: {
      eyebrow: "TRANSPARENT PRICING",
      headline: "Flexible Pricing Models Tailored For Growth",
      subheadline: "Choose One-Time, Flat Monthly, or Performance % Revenue Share Alignment",
      guarantee: "Flexible Options · Absolute Alignment · Clear Contracts",
      
      cohortCard: {
        badge: "FLEXIBLE PARTNERSHIP MODELS",
        title: "Transparent Options for Berkshire & UK Businesses",
        paragraph1: "We believe pricing should match your business needs and cash flow. Choose from simple flat-rate setup fees, low monthly retainers, or a performance-aligned % share of online orders.",
        paragraph2: "We build high-performance systems for bakeries, food artisans, specialty food shops, and local service operators who want to eliminate manual admin drag and capture orders on autopilot.",
        paragraph3: "Full Supabase backend database integration, Stripe payment setup, and WhatsApp phone alerts included out of the box with zero hidden fees.",
        enquiryCtaText: "To discuss your custom build or test the live demo, request a 15-minute quick audit below.",
      },

      trustPoints: [
        "One-Time, Monthly or % Share Models",
        "Sub-1-Second Mobile PageSpeed",
        "Instant WhatsApp Order Alerts",
      ],
    },

    // 9. FOMO Close & CTA Section
    cta: {
      headline: "Ready to Automate Your Orders & Reviews?",
      subheadline: "We only onboard 2 new local businesses per region each month to maintain 7-day launch speeds. Book your 15-minute quick audit today and start capturing automated orders.",
      buttonText: "Book 15-Min Quick Audit",
    },

    // 10. FAQ Section
    faq: {
      eyebrow: "FAQ",
      headline: "Frequently Asked Questions",
      description: "Everything you need to know about our storefront build, order engine, and flexible pricing options.",
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
          question: "What pricing models do you offer?",
          answer: "We offer three flexible options: (1) One-Time Setup fee, (2) Flat Monthly Retainer including hosting & edits, or (3) Performance Revenue Share where we align directly with the revenue generated through your website.",
        },
        {
          question: "How fast can my new storefront be live?",
          answer: "Your complete mobile storefront, 3-tap order builder, and review engine are custom built, tested, and launched within 7 to 14 days under our Execution Protocol.",
        },
        {
          question: "Can I update seasonal flavors or menu items?",
          answer: "Yes! You get simple access to swap photos, update prices, or add seasonal specials (e.g., Easter, Christmas, Valentine's packs) in seconds. Our monthly retainer also includes complimentary edits handled by our team.",
        },
      ],
    },
  },

  // 4. Services Page Copy (`/services`)
  servicesPage: {
    headerTitle: "Automation Built for",
    headerHighlight: "Local Growth & Speed",
    headerSubtitle: "We build custom mobile storefronts, order builders, and automated messaging engines engineered to eliminate manual admin for bakeries, food artisans, and local service providers.",
    objectionCallout: "Traditional site builders take weeks and still force you to take orders on scrap paper. Our 7-Day Protocol delivers fully automated order engines ready for customer deposits.",
    
    // Services items
    list: [
      {
        title: "Sub-Second Mobile Storefronts",
        description: "Lightning-fast custom mobile storefronts that showcase your artisan creations or services in full resolution and load in under 1 second.",
        outcome: "Sub-1-Second Mobile Load Speed Capability",
        tagline: "High-Converting Mobile Presence.",
        overview: "Generic DIY site builders look cheap and lose up to 40% of mobile visitors due to 5+ second load times. We build lightning-fast, custom mobile storefronts engineered to capture local traffic and showcase your craft.",
        features: [
          { name: "Custom Artisan Visual Design", description: "Tailored styling aligned with your local brand identity, showcasing high-res food & service imagery." },
          { name: "Lightning Next.js Codebase", description: "Pure, high-performance web engineering delivering sub-1-second mobile speeds." },
          { name: "Local 3-Pack SEO Blueprint", description: "Semantic HTML and structured data schemas to boost your Google Maps ranking." },
          { name: "Instant Call & Directions CTAs", description: "Frictionless tap-to-call and tap-to-order buttons optimized for smartphone users." },
        ],
        ctaText: "Build My Storefront",
        ctaHref: "/book?service=storefront",
      },
      {
        title: "3-Tap Custom Order & Catering Builder",
        description: "Allow customers to choose cake sizes, flavors, dietary specs, service packages, and pay deposits in under 30 seconds online 24/7.",
        outcome: "24/7 Order & Deposit Collection",
        tagline: "Zero Lost Order Notes.",
        overview: "Stop scrawling custom orders on scrap paper during 6 AM prep shifts or spending evenings chasing bank transfers over text. Let your customers build custom orders and pay deposits online anytime.",
        features: [
          { name: "Interactive Spec Builder", description: "Dropdowns & toggles for cake sizing, dietary preferences, delivery dates, and custom notes." },
          { name: "Instant Stripe Deposit Gateways", description: "Securely collect 50% or 100% upfront deposits via Apple Pay, Google Pay, and credit cards." },
          { name: "Automated Calendar Slot Locking", description: "Automatically block booked dates so you never accidentally overbook a weekend." },
          { name: "Frictionless Customer Checkout", description: "3-tap mobile checkout designed to maximize completed bookings." },
        ],
        ctaText: "Setup Order Builder",
        ctaHref: "/book?service=order-builder",
      },
      {
        title: "Instant WhatsApp & Phone Notifications",
        description: "Receive instant notifications straight to your phone as soon as an order is paid—with full customer specs, event date, and deposit status.",
        outcome: "Real-Time Mobile Order Alerts",
        tagline: "Instant Order Triage.",
        overview: "No complicated dashboards or software to learn. You manage your business straight from your phone with real-time WhatsApp & SMS notifications delivered the instant an order or lead comes in.",
        features: [
          { name: "Instant WhatsApp Order Pings", description: "Complete order summary (Customer name, items, date, deposit paid) sent straight to your phone." },
          { name: "Instant Missed-Call SMS Back", description: "Auto-text customers who call while you are busy to capture the lead before they call a competitor." },
          { name: "Automated Order Status Updates", description: "1-tap status updates to notify customers when their bakery order is ready for pickup." },
          { name: "Zero Tech Hassle Setup", description: "We configure everything to send messages directly to your existing smartphone number." },
        ],
        ctaText: "Enable Phone Alerts",
        ctaHref: "/book?service=phone-alerts",
      },
      {
        title: "Automated 5-Star Google Review Engine",
        description: "Automatically follow up with happy customers via SMS/WhatsApp after pickup or service completion to dominate local Google Maps search.",
        outcome: "Automated 5-Star Reputation Engine",
        tagline: "Command Local Google Search.",
        overview: "Local customers choose businesses with 100+ 5-star Google reviews. Our automated review engine texts your satisfied customers right after pickup, building your Google Maps dominance on autopilot.",
        features: [
          { name: "Smart Timing Triggers", description: "Automated friendly text sent 2 hours after order pickup or job completion." },
          { name: "1-Tap Direct Google Review Link", description: "Takes customers directly to your Google review box in a single tap." },
          { name: "Private Feedback Filter", description: "Routes any issues privately to you first so you can resolve concerns before a public review is posted." },
          { name: "Continuous Reputation Growth", description: "Watch your 5-star Google review count grow automatically week after week." },
        ],
        ctaText: "Automate My Reviews",
        ctaHref: "/book?service=review-engine",
      },
    ],
  },

  // 5. Process Page Copy (`/process`)
  processPage: {
    headerTitle: "Our 7-Day Launch",
    headerHighlight: "Protocol",
    headerSubtitle: "A simple, stress-free 4-step process to get your automated mobile storefront live in under 7 to 14 days.",
    steps: [
      {
        number: "01",
        title: "15-Minute Operational Audit",
        sub: "Identifying your manual bottlenecks.",
        details: "We review your current order process, missed calls, and manual admin tasks to isolate where you are losing time and custom orders.",
        deliverable: "Custom Automation Roadmap",
      },
      {
        number: "02",
        title: "Design & Order Engine Setup",
        sub: "Building your custom mobile storefront.",
        details: "We build your lightning-fast mobile storefront, integrate your custom cake/catering order builder, and set up your instant deposit payment gateway.",
        deliverable: "Storefront & Order Builder Blueprint",
      },
      {
        number: "03",
        title: "WhatsApp & Review Engine Integration",
        sub: "Connecting automated phone alerts.",
        details: "We link order alerts directly to your WhatsApp/SMS phone number and configure automated 5-star Google review follow-up sequences.",
        deliverable: "Live Verified Messaging Pipeline",
      },
      {
        number: "04",
        title: "7-Day Launch & Ongoing Care",
        sub: "Going live with complete peace of mind.",
        details: "Your storefront goes live! We monitor traffic, order flows, and phone notifications to ensure seamless 24/7 operations.",
        deliverable: "Live Verified System & Support",
      },
    ],
  },

  // 6. Portfolio Page Copy (`/portfolio`)
  portfolioPage: {
    headerTitle: "Deployed System",
    headerHighlight: "Showcase",
    headerSubtitle: "A showcase of high-converting mobile storefronts and automated order engines engineered for bakeries, food artisans, and local service providers.",
    noticeTitle: "Client Privacy & Live System Demos",
    noticeDescription: "We build custom systems for independent bakeries, catering brands, and service operators. Request a live video walkthrough or interactive demo below.",
    constructionTitle: "Request Live Demo & Case Study",
    constructionDescription: "Want to see how our custom order builders and WhatsApp alert engines work live? Enter your details below for a quick video demonstration.",
    emailLabel: "Business Email",
    nameLabel: "Your Name",
    submitBtnText: "Request Video Demo",
    underConstructionText: "Request live system demo: ",
  },

  // 7. Pricing Page Copy (`/pricing`)
  pricingPage: {
    headerTitle: "Simple, Transparent",
    headerHighlight: "Pricing",
    headerSubtitle: "One upfront setup fee to build your custom storefront and order engine, plus a flat monthly retainer for hosting, WhatsApp alerts, and edits.",
    performanceSLATitle: "Transparent Pricing & Revenue Share",
    performanceSLASubtitle: "Flexible Options Built to Align With Your Business",
    performanceSLAParagraph: "We offer three transparent pricing structures: (1) One-Time Setup Fee, (2) Flat Monthly Retainer, or (3) Performance Revenue Share where we take a percentage of online sales generated through the website for total alignment.",
    roiCalculator: {
      eyebrow: "Admin Time Calculator",
      title: "Calculate Your Time & Revenue Saved",
      description: "Adjust the sliders below to see how many manual admin hours and lost orders an automated storefront can save your business every month.",
      annualTimeLabel: "Annual Admin Hours Saved",
      growthLiftLabel: "Est. Revenue Captured (+20%)",
      valueUnlockedLabel: "Total Annual Value Created",
      valueDisclaimer: "Calculated based on 10 hours/week saved at £25/hr + 20% conversion lift on custom orders & deposit capture.",
      recommendedLabel: "Recommended Solution:",
      recommendedSuffix: " Tier",
      applyBtnText: "Book 15-Min Quick Audit",
      currentRevenueLabel: "Current Monthly Revenue (£)",
      weeklyHoursLabel: "Weekly Hours Spent on Manual Admin",
    },
    billingToggleSetup: "One-Time Setup",
    billingToggleRetainer: "Monthly Retainer",
    billingToggleRevenueShare: "% Revenue Share",
    oneTimeTiers: [
      {
        name: "Essential Storefront",
        price: "495",
        interval: "one-time setup fee",
        milestoneBreakdown: "Complete build & launch within 7 days",
        description: "A complete custom mobile storefront and 24/7 lead capture system with zero recurring commitments.",
        features: [
          "3–5 Page Custom Mobile Storefront",
          "Local Search SEO Blueprint",
          "24/7 Lead Capture & Enquiry Builder",
          "Sub-1-Second Mobile PageSpeed",
          "100% Code Ownership & Zero Lock-in",
          "30 Days Included Technical Support",
        ],
        cta: "Select Essential Build",
        featured: false,
        tag: "One-Time Setup",
      },
      {
        name: "Pro Order Builder",
        price: "895",
        interval: "one-time setup fee",
        milestoneBreakdown: "Complete order engine & phone alerts in 7 days",
        description: "Custom cake & service order builder with instant deposit collection and automated WhatsApp phone alerts.",
        features: [
          "Everything in Essential Storefront",
          "Custom 3-Tap Cake & Service Booking Builder",
          "Instant Upfront Deposit Collection",
          "Instant WhatsApp & Email Order Alerts",
          "Secure Customer CRM Database Sync",
          "60 Days Included Technical Support",
        ],
        cta: "Select Pro Order Builder",
        featured: true,
        tag: "One-Time Setup",
      },
      {
        name: "Full Custom Build",
        price: "1,495",
        interval: "one-time setup fee",
        milestoneBreakdown: "Complete enterprise automation in 14 days",
        description: "Full multi-location storefront, custom workflow automations, and white-glove onboarding.",
        features: [
          "Everything in Pro Order Builder",
          "Multi-Service / Multi-Menu Custom Architecture",
          "Advanced Cloud CRM & Workflow Automations",
          "Custom Invoice & Payment Gateway Sync",
          "90 Days Technical Support & Staff Training",
          "Direct Founder Priority Support Desk",
        ],
        cta: "Select Custom Build",
        featured: false,
        tag: "One-Time Setup",
      },
    ],
    monthlyTiers: [
      {
        name: "Launch Support",
        price: "99",
        interval: "billed monthly (zero contract)",
        milestoneBreakdown: "Continuous speed & security monitoring",
        description: "Continuous hosting, speed audits, security, and menu/service edits to keep your site fast and up to date.",
        features: [
          "Ultra-Fast Managed Mobile Hosting & SSL",
          "Weekly Security & Speed Audits",
          "Complimentary Menu & Price Edits",
          "Monthly Lead & Booking Analytics",
          "24/7 Uptime & Order Engine Monitoring",
          "Same-Day Urgent Edits Turnaround",
        ],
        cta: "Select Launch Support",
        featured: false,
        tag: "Flat Monthly",
      },
      {
        name: "Growth & Edits",
        price: "195",
        interval: "billed monthly (zero contract)",
        milestoneBreakdown: "Active order engine & alert maintenance",
        description: "Includes active WhatsApp alert maintenance, workflow automation, and seasonal menu promotions.",
        features: [
          "Everything in Launch Support",
          "Active WhatsApp & Email Notification Pipeline",
          "Automated Deposit & Calendar Sync",
          "Seasonal Menus & Holiday Package Launches",
          "Unlimited Minor Content & Price Edits",
          "Dedicated Priority Support SLA (<4 Hours)",
        ],
        cta: "Select Growth & Edits",
        featured: true,
        tag: "Flat Monthly",
      },
      {
        name: "Full Managed Partner",
        price: "395",
        interval: "billed monthly (zero contract)",
        milestoneBreakdown: "Complete digital & automation management",
        description: "Complete digital & AI management for growing multi-location bakeries or local service teams.",
        features: [
          "Everything in Growth & Edits",
          "Workflow Automation Maintenance & Updates",
          "Custom Marketing & Lead Campaign Builds",
          "Unlimited Minor UI & Content Edits",
          "Direct Founder WhatsApp Support Desk",
          "Bi-Weekly Strategy & Growth Calls",
        ],
        cta: "Select Managed Partner",
        featured: false,
        tag: "Flat Monthly",
      },
    ],
    revenueShareTiers: [
      {
        name: "Starter Share",
        price: "5%",
        interval: "revenue share of website sales",
        milestoneBreakdown: "Low upfront risk alignment",
        description: "Small £195 setup deposit + a small 5% share of website sales generated.",
        features: [
          "Custom 3-Tap Mobile Storefront",
          "24/7 Lead Capture & Order Builder",
          "Instant Upfront Deposit Collection",
          "Instant WhatsApp & Email Order Alerts",
          "100% Skin-in-the-game Risk Alignment",
          "We Win When You Win",
        ],
        cta: "Select Starter Share",
        featured: false,
        tag: "% Revenue Share",
      },
      {
        name: "Pro Growth Share",
        price: "8%",
        interval: "revenue share of website sales",
        milestoneBreakdown: "Zero setup fee performance model",
        description: "Zero upfront setup fee. We build your entire order engine for 8% share of website sales.",
        features: [
          "Everything in Starter Share",
          "Zero Upfront Setup Fee",
          "Secure CRM Customer Database Sync",
          "Full Managed Hosting, Security & Edits",
          "Full Workflow Automation Pipeline",
          "Dedicated Growth SLA Support",
        ],
        cta: "Select Pro Growth Share",
        featured: true,
        tag: "% Revenue Share",
      },
      {
        name: "VIP Scale Partner",
        price: "10%",
        interval: "revenue share of website sales",
        milestoneBreakdown: "Full scale partnership & founder access",
        description: "Zero upfront fee. Complete high-volume order engine + direct founder growth strategy.",
        features: [
          "Everything in Pro Growth Share",
          "Zero Upfront Setup Fee",
          "Multi-Location & Custom Menu Architecture",
          "Custom AI & Lead Nurture Automation",
          "Direct Founder Priority WhatsApp Hotline",
          "Priority 1-on-1 Scale Strategy",
        ],
        cta: "Select VIP Scale Partner",
        featured: false,
        tag: "% Revenue Share",
      },
    ],
    get setupTiers() {
      return this.oneTimeTiers
    },
    get retainerTiers() {
      return this.monthlyTiers
    },
  },

  // 8. Contact Concierge Copy (`/contact`)
  contactPage: {
    headerTitle: "Get In",
    headerHighlight: "Touch",
    headerSubtitle: "Ready to eliminate manual admin drag and launch an automated mobile storefront? Reach out to our local automation team.",
    supportEyebrow: "Direct Support",
    supportTitle: "Local Support Desk",
    supportDescription: "No ticketing bots or long wait times. Speak directly with our lead automation developers.",
    emailLabel: "Email Support",
    phoneLabel: "Call or WhatsApp",
    slaLabel: "Response SLA",
    slaValue: "Under 12 Hours Guarantee",
    whatsNextTitle: "What Happens Next?",
    whatsNextItems: [
      "Quick response confirming receipt of your message.",
      "15-minute phone call to review your bakery or service workflow.",
      "Custom system demo and 7-day launch timeline.",
    ],
  },

  // 6. Cohort Status Page Copy (`/cohort-status`)
  testimonialsPage: {
    headerTitle: "Pricing Models &",
    headerHighlight: "Alignment",
    headerSubtitle: "Transparent pricing options: One-Time Build, Flat Monthly Retainer, or Performance % Revenue Share.",
  },

  // 9. Vetting Application Copy (`/book`)
  bookPage: {
    clinicalEvaluationLabel: "15-Minute Audit",
    headerTitle: "Schedule a",
    headerHighlight: "Quick Audit",
    headerSubtitle: "Pick a time for a brief 15-minute operational audit to see how an automated storefront can save you 10+ hours a week.",
    trustItems: [
      "15-minute quick telephone call",
      "No high-pressure sales pitch",
      "Strictly 2 onboarding slots per month"
    ],
    socialProofQuote: "Our 15-minute quick audit pinpoints your exact manual order friction so you can start taking automated deposits in 7 days.",
    socialProofAuthor: "Mercian Wealth Standard",
  },
}

