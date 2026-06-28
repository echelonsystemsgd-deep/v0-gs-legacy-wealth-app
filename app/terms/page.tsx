import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Scale, FileText, Award, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react"

export const metadata = {
  title: "Terms of Service",
  description: "Read our Terms of Service to understand your rights and obligations when using our solutions.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms of Service",
            "description": "Read our Terms of Service to understand your rights and obligations when using our solutions.",
            "url": "https://gslegacywealth.com/terms"
          })
        }}
      />
      <Navbar />
      <PageHeader 
        title="Terms of"
        highlight="Service"
        subtitle="Last updated: May 23, 2026. Please read these terms carefully before utilizing our services."
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
                Plain English Summary of Commitments
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 text-xs leading-relaxed text-text-primary/95">
              <div className="space-y-2 p-4 rounded-xl bg-[#1A0A2E]/20 border border-white/5 hover:border-accent-gold/20 transition-all duration-300">
                <p className="font-semibold text-accent-gold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-accent-gold shrink-0" /> 100% IP Transfer
                </p>
                <p className="opacity-80">
                  You own completed Next.js frontend code, design files, and database schemas upon milestone finalization.
                </p>
              </div>
              <div className="space-y-2 p-4 rounded-xl bg-[#1A0A2E]/20 border border-white/5 hover:border-accent-gold/20 transition-all duration-300">
                <p className="font-semibold text-accent-gold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-accent-gold shrink-0" /> Milestone Safeguards
                </p>
                <p className="opacity-80">
                  Clear billing checkpoints divided into milestones linked directly to validated build sign-offs.
                </p>
              </div>
              <div className="space-y-2 p-4 rounded-xl bg-[#1A0A2E]/20 border border-white/5 hover:border-accent-gold/20 transition-all duration-300">
                <p className="font-semibold text-accent-gold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-accent-gold shrink-0" /> Post-Launch Warranty
                </p>
                <p className="opacity-80">
                  Active system support parameters for telemetry auditing, design adjustments, and AI fine-tuning.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="p-3 border border-accent-gold/20 bg-accent-gold/5 text-accent-gold rounded-xl shrink-0 mt-1">
              <Scale className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">1. Agreement to Terms</h2>
              <p className="text-text-primary opacity-80 leading-relaxed text-sm sm:text-base">
                By accessing our website and scheduling a strategy call, <span className="text-white font-semibold">you agree to be bound by these Terms of Service</span>. If you do not agree with any of these terms, you are prohibited from using or accessing our assets, platforms, and services.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="p-3 border border-accent-gold/20 bg-accent-gold/5 text-accent-gold rounded-xl shrink-0 mt-1">
              <FileText className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">2. Scope of Services</h2>
              <p className="text-text-primary opacity-80 leading-relaxed text-sm sm:text-base">
                GS Legacy Wealth AI provides custom high-performance website build services, CRM automation pipelines, and digital strategy consulting. Specific deliverables, build phases, and support scopes are <span className="text-white font-semibold">governed by separate signed client agreement contracts</span> customized for each project.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="p-3 border border-accent-gold/20 bg-accent-gold/5 text-accent-gold rounded-xl shrink-0 mt-1">
              <Award className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">3. Intellectual Property</h2>
              <p className="text-text-primary opacity-80 leading-relaxed text-sm sm:text-base">
                All branding designs, layout codes, content, and proprietary systems created by GS Legacy Wealth AI <span className="text-white font-semibold">remain our intellectual property until fully paid for and officially transferred to the client</span> as specified in our client agreements. Upon completion, you receive full license and ownership.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="p-3 border border-accent-gold/20 bg-accent-gold/5 text-accent-gold rounded-xl shrink-0 mt-1">
              <ShieldAlert className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">4. Limitation of Liability</h2>
              <p className="text-text-primary opacity-80 leading-relaxed text-sm sm:text-base">
                <span className="text-white font-semibold">In no event shall GS Legacy Wealth AI be liable for any indirect, incidental, special, consequential, or punitive damages</span> (including loss of profits, data, or business opportunities) arising out of or related to your use of our platforms, automation strategies, or consulting assets.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
