import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

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
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <Link href="/" className="group">
            <div className="relative h-16 w-16 transition-transform group-hover:scale-105 duration-300 rounded-2xl overflow-hidden shadow-lg border border-gold/30">
              <Image
                src="/MercianWealthLogo.jpeg"
                alt="Mercian Wealth"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>
          <div className="text-center">
            <p className="text-xxs font-bold uppercase tracking-[0.3em] text-gold/70">
              Secure Gateway
            </p>
            <h1 className="font-serif text-xl font-bold text-foreground mt-1">
              Mercian Wealth
            </h1>
          </div>
        </div>

        {children}
      </div>
    </main>
  )
}
