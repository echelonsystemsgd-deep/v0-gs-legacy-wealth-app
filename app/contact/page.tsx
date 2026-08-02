import { Navbar } from "@/components/navbar"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Mail, Phone, Clock, ArrowRight } from "lucide-react"
import { CopyEmailButton } from "@/components/copy-email-button"

import { SITE_COPY } from "@/lib/site-copy"

export const metadata = {
  title: SITE_COPY.metadata.contact.title,
  description: SITE_COPY.metadata.contact.description,
}

export default function ContactPage() {
  const data = SITE_COPY.contactPage
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <PageHeader 
        title={data.headerTitle}
        highlight={data.headerHighlight}
        subtitle={data.headerSubtitle}
      />

      <section className="relative pb-24 lg:pb-32 overflow-hidden bg-bg-primary">
        {/* Background elements */}
        <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Direct Contacts */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
                  {data.supportEyebrow}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                  {data.supportTitle}
                </h2>
                <p className="text-text-primary opacity-70 text-sm leading-relaxed max-w-md">
                  {data.supportDescription}
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Email */}
                <CopyEmailButton email="mercianwealthgs@gmail.com" variant="card" />

                {/* Phone */}
                <div className="p-5 bg-bg-tertiary/30 border border-white/5 hover:border-accent-gold/30 rounded-xl transition-all duration-300 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-accent-gold shrink-0 mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{data.phoneLabel}</p>
                    <a href="tel:+447851055929" className="text-sm font-semibold text-white hover:text-accent-gold transition-colors font-mono">
                      +44 7851 055929
                    </a>
                    <a href="https://wa.me/447851055929?text=Hi%20Mercian%20Wealth,%20I'd%20like%20to%20inquire%20about%20your%20services." target="_blank" rel="noopener noreferrer" className="block text-xs text-accent-gold hover:underline mt-1">
                      Chat on WhatsApp →
                    </a>
                  </div>
                </div>

                {/* Response SLA */}
                <div className="p-5 bg-bg-tertiary/30 border border-white/5 hover:border-accent-gold/30 rounded-xl transition-all duration-300 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-accent-gold shrink-0 mt-0.5">
                    <Clock size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{data.slaLabel}</p>
                    <p className="text-sm font-semibold text-white">
                      {data.slaValue}
                    </p>
                  </div>
                </div>
              </div>

              {/* What to expect list */}
              <div className="border-t border-white/10 pt-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent-gold">{data.whatsNextTitle}</h4>
                <ul className="space-y-2.5 text-xs text-text-primary opacity-75">
                  <li className="flex items-center gap-2">
                    <span className="text-accent-gold">✦</span> {data.whatsNextItems[0]}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent-gold">✦</span> {data.whatsNextItems[1]}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent-gold">✦</span> {data.whatsNextItems[2]}
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7 w-full">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
