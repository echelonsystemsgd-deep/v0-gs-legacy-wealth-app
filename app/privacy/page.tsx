import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Privacy Policy | GS Legacy Wealth AI",
  description: "Our privacy policy outlines how we handle and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <PageHeader 
        title="Privacy"
        highlight="Policy"
        subtitle="Last updated: May 23, 2026. This policy explains how we collect, use, and safeguard your data."
      />
      <section className="relative pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto glass border border-gold/15 rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              We collect information that you provide to us directly, such as when you request a website audit, book a strategy call, or communicate with our AI Concierge. This may include your name, email address, company details, and current website URL.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm sm:text-base">
              <li>Deliver custom luxury digital assets and automation solutions.</li>
              <li>Provide tailored website strategy assessments and conversion analysis.</li>
              <li>Improve our AI Concierge and scheduling flows.</li>
              <li>Send periodic updates and communications regarding your project.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">3. Information Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website or conducting our business, so long as those parties agree to keep this information confidential.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">4. Security</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
