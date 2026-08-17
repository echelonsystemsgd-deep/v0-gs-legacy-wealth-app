/**
 * lib/site-copy.ts
 *
 * Centralized Copy Registry for mercianwealth.com
 *
 * Universal Local Business Copy Standard.
 */

export const SITE_COPY = {
  // Global Meta Info
  metadata: {
    layout: {
      defaultTitle: "Mercian Wealth | AI Websites & Automated Storefronts for UK Local Businesses",
      titleTemplate: "%s | Mercian Wealth",
      description: "Automated storefronts, instant WhatsApp alerts & 24/7 deposit capture for bakeries, caterers & local UK businesses. Stop losing bookings to missed calls. From £495."
    },
    home: {
      title: "Mercian Wealth | AI Websites & Automated Storefronts for UK Local Businesses",
      description: "Automated storefronts, instant WhatsApp alerts & 24/7 deposit capture for bakeries, caterers & local UK businesses. Stop losing bookings to missed calls. From £495.",
    },
    services: {
      title: "Automated Systems & Services | Mercian Wealth",
      description: "Mobile storefronts, 24/7 instant booking, deposit capture, phone notifications, and automated 5-star review collection.",
    },
    process: {
      title: "7-Day Launch Protocol | Mercian Wealth",
      description: "From our first 15-minute diagnostic call to live automated deposit collection in 7 days. Zero operational hassle.",
    },
    portfolio: {
      title: "Interactive Prototypes & Case Studies | Mercian Wealth",
      description: "Test drive live interactive sandbox builds and explore custom web automation architectures engineered for UK businesses.",
    },
    pricing: {
      title: "Transparent Pricing & Retainer Models | Mercian Wealth",
      description: "Simple, transparent pricing with zero hidden fees. One upfront setup fee, flat monthly growth retainer, or revenue share.",
    },
    testimonials: {
      title: "Client Case Studies & Verified Deliverables | Mercian Wealth",
      description: "Verified performance metrics, client case studies, and quantifiable operational outcomes from automated storefront implementations across the UK.",
    },
    contact: {
      title: "Contact Our Engineering Team | Mercian Wealth",
      description: "Stop letting missed calls and manual admin hold your business back. Request your free 15-minute diagnostic audit today.",
    },
    book: {
      title: "Book Your Free 15-Minute Audit | Mercian Wealth",
      description: "Pick a 15-minute slot with our founder to find out exactly where your business is losing leads and time.",
    },
  },

  // Navbar Component
  navbar: {
    logo: "Mercian Wealth",
    links: [
      { label: "Services", href: "/services" },
      { label: "Process", href: "/process" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
    ctaText: "Book your free 15 minute audit",
    ctaHref: "/book",
  },

  // Homepage Sections
  homepage: {
    // 0. Live Telemetry Ticker
    telemetryTicker: {
      items: [
        "Missed calls while with clients?",
        "Enquiries lost in message threads?",
        "Competitors taking your local bookings?",
        "Stop losing leads while you work.",
      ]
    },

    // 1. Hero Section
    hero: {
      eyebrow: "AI AUTOMATION & WEBSITES FOR LOCAL BUSINESSES",
      headline: "AI-Powered Websites & Automated Systems That Capture Orders & Collect Deposits 24/7.",
      subheadline: "Stop leaving revenue on the table. We replace missed calls, buried DMs, and manual quote-chasing with automated mobile storefronts, 24/7 WhatsApp deposit engines, and instant phone alerts for local business owners who play to win.",
      primaryCtaText: "Claim Category Exclusivity & Free Audit",
      secondaryCtaText: "Test 3-Tap Order Demo",
      proofBadge: "24/7 Mobile Lead Capture & Automated Upfront Deposit Systems",
      trustItems: [
        "Sub-1-Second Lead Capture",
        "24/7 Automated Upfront Deposits",
        "Instant WhatsApp & SMS Alerts",
        "Automated 5-Star Google Reviews",
      ],
      unsureText: "Book your free 15 minute audit to see how many hours and lost jobs we can recover for your business →",
    },

    // Divergence Comparison (The Two-Path Mechanic)
    divergenceComparison: {
      eyebrow: "TERRITORIAL COMPETITION",
      headline: "Your local competitors are not waiting for you to finish your shift.",
      subheadline: "The choice is stark: keep scribbling quotes on scrap paper while competitors capture your clients, or deploy an automated system that secures the booking and collects the deposit for you.",
      pathConventional: {
        badge: "MANUAL SCRAMBLE (DEFENSIVE)",
        title: "The Paper & Scramble Method",
        subtitle: "Losing high-value clients to faster competitors while stuck working on job sites.",
        points: [
          "Missing 3–5 high-margin enquiries every week because you cannot pick up the phone.",
          "Waiting until late at night after a hard workday to reply to customer text messages.",
          "Text-chasing bank transfers for deposits instead of having payments locked upfront.",
          "0 Google reviews collected automatically, letting rivals dominate local search results.",
        ]
      },
      pathMercian: {
        badge: "AUTOMATED MONOPOLY (OFFENSIVE)",
        title: "The Mercian Growth Engine",
        subtitle: "Instant mobile booking, upfront deposit collection, and sub-1-second lead capture.",
        points: [
          "Client selects service & pays 50% deposit online 24/7 without you lifting a finger.",
          "Instant notification hits your phone with complete booking & payment details.",
          "Sub-1-second mobile load speed captures the lead before they view a rival's site.",
          "Automated 5-star review request sent 2 hours post-job to lock down local search.",
        ],
        ctaText: "Claim your free 15 minute audit →",
      }
    },

    // 2. Deficit Diagnostic
    bottleneck: {
      eyebrow: "REVENUE LEAKAGE",
      headline: "An unanswered call isn't an inconvenience—it's a donation to your biggest local competitor.",
      subheadline: "Every 10 minutes a lead waits for a reply, your odds of closing drop by 80%. Speed and automated convenience always win.",
      goldSlogan: "While rivals scramble with scrap paper and late-night texts, an automated storefront captures leads, takes deposits, and locks in revenue while you work.",
      systemMode: "Mode: ",
      modeAutomated: "Automated Storefront",
      modeManual: "Manual Scramble",
      triggerBtnActive: "Deactivate Automated System",
      triggerBtnInactive: "Activate Automated System",
      diagnosticLink: "Book your free 15 minute audit →",
      
      cards: [
        {
          title: "Unanswered Calls During Job Hours",
          description: "High-value clients call while you are busy on site. By the time you check your phone hours later, they have already paid someone else.",
        },
        {
          title: "Nighttime Bank Transfer Chasing",
          description: "Spending your evenings texting bank details for deposits instead of relaxing with your family after a hard workday.",
        },
        {
          title: "Zero Reviews While Competitors Surge",
          description: "Delivering outstanding work every day, but losing local market share because competitors have 100+ Google reviews collected automatically.",
        },
      ],
    },

    // 3. Commodity Trap
    commodityTrap: {
      eyebrow: "THE HARD TRUTH",
      headline: "Stop paying for passive websites that act like online business cards.",
      description: "Generic DIY websites look cheap until you realize how many thousands in revenue they bleed every month. Slow load speeds, hidden phone numbers, and zero deposit capabilities guarantee that your competitors win.",
    },

    // 4. Mercian Wealth Difference
    whyMercianWealth: {
      headline: "Built For Local Operators Who Play To Win.",
      description: "Your website should sell your services, lock in calendar dates with non-refundable deposits, and dominate your local area on autopilot.",
      differentiators: [
        "Instant Mobile Booking — Clients select options, choose dates, and pay deposits on their phones in under 30 seconds.",
        "Instant Phone Alerts — Full booking details delivered straight to your phone the moment a deposit is confirmed.",
        "Automatic 5-Star Review Engine — Collect glowing Google reviews from satisfied clients automatically after every job.",
      ],
      structuralRealityHeadline: "The Structural Choice",
      standardAgency: {
        title: "Standard Website Agency",
        items: [
          "Generic templates taking weeks or months to launch.",
          "No deposit collection or booking features.",
          "No instant phone notifications.",
          "Ongoing monthly fees for a site that sits idle.",
        ],
      },
      mercianWealth: {
        title: "Mercian Automated Storefront",
        items: [
          "Custom mobile storefront launched in 7 days.",
          "Upfront deposit collection built into checkout.",
          "Instant phone notification on every booking.",
          "Automated review requests sent after every job.",
        ],
      },
    },

    // 5. Trend Adaptation Statement
    trendAdaptation: {
      eyebrow: "ALWAYS UP TO DATE",
      headline: "Your Storefront Runs Smoothly While You Focus On Your Work.",
      description: "We handle hosting, security, and content updates in the background. Your mobile storefront stays fast, secure, and ready to capture clients 365 days a year.",
    },

    // 6. Model Hint
    modelHint: {
      eyebrow: "TRANSPARENT PRICING",
      headline: "Simple Options Built For Local Cash Flow.",
      description: "Choose the structure that fits your business best: one-time setup fee or flat monthly retainer with zero long-term commitments.",
    },

    // 7. Exclusivity Lock
    exclusivityLock: {
      eyebrow: "LOCAL CATEGORY LOCKOUT",
      headline: "We Only Partner With ONE Premier Business Per Category In Each Postcode.",
      description: "To ensure total market dominance, we enforce strict geographic territory limits. When we deploy our automated system for a trade, clinic, caterer, or local service in your town, we do not take on their local rivals. You either lock down your territory today or compete against our system tomorrow.",
    },

    // 8. Flexible & Honest Pricing Structure
    testimonials: {
      eyebrow: "TRANSPARENT PRICING",
      headline: "Simple Pricing Options Built For Growth",
      subheadline: "One Upfront Setup Fee or Flat Monthly Retainer",
      guarantee: "Clear Promises · No Long Contracts · Transparent Pricing",
      
      cohortCard: {
        badge: "LOCAL CATEGORY LOCKOUT PIPELINE",
        title: "Ruthless Efficiency Built For Local Business Cash Flow",
        paragraph1: "We build high-converting, automated storefronts for local trade and service operators who refuse to lose leads to missed calls or manual admin.",
        paragraph2: "Upfront Stripe deposit collection, sub-1-second mobile performance, instant WhatsApp alerts, and automated review engines included out of the box.",
        paragraph3: "Single upfront setup fee or transparent flat monthly retainer. Zero hidden costs or long-term lock-in contracts.",
        enquiryCtaText: "To discuss your custom build and check category availability in your area, book your free 15 minute audit below.",
      },

      trustPoints: [
        "Category Exclusivity Policy",
        "Sub-1-Second Mobile Page Speed",
        "Instant Phone Order Alerts",
      ],
    },

    // 9. FOMO Close & CTA Section
    cta: {
      headline: "The local businesses moving first in your area are locking up market share.",
      subheadline: "Book your 15-minute diagnostic call to analyze your lead leaks and claim your category slot before a local competitor takes it.",
      buttonText: "Claim Category Exclusivity & Free Audit",
    },

    // 10. FAQ Section
    faq: {
      eyebrow: "FAQ",
      headline: "Frequently Asked Questions",
      description: "Everything you need to know about our storefront build, deposit capture, and pricing options.",
      faqs: [
        {
          question: "Do I need to be tech-savvy to manage this?",
          answer: "No. Notifications arrive directly on the phone you already use every day. If you can open a text message, you can manage this.",
        },
        {
          question: "How do custom bookings and deposits work?",
          answer: "Clients select their service, date, and requirements on your site, paying a deposit before the booking is confirmed. You never hold a calendar spot for an unpaid job again.",
        },
        {
          question: "What pricing options do you offer?",
          answer: "We offer transparent options: (1) One-Time Setup fee, or (2) Flat Monthly Retainer including hosting and edits with zero contracts.",
        },
        {
          question: "How fast can my storefront be live?",
          answer: "Your complete mobile storefront and phone notification system are custom built, tested, and launched in 7 days.",
        },
        {
          question: "Can I update prices or service packages?",
          answer: "Yes! You can request price updates or service changes anytime, and complimentary edits are included in our support.",
        },
      ],
    },
  },

  // Services Page Copy (`/services`)
  servicesPage: {
    headerTitle: "Missed enquiries, unconfirmed bookings, and manual admin are costing you thousands.",
    headerHighlight: "Here is what changes.",
    headerSubtitle: "We replace manual scramble with an automated storefront that captures leads, collects deposits, and alerts your phone 24/7.",
    objectionCallout: "Traditional website builders take weeks and still force you to handle bookings manually. Our 7-day process delivers a complete system ready to collect deposits.",
    
    list: [
      {
        title: "Instant Mobile Storefronts",
        description: "90% of your local clients look for services on their mobile phones while on the move.",
        outcome: "Sub-1-Second Mobile Load Speed",
        tagline: "Turn Mobile Browsers Into Booked Clients.",
        overview: "Your site loads in under 1 second on any smartphone, establishing instant local authority and guiding visitors directly into booking.",
        features: [
          { name: "Mobile-First Design", description: "Tailored layout optimized for clients booking from smartphones." },
          { name: "Sub-1-Second Load Speed", description: "Loads instantly so visitors never bounce away to a competitor." },
          { name: "Local Search Optimization", description: "Built to help local customers find your business on Google." },
          { name: "Tap-to-Call & Tap-to-Book", description: "Frictionless buttons designed for fast mobile booking." },
        ],
        ctaText: "Book your free 15 minute audit",
        ctaHref: "/book",
      },
      {
        title: "Instant Booking & Deposit Collection",
        description: "No-shows and unconfirmed appointments drain your cash flow and waste valuable days.",
        outcome: "24/7 Online Booking & Deposit Capture",
        tagline: "Collect Deposits Before Jobs Are Reserved.",
        overview: "Clients choose their service, date, and requirements online 24/7, paying a deposit to confirm the booking before it hits your calendar.",
        features: [
          { name: "Interactive Option Selector", description: "Dropdowns for service specs, dates, and custom notes." },
          { name: "Upfront Deposit Payment", description: "Securely collect deposits via card, Apple Pay, or Google Pay." },
          { name: "Automatic Calendar Locking", description: "Blocks booked dates automatically so you never double-book." },
          { name: "3-Tap Mobile Checkout", description: "Fast checkout designed to maximize completed bookings." },
        ],
        ctaText: "Book your free 15 minute audit",
        ctaHref: "/book",
      },
      {
        title: "Instant Phone Notifications",
        description: "You shouldn't have to log into complex software to check if a booking came through.",
        outcome: "Real-Time Mobile Order Alerts",
        tagline: "Immediate Alert Straight To Your Phone.",
        overview: "The second a client books or pays a deposit, an instant text notification lands on your phone with the client's name, booking details, and deposit status.",
        features: [
          { name: "Instant Mobile Alerts", description: "Full booking details sent straight to your phone as soon as a deposit is paid." },
          { name: "Auto-Reply Message Back", description: "Sends an instant friendly text to customers who call while you are busy." },
          { name: "Simple Status Updates", description: "1-tap updates to notify clients when their booking or service is ready." },
          { name: "Zero Tech Hassle", description: "Messages arrive on the smartphone you already use every day." },
        ],
        ctaText: "Book your free 15 minute audit",
        ctaHref: "/book",
      },
      {
        title: "Automated 5-Star Google Review Engine",
        description: "Competitors with weaker service win business simply because they have more Google reviews.",
        outcome: "Automated Google Review Follow-Up",
        tagline: "Build 5-Star Search Rank On Autopilot.",
        overview: "An automated message invites satisfied clients to leave a 5-star Google review right after their service is completed, building your search rank automatically.",
        features: [
          { name: "Smart Follow-Up Trigger", description: "Friendly automated text sent right after service completion." },
          { name: "1-Tap Direct Google Review Link", description: "Takes clients directly to your Google review box in one tap." },
          { name: "Private Feedback Filter", description: "Routes any concerns privately to you first so you can resolve them." },
          { name: "Continuous Search Authority", description: "Watch your 5-star Google reviews grow automatically week after week." },
        ],
        ctaText: "Book your free 15 minute audit",
        ctaHref: "/book",
      },
    ],
  },

  // Process Page Copy (`/process`)
  processPage: {
    headerTitle: "You don't have months to wait for a website.",
    headerHighlight: "Live in 7 Days",
    headerSubtitle: "From our first 15-minute call to live automated deposits in 7 days. Zero hassle.",
    steps: [
      {
        number: "01",
        title: "Step 1: The 15-Minute Audit",
        sub: "Identifying manual time sinks.",
        details: "We review your current enquiry handling, missed calls, and booking process to pinpoint where you are losing time and revenue.",
        deliverable: "Custom Action Plan",
      },
      {
        number: "02",
        title: "Step 2: Custom Build & Deposit Setup",
        sub: "Building your mobile storefront.",
        details: "We build your mobile storefront and set up your deposit capture system so clients pay before bookings are reserved.",
        deliverable: "Storefront & Deposit Blueprint",
      },
      {
        number: "03",
        title: "Step 3: Phone Alert & Review Linkup",
        sub: "Connecting instant notifications.",
        details: "We link instant notifications straight to your phone and configure your automated Google review collector.",
        deliverable: "Live Verified Alert System",
      },
      {
        number: "04",
        title: "Step 4: Live Launch in 7 Days",
        sub: "Going live with complete peace of mind.",
        details: "Your system goes live! It begins capturing enquiries and taking deposits while you focus on running your business.",
        deliverable: "Live System & Ongoing Support",
      },
    ],
  },

  // Portfolio Page Copy (`/portfolio`)
  portfolioPage: {
    headerTitle: "See what an automated storefront looks like for local service businesses.",
    headerHighlight: "Built For Speed",
    headerSubtitle: "Engineered specifically for local service operators who need instant speed and zero admin drag.",
    noticeTitle: "Tailored To Your Booking Workflow",
    noticeDescription: "Every system is configured to match the exact booking workflow of a local business. Rather than browsing generic templates, book a 15-minute call to see a live demonstration of how automated bookings and instant phone alerts work.",
    constructionTitle: "Book A Live System Demo",
    constructionDescription: "Want to see how our instant booking engines and phone alert systems work live? Schedule a 15-minute audit call.",
    emailLabel: "Business Email",
    nameLabel: "Your Name",
    submitBtnText: "Book your free 15 minute audit",
    underConstructionText: "Request live demonstration: ",
  },

  // Pricing Page Copy (`/pricing`)
  pricingPage: {
    headerTitle: "One missed booking a week costs more than investing in a system that works.",
    headerHighlight: "Transparent Pricing",
    headerSubtitle: "Simple, transparent options with zero hidden fees. Pick the structure that fits your business cash flow.",
    performanceSLATitle: "Clear Guarantees & Honest Promises",
    performanceSLASubtitle: "We Back Our Work With Clear Promises",
    performanceSLAParagraph: "Your system is delivered live in 7 days, fully tested, with zero monthly lock-in contracts or hidden surprises.",
    roiCalculator: {
      eyebrow: "Time & Revenue Calculator",
      title: "Calculate Your Saved Hours & Recovered Bookings",
      description: "See how many manual admin hours and lost bookings an automated storefront can save your business every month.",
      annualTimeLabel: "Annual Admin Hours Saved",
      growthLiftLabel: "Est. Extra Bookings Captured (+20%)",
      valueUnlockedLabel: "Total Value Created",
      valueDisclaimer: "Calculated based on 10 hours/week saved + 20% conversion lift on booking & deposit capture.",
      recommendedLabel: "Recommended Solution:",
      recommendedSuffix: " Option",
      applyBtnText: "Book your free 15 minute audit",
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
        milestoneBreakdown: "Complete build & launch in 7 days",
        description: "A fast mobile storefront and lead capture system with zero recurring commitments.",
        features: [
          "3–5 Page Custom Mobile Storefront",
          "Local Search Optimization",
          "24/7 Lead Capture System",
          "Sub-1-Second Mobile Load Speed",
          "100% Code Ownership & Zero Lock-in",
          "30 Days Included Support",
        ],
        cta: "Book your free 15 minute audit",
        featured: false,
        tag: "One-Time Setup",
      },
      {
        name: "Pro Order Builder",
        price: "895",
        interval: "one-time setup fee",
        milestoneBreakdown: "Complete deposit engine & phone alerts in 7 days",
        description: "Custom booking builder with instant deposit collection and automated phone alerts.",
        features: [
          "Everything in Essential Storefront",
          "Online Booking & Upfront Deposit Capture",
          "Instant Phone Notifications",
          "Automated 5-Star Google Review Engine",
          "Customer Booking Database",
          "60 Days Included Support",
        ],
        cta: "Book your free 15 minute audit",
        featured: true,
        tag: "One-Time Setup",
      },
      {
        name: "Full Custom Build",
        price: "1,495",
        interval: "one-time setup fee",
        milestoneBreakdown: "Complete multi-service automation in 14 days",
        description: "Full multi-service storefront, custom quote calculators, and priority setup.",
        features: [
          "Everything in Pro Order Builder",
          "Multi-Service Architecture",
          "Custom Quote Calculators",
          "Advanced Booking Automation",
          "90 Days Technical Support & Staff Training",
          "Priority Support Desk",
        ],
        cta: "Book your free 15 minute audit",
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
        description: "Managed hosting, speed audits, security, and content edits to keep your site fast and up to date.",
        features: [
          "Managed Mobile Hosting & SSL Security",
          "Weekly Speed & Security Monitoring",
          "Complimentary Content & Price Edits",
          "Monthly Booking & Lead Reports",
          "24/7 System Uptime Monitoring",
          "Fast Urgent Edit Turnaround",
        ],
        cta: "Book your free 15 minute audit",
        featured: false,
        tag: "Flat Monthly",
      },
      {
        name: "Growth & Maintenance",
        price: "195",
        interval: "billed monthly (zero contract)",
        milestoneBreakdown: "Active booking & alert maintenance",
        description: "Includes phone notification maintenance, deposit system updates, and seasonal updates.",
        features: [
          "Everything in Launch Support",
          "Active Phone Notification System",
          "Deposit & Calendar Maintenance",
          "Seasonal Promotions & Special Package Launches",
          "Unlimited Content & Price Edits",
          "Dedicated Priority Support SLA (<4 Hours)",
        ],
        cta: "Book your free 15 minute audit",
        featured: true,
        tag: "Flat Monthly",
      },
      {
        name: "Full Managed Partner",
        price: "395",
        interval: "billed monthly (zero contract)",
        milestoneBreakdown: "Complete digital & automation management",
        description: "Complete digital management for growing local businesses or multi-location teams.",
        features: [
          "Everything in Growth & Maintenance",
          "Automation System Updates",
          "Custom Marketing & Campaign Builds",
          "Unlimited Minor UI & Content Edits",
          "Direct Founder Phone Support Hotline",
          "Bi-Weekly Growth Strategy Calls",
        ],
        cta: "Book your free 15 minute audit",
        featured: false,
        tag: "Flat Monthly",
      },
    ],
    revenueShareTiers: [
      {
        name: "Starter Option",
        price: "5%",
        interval: "revenue share of website sales",
        milestoneBreakdown: "Low upfront deposit alignment",
        description: "Small setup deposit + 5% share of website sales generated.",
        features: [
          "Custom Mobile Storefront",
          "24/7 Online Booking System",
          "Upfront Deposit Collection",
          "Instant Phone Notifications",
          "Shared Risk Alignment",
        ],
        cta: "Book your free 15 minute audit",
        featured: false,
        tag: "% Revenue Share",
      },
      {
        name: "Pro Growth Option",
        price: "8%",
        interval: "revenue share of website sales",
        milestoneBreakdown: "Performance alignment model",
        description: "Full booking system build for 8% share of website sales.",
        features: [
          "Everything in Starter Option",
          "Customer Booking Database",
          "Full Managed Hosting & Security",
          "Dedicated Priority Support",
        ],
        cta: "Book your free 15 minute audit",
        featured: true,
        tag: "% Revenue Share",
      },
      {
        name: "VIP Scale Option",
        price: "10%",
        interval: "revenue share of website sales",
        milestoneBreakdown: "Full scale partnership",
        description: "Complete high-volume order engine + direct founder strategy.",
        features: [
          "Everything in Pro Growth Option",
          "Multi-Service Architecture",
          "Direct Founder Phone Support",
        ],
        cta: "Book your free 15 minute audit",
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

  // Contact Concierge Copy (`/contact`)
  contactPage: {
    headerTitle: "Stop letting missed calls and manual admin hold your business back.",
    headerHighlight: "Get In Touch",
    headerSubtitle: "Have a question or ready to see how an automated storefront works for your business? Connect directly below.",
    supportEyebrow: "Direct Support",
    supportTitle: "Fast Response Support",
    supportDescription: "No ticketing bots or long wait times. Speak directly with our lead developers.",
    emailLabel: "Email Support",
    phoneLabel: "Call or WhatsApp",
    slaLabel: "Fast Response Guarantee",
    slaValue: "Replied Within A Few Business Hours",
    whatsNextTitle: "What Happens Next?",
    whatsNextItems: [
      "Quick confirmation that we received your message.",
      "Brief 15-minute call to review your current daily process.",
      "Clear demonstration showing how automated bookings work for your business.",
    ],
  },

  // Testimonials / Cohort Status Page Copy
  testimonialsPage: {
    headerTitle: "Real Results &",
    headerHighlight: "Verified Outcomes",
    headerSubtitle: "How local bakeries, trades, and service businesses capture deposits and save 10+ hours a week on autopilot.",
  },

  // Booking Page Copy (`/book`)
  bookPage: {
    clinicalEvaluationLabel: "Free 15-Minute Business Audit",
    headerTitle: "Find out exactly where your business is losing",
    headerHighlight: "leads and time.",
    headerSubtitle: "Pick a 15-minute slot on the calendar. We will review your current website, missed call process, and deposit system, and show you exactly what to fix.",
    trustItems: [
      "15-minute telephone call on your schedule",
      "Zero high-pressure sales pitch—just practical business answers",
      "Simple 7-day launch timeline"
    ],
    socialProofQuote: "On this 15-minute call, we will reveal the exact 3 adjustments that allow local service businesses in your area to capture deposits and 5-star reviews on autopilot without taking time away from their daily work.",
    socialProofAuthor: "Mercian Wealth Standard",
  },
}
