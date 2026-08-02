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
      defaultTitle: "LocalEngine AI | Automation & Mobile Storefronts for Local Businesses",
      titleTemplate: "%s | LocalEngine AI",
      description: "Custom digital storefronts, WhatsApp order alerts, and automated review engines built specifically for bakeries, food artisans, and local services."
    },
    home: {
      title: "LocalEngine AI | Automation & Mobile Storefronts for Bakeries & Local Services",
      description: "We eliminate manual admin for bakeries, food artisans, and local services. Sub-second mobile storefronts, instant WhatsApp order alerts, and 5-star Google review engines.",
    },
    services: {
      title: "Our Solutions | LocalEngine AI",
      description: "Custom order engines, instant WhatsApp notifications, and automated 5-star Google review systems for local businesses.",
    },
    process: {
      title: "Our Process | LocalEngine AI",
      description: "15-minute quick audit, custom build, thorough QA testing, and 7-day launch protocol.",
    },
    portfolio: {
      title: "Deployed Systems | LocalEngine AI",
      description: "A showcase of high-converting mobile storefronts and automated order engines built for independent businesses.",
    },
    pricing: {
      title: "Solutions & Pricing | LocalEngine AI",
      description: "Transparent pricing for bakeries, artisans, and local service providers. Simple setup + flat monthly retainer.",
    },
    testimonials: {
      title: "Pricing Models | LocalEngine AI",
      description: "Our flexible setup, monthly, and % revenue share models for local operators.",
    },
    contact: {
      title: "Get In Touch | LocalEngine AI",
      description: "Connect with LocalEngine AI. Let's discuss your bakery, food artisan, or local service automation needs.",
    },
    book: {
      title: "Schedule a 15-Min Quick Audit | LocalEngine AI",
      description: "Book a quick 15-minute operational audit to see how much manual admin time we can eliminate for your business.",
    },
  },

  // Navbar Component
  navbar: {
    logo: "LocalEngine AI",
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
        "Automated Bookings & Stripe Deposits",
        "Supabase CRM Database Integration",
        "Instant WhatsApp & Email Alerts (Make.com)",
      ]
    },

    // 1. Hero Section
    hero: {
      eyebrow: "WEB DESIGN, LEAD CAPTURE & WORKFLOW AUTOMATION FOR LOCAL BUSINESSES",
      headline: "Custom Web Design, Lead Capture & Automated CRM Systems Built for Local Growth.",
      subheadline: "We eliminate manual admin for bakeries, food artisans, and local service providers across Berkshire & the UK. From custom web design and 24/7 lead capture to automated WhatsApp order alerts and Supabase CRM database integration.",
      primaryCtaText: "Test Interactive Demo",
      secondaryCtaText: "View Solutions & Pricing",
      trustItems: [
        "Custom Mobile Web Design",
        "24/7 Lead Capture Builder",
        "Automated Bookings & Stripe Deposits",
        "Make.com WhatsApp & Email Alerts",
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

    // 4. LocalEngine AI Difference
    whyMercianWealth: {
      headline: "Built Specifically for Bakeries, Food Artisans & Local Services",
      description: "Traditional agencies charge thousands for static, slow websites that sit idle. We build complete automated storefronts powered by Supabase backend infrastructure and Stripe payments.",
      differentiators: [
        "Sub-1-Second Mobile Storefront — Lightning-fast custom mobile pages that showcase your artisan creations or services in full high resolution.",
        "Supabase Backend Infrastructure — Full cloud database integration securing customer orders, lead triage, and 100% data sovereignty.",
        "Stripe Payment & Deposit Collection — Collect 50% or 100% upfront deposits via Apple Pay, Google Pay, and cards before locking calendar slots.",
        "Instant WhatsApp Phone Alerts — Immediate notification on your phone with full order details (name, date, deposit paid) the second an enquiry arrives.",
        "Automated 5-Star Google Review Engine — Text happy customers after pickup or service completion to build 5-star Google Maps dominance on autopilot.",
      ],
      structuralRealityHeadline: "The Structural Reality",
      standardAgency: {
        title: "Standard Agency Model",
        items: [
          "Generic templates taking 2 to 3 months to launch.",
          "No backend database integration or instant deposit collection.",
          "No automated phone alerts or WhatsApp notifications.",
          "Ongoing monthly fees with zero order performance guarantee.",
        ],
      },
      mercianWealth: {
        title: "LocalEngine Automated Storefront",
        items: [
          "Custom sub-second mobile storefront built in 7 to 14 days.",
          "Full Supabase backend database & Stripe payment integration.",
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
    setupTiers: [
      {
        name: "One-Time Build",
        price: "495",
        interval: "one-time setup fee",
        milestoneBreakdown: "Complete build & launch within 7 days",
        description: "A complete custom mobile storefront and review engine with one flat upfront cost and zero recurring commitments.",
        features: [
          "3–5 Page Custom Next.js Mobile Storefront",
          "Local Google Maps SEO Blueprint",
          "Automated 5-Star Google Review Engine",
          "Sub-1-Second Mobile PageSpeed",
          "100% Code Ownership & Zero Lock-in",
          "30 Days Included Technical Support",
        ],
        cta: "Select One-Time Build",
        featured: false,
        tag: "One-Time Setup",
      },
      {
        name: "Flat Monthly Retainer",
        price: "195",
        interval: "billed monthly (zero contract)",
        milestoneBreakdown: "Complete order engine & phone alerts in 7 days",
        description: "Full custom storefront, custom cake/catering order builder, Stripe payment gateways, and active WhatsApp phone alerts.",
        features: [
          "Everything in One-Time Build",
          "Custom 3-Tap Cake & Catering Order Builder",
          "Stripe Deposit & Payment Gateways",
          "Instant WhatsApp & SMS Phone Notifications",
          "Dedicated Ultra-Fast CDN Hosting & SSL",
          "Unlimited Minor Menu & Price Edits",
        ],
        cta: "Select Monthly Retainer",
        featured: true,
        tag: "Flat Monthly",
      },
      {
        name: "Performance % Share",
        price: "5%",
        interval: "revenue share of website sales",
        milestoneBreakdown: "Full skin-in-the-game partnership",
        description: "Maximum trust & security alignment. We build your entire storefront and order system for a small setup deposit + a small % share of sales generated.",
        features: [
          "Everything in Flat Monthly Retainer",
          "Supabase Database & Real-Time Sync",
          "100% Alignment — We Win When You Win",
          "Full Managed Hosting, Security & Edits",
          "Custom AI Chat Concierge Included",
          "Direct Founder Priority WhatsApp Line",
        ],
        cta: "Select Revenue Share",
        featured: false,
        tag: "% Revenue Share",
      },
    ],
    retainerTiers: [
      {
        name: "Launch Support",
        price: "99",
        interval: "billed monthly",
        description: "Continuous hosting, speed audits, security, and menu/service edits to keep your site fast and up to date.",
        features: [
          "Ultra-Fast Mobile CDN Hosting",
          "Weekly Security & Speed Audits",
          "Complimentary Menu & Price Edits",
          "Monthly Google Maps & Review Reports",
          "24/7 Uptime & Order Engine Monitoring",
          "Same-Day Urgent Edits Turnaround",
        ],
        cta: "Select Retainer",
        featured: false,
        tag: "Launch Support",
      },
      {
        name: "Growth & Edits",
        price: "195",
        interval: "billed monthly",
        description: "Includes active WhatsApp alert maintenance, review engine automation, and seasonal menu promotions.",
        features: [
          "Everything in Launch Support",
          "Active WhatsApp & SMS Notification Pipeline",
          "Automated Google Review Follow-Up Engine",
          "Seasonal Menus & Holiday Package Launches",
          "Dedicated Priority Support SLA (<4 Hours)",
        ],
        cta: "Select Retainer",
        featured: true,
        tag: "Growth & Edits",
      },
      {
        name: "Full Managed Partner",
        price: "395",
        interval: "billed monthly",
        description: "Complete digital & AI management for growing multi-location bakeries or local service teams.",
        features: [
          "Everything in Growth & Edits",
          "AI Chat Concierge Maintenance & Updates",
          "Custom Marketing & Lead Campaign Builds",
          "Unlimited Minor UI & Content Edits",
          "Direct Founder WhatsApp Support Desk",
        ],
        cta: "Select Retainer",
        featured: false,
        tag: "Managed Partner",
      },
    ],
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
    socialProofAuthor: "LocalEngine AI Standard",
  },
}

