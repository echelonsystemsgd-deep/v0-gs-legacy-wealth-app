import type { Metadata } from "next"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { ArrowLeft, Shield, Clock, Star } from "lucide-react"
import { BookingFlow } from "@/components/booking-flow"
import { FAQHome } from "@/components/faq-home"
import { SITE_COPY } from "@/lib/site-copy"

export const metadata: Metadata = {
  title: SITE_COPY.metadata.book.title,
  description: SITE_COPY.metadata.book.description,
}

export default function BookPage() {
  const data = SITE_COPY.bookPage
  const icons = [Clock, Shield, Star]
  const trustItems = data.trustItems.map((text, idx) => ({
    icon: icons[idx] || Star,
    text
  }))

  return (
    <main className="min-h-screen bg-[#020E28] relative overflow-hidden text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DAA640]/30 to-transparent" />
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-[#DAA640]/5 blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-[#DAA640]/3 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#DAA640]/20 to-transparent" />
      </div>

      {/* Top Nav Bar */}
      <header className="relative z-10 border-b border-[#DAA640]/15 bg-[#020E28]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl overflow-hidden border border-[#DAA640]/30 shadow-md">
              <BrandLogo variant="logo" alt="Mercian Wealth" fill className="object-cover transition-transform group-hover:scale-105 duration-300" priority />
            </div>
            <span className="font-sans text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 hidden sm:flex">
              <span>Mercian</span>
              <span className="text-[#DAA640]">Wealth</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-[#DAA640] transition-colors font-medium"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 xl:gap-16 items-start">

          {/* ---- Left Column: Page Header & Trust signals ---- */}
          <div className="lg:sticky lg:top-24 space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#DAA640] font-mono">
                [ {data.clinicalEvaluationLabel} ]
              </p>
              <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                {data.headerTitle}{" "}
                <span className="text-[#DAA640]">{data.headerHighlight}</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {data.headerSubtitle}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3">
              {trustItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#07153B] border border-[#DAA640]/25 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-[#DAA640]" />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Social Proof Snippet */}
            <div className="rounded-2xl p-5 border border-[#DAA640]/20 bg-[#07153B] space-y-3 shadow-lg">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-[#DAA640] text-[#DAA640]" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                "{data.socialProofQuote}"
              </p>
              <p className="text-xs text-[#DAA640] font-semibold font-mono">— {data.socialProofAuthor}</p>
            </div>

            {/* Decorative Mercian Monogram */}
            <div className="hidden lg:flex items-center gap-3 opacity-30 select-none pointer-events-none">
              <div className="h-px flex-1 bg-[#DAA640]/50" />
              <span className="font-sans text-xs font-bold tracking-widest uppercase text-[#DAA640]">Mercian Wealth</span>
              <div className="h-px flex-1 bg-[#DAA640]/50" />
            </div>
          </div>

          {/* ---- Right Column: Booking Flow ---- */}
          <div className="space-y-4">
            {/* GDPR / Data Notice */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-[#DAA640]/20 bg-[#07153B]">
              <Shield size={14} className="text-[#DAA640] mt-0.5 shrink-0" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Your details are encrypted and securely processed. We do not sell your data. See our{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-2 hover:text-[#DAA640] transition-colors text-white"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
            <BookingFlow />
          </div>

        </div>

        {/* Objections Handling FAQ Section */}
        <div className="mt-20 border-t border-slate-800 pt-16">
          <FAQHome />
        </div>
      </div>
    </main>
  )
}
