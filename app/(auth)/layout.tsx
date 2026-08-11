import type { Metadata } from 'next'
import Link from 'next/link'
import { BrandLogo } from '@/components/brand-logo'

export const metadata: Metadata = {
  title: 'Secure Access',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Logo Header */}
        <div className="flex flex-col items-center gap-3">
          <Link href="/" className="group flex flex-col items-center gap-3 cursor-pointer" aria-label="Back to Homepage">
            <div className="relative h-16 w-16 transition-transform group-hover:scale-105 duration-300 rounded-2xl bg-black/40 p-2.5 shadow-xl border border-gold/30 flex items-center justify-center">
              <BrandLogo
                variant="logo"
                alt="Mercian Wealth"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent-gold">
                SECURE GATEWAY
              </p>
              <h1 className="font-sans text-xl font-extrabold text-white flex items-center justify-center gap-1.5">
                <span className="text-[#38BDF8]">Mercian</span>
                <span className="text-[#F59E0B]">Wealth</span>
              </h1>
            </div>
          </Link>
        </div>

        {children}
      </div>
    </main>
  )
}
