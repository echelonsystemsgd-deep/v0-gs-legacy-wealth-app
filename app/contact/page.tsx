import { Navbar } from "@/components/navbar"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Mail, Phone, Clock, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Contact Us",
  description: "Connect with GS Legacy Wealth. Let's discuss your brand, AI automation requirements, and premium web systems.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <PageHeader 
        title="Contact"
        highlight="Concierge"
        subtitle="Let's build your digital authority and automate operations. Get in touch with our elite engineering team."
      />

      <section className="relative pb-24 lg:pb-32 overflow-hidden bg-[#0A0A0A]">
        {/* Background elements */}
        <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Direct Contacts */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                  Elite Support
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                  Direct Concierge Desk
                </h2>
                <p className="text-[#F0EDE6] opacity-70 text-sm leading-relaxed max-w-md">
                  We don't use generic support tickets or ticketing bots. You deal directly with our founders and core technical team.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Email */}
                <div className="p-5 bg-[#130D24]/30 border border-white/5 hover:border-[#C9A227]/30 transition-all duration-300 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 border border-primary/20 text-[#C9A227] shrink-0 mt-0.5">
                    <Mail size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#A39E96]">Email Concierge</p>
                    <a href="mailto:gslegacywealth@gmail.com" className="text-sm font-semibold text-white hover:text-[#C9A227] transition-colors font-mono">
                      gslegacywealth@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="p-5 bg-[#130D24]/30 border border-white/5 hover:border-[#C9A227]/30 transition-all duration-300 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 border border-primary/20 text-[#C9A227] shrink-0 mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#A39E96]">Direct Call / WhatsApp</p>
                    <a href="tel:+447700900077" className="text-sm font-semibold text-white hover:text-[#C9A227] transition-colors font-mono">
                      +44 7700 900077
                    </a>
                  </div>
                </div>

                {/* Response SLA */}
                <div className="p-5 bg-[#130D24]/30 border border-white/5 hover:border-[#C9A227]/30 transition-all duration-300 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 border border-primary/20 text-[#C9A227] shrink-0 mt-0.5">
                    <Clock size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#A39E96]">Average Response SLA</p>
                    <p className="text-sm font-semibold text-white">
                      Under 12 Hours Guarantee
                    </p>
                  </div>
                </div>
              </div>

              {/* What to expect list */}
              <div className="border-t border-white/10 pt-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A227]">What Happens Next?</h4>
                <ul className="space-y-2.5 text-xs text-[#F0EDE6] opacity-75">
                  <li className="flex items-center gap-2">
                    <span className="text-[#C9A227]">✦</span> Initial reply confirming receipt of details.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#C9A227]">✦</span> Quick technical assessment of your current website/systems.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#C9A227]">✦</span> A free 20-minute strategy call to design your automation opportunity map.
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
