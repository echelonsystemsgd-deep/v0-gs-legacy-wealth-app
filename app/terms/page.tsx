import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Terms of Service",
  description: "Read our Terms of Service to understand your rights and obligations when using our solutions.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <PageHeader 
        title="Terms of"
        highlight="Service"
        subtitle="Last updated: May 23, 2026. Please read these terms carefully before utilizing our services."
      />
      <section className="relative pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto glass border border-gold/15 rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              By accessing our website and scheduling a strategy call, you agree to be bound by these Terms of Service. If you do not agree, you are prohibited from using or accessing our assets.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">2. Scope of Services</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              GS Legacy Wealth AI provides premium custom website build services, automation setups, and digital strategy consulting. Specific deliverables, post-launch support periods, and scaling systems are governed by separate signed client agreement contracts.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">3. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              All branding designs, layout codes, content, and proprietary systems created by GS Legacy Wealth AI remain our intellectual property until fully paid for and transferred to the client as specified in our client agreements.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">4. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              In no event shall GS Legacy Wealth AI be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising out of or related to your use of our platforms or strategies.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
