"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Copy */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5"
              >
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-accent">The Digital Legacy Architect</span>
              </motion.div>

              <h1 className="font-serif text-3xl min-[360px]:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-balance">
                <span className="text-foreground">Luxury Websites Built to </span>
                <span className="text-gradient-gold">Scale Your Business.</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                AI-powered websites and automated systems designed to increase authority, 
                attract premium clients, and turn attention into revenue.
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="default"
                  className="text-base px-8 py-6 active:scale-95 transition-transform"
                >
                  <Link href="/book" className="flex items-center gap-2">
                    Book Your Free Strategy Call
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 active:scale-95 transition-transform"
                >
                  <Link href="/book">Get Free AI Website Audit</Link>
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Trusted by 50+ premium brands</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="relative glass rounded-3xl p-8">
                {/* Laptop Mockup */}
                <div className="relative bg-card rounded-xl border border-border overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-6 bg-secondary rounded-md flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">gslegacywealth.ai</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="h-8 bg-gradient-to-r from-primary/20 to-transparent rounded w-3/4" />
                    <div className="h-4 bg-secondary rounded w-full" />
                    <div className="h-4 bg-secondary rounded w-5/6" />
                    <div className="grid grid-cols-3 gap-3 pt-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-secondary rounded-lg border border-border" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
