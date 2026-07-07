import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Bottleneck } from "@/components/bottleneck"
import { CommodityTrap } from "@/components/commodity-trap"
import { WhyGSLegacy } from "@/components/why-gs-legacy"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { FAQHome } from "@/components/faq-home"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { getPricingTiers } from "@/lib/pricing"

export const revalidate = 60

export default async function Home() {
  const { setupTiers, retainerTiers } = await getPricingTiers()
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://gslegacywealth.com/#organization",
                "name": "GS Legacy Wealth AI",
                "url": "https://gslegacywealth.com",
                "logo": {
                  "@type": "ImageObject",
                  "@id": "https://gslegacywealth.com/#logo",
                  "url": "https://gslegacywealth.com/GS_Legacy_Wealth-removebg-preview.png",
                  "caption": "GS Legacy Wealth AI"
                },
                "image": {
                  "@id": "https://gslegacywealth.com/#logo"
                },
                "sameAs": [
                  "https://instagram.com/gslegacywealth",
                  "https://www.linkedin.com/in/gs-legacy-wealth"
                ]
              },
              {
                "@type": "WebSite",
                "@id": "https://gslegacywealth.com/#website",
                "url": "https://gslegacywealth.com",
                "name": "GS Legacy Wealth AI",
                "description": "Custom digital systems and autonomic AI architectures engineered to secure category dominance for market leaders.",
                "publisher": {
                  "@id": "https://gslegacywealth.com/#organization"
                }
              },
              {
                "@type": "WebPage",
                "@id": "https://gslegacywealth.com/#webpage",
                "url": "https://gslegacywealth.com",
                "name": "GS Legacy Wealth AI | Luxury AI-Powered Websites",
                "isPartOf": {
                  "@id": "https://gslegacywealth.com/#website"
                },
                "about": {
                  "@id": "https://gslegacywealth.com/#organization"
                },
                "description": "Custom digital systems and autonomic AI architectures engineered to secure category dominance for market leaders. Vetted partnerships only."
              }
            ]
          })
        }}
      />
      <Navbar />
      <Hero />
      <Bottleneck />
      <CommodityTrap />
      <WhyGSLegacy />
      <Testimonials />
      <Pricing isHomepage={true} setupTiers={setupTiers} retainerTiers={retainerTiers} />
      <FAQHome />
      <CTA />
      <Footer />
    </main>
  )
}
