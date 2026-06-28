import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Database, Cpu, Share2, Lock, Sparkles, CheckCircle2 } from "lucide-react"

export const metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy outlines how we handle and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy",
            "description": "Our privacy policy outlines how we handle and protect your personal information.",
            "url": "https://gslegacywealth.com/privacy"
          })
        }}
      />
      <Navbar />
      <PageHeader 
        title="Privacy"
        highlight="Policy"
        subtitle="Last updated: May 23, 2026. This policy explains how we collect, use, and safeguard your data."
      />
      <section className="relative pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto glass border border-accent-gold/15 rounded-3xl p-8 sm:p-12 space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
          
          {/* Trust Highlights Hero Block */}
          <div className="p-6 sm:p-8 rounded-2xl border border-accent-gold/25 bg-bg-secondary/40 shadow-[0_0_30px_rgba(201,162,39,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl" />
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-accent-gold w-5 h-5 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                Plain English Privacy Commitments
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 text-xs leading-relaxed text-text-primary/95">
              <div className="space-y-2 p-4 rounded-xl bg-[#1A0A2E]/20 border border-white/5 hover:border-accent-gold/20 transition-all duration-300">
                <p className="font-semibold text-accent-gold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-accent-gold shrink-0" /> 100% Confidentiality
                </p>
                <p className="opacity-80">
                  We never sell, rent, or trade your contact info or project details. Lead databases are private.
                </p>
              </div>
              <div className="space-y-2 p-4 rounded-xl bg-[#1A0A2E]/20 border border-white/5 hover:border-accent-gold/20 transition-all duration-300">
                <p className="font-semibold text-accent-gold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-accent-gold shrink-0" /> Zero Tracker Abuse
                </p>
                <p className="opacity-80">
                  No invasive ad scripts or profiling pixels. We only track core conversion events.
                </p>
              </div>
              <div className="space-y-2 p-4 rounded-xl bg-[#1A0A2E]/20 border border-white/5 hover:border-accent-gold/20 transition-all duration-300">
                <p className="font-semibold text-accent-gold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-accent-gold shrink-0" /> Secure Enclaves
                </p>
                <p className="opacity-80">
                  Data in transit is encrypted and client logs are isolated with PostgreSQL RLS security.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="p-3 border border-accent-gold/20 bg-accent-gold/5 text-accent-gold rounded-xl shrink-0 mt-1">
              <Database className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">1. Information We Collect</h2>
              <p className="text-text-primary opacity-80 leading-relaxed text-sm sm:text-base">
                <span className="text-white font-semibold">We collect information that you provide to us directly</span>, such as when you request a custom systems audit, register on our partner portal, or book an operational strategy alignment call. This may include your name, email, company metrics, and current website URL.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="p-3 border border-accent-gold/20 bg-accent-gold/5 text-accent-gold rounded-xl shrink-0 mt-1">
              <Cpu className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">2. How We Use Your Information</h2>
              <p className="text-text-primary opacity-80 leading-relaxed text-sm sm:text-base">
                We utilize the collected information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-primary opacity-80 text-sm sm:text-base">
                <li>Design and deploy <span className="text-white font-medium">custom luxury digital platforms and autonomic AI systems</span>.</li>
                <li>Conduct customized diagnostic assessments and code-level audits.</li>
                <li>Improve our proprietary AI Concierge logic and partner onboarding flows.</li>
                <li>Transmit technical deliverables and status telemetry alerts.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="p-3 border border-accent-gold/20 bg-accent-gold/5 text-accent-gold rounded-xl shrink-0 mt-1">
              <Share2 className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">3. Information Sharing and Disclosure</h2>
              <p className="text-text-primary opacity-80 leading-relaxed text-sm sm:text-base">
                <span className="text-white font-semibold">We do not sell, trade, or transfer your personally identifiable information to outside parties</span>. This strict guarantee excludes verified partners hosting database enclaves who adhere to absolute confidentiality agreements.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="p-3 border border-accent-gold/20 bg-accent-gold/5 text-accent-gold rounded-xl shrink-0 mt-1">
              <Lock className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">4. Security</h2>
              <p className="text-text-primary opacity-80 leading-relaxed text-sm sm:text-base">
                <span className="text-white font-semibold">We implement a variety of security measures to maintain the safety of your personal information</span>, including HTTPS transport encryption, database encryption at rest, and strict row-level authorization barriers.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
