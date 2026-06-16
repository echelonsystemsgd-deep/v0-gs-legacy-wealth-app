import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Shield, Clock, Star } from "lucide-react"
import { BookingFlow } from "@/components/booking-flow"

export const metadata: Metadata = {
  title: "Book a Strategy Call",
  description:
    "Reserve your exclusive strategy session. Tell us about your brand and book a call — we'll pre-fill your details so you can focus on the conversation.",
}

const trustItems = [
  { icon: Clock, text: "30-min focused session" },
  { icon: Shield, text: "No obligation, no pressure" },
  { icon: Star, text: "Limited spots each month" },
]

export default function BookPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-gold/5 blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-accent-gold/3 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent" />
      </div>

      {/* Top Nav Bar */}
      <header className="relative z-10 border-b border-accent-gold/10 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 transition-transform group-hover:scale-105 duration-300">
              <Image
                src="/GS_Legacy_Wealth-removebg-preview.png"
                alt="GS Legacy Wealth"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent-gold hidden sm:block">
              GS Legacy Wealth
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-gold transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 xl:gap-20 items-start">

          {/* ---- Left Column: Page Header & Trust signals ---- */}
          <div className="lg:sticky lg:top-24 space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-gold">
                Strategy Session
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Let&apos;s Build{" "}
                <span className="text-gradient-gold">Your Legacy</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Complete the short qualifier below and choose a time that suits you. We review your
                brand before the call so every minute counts.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3">
              {trustItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-accent-gold" />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Social Proof Snippet */}
            <div className="glass rounded-2xl p-5 border border-accent-gold/15 space-y-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-accent-gold text-accent-gold" />
                ))}
              </div>
              <p className="text-sm text-foreground italic leading-relaxed">
                &ldquo;The strategy call alone was worth it — they identified conversion gaps I had
                missed for two years.&rdquo;
              </p>
              <p className="text-xs text-muted-foreground font-semibold">— Daniel K., Founder, Kensington Advisory</p>
            </div>

            {/* Decorative GS Monogram */}
            <div className="hidden lg:flex items-center gap-3 opacity-20 select-none pointer-events-none">
              <div className="h-px flex-1 bg-accent-gold/50" />
              <span className="font-serif text-4xl font-bold text-accent-gold">GS</span>
              <div className="h-px flex-1 bg-accent-gold/50" />
            </div>
          </div>

          {/* ---- Right Column: Booking Flow ---- */}
          <div>
            <BookingFlow />
          </div>
        </div>
      </div>
    </main>
  )
}
