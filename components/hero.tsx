"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Bot, Smartphone, Zap, Target, ArrowRight } from "lucide-react"
import Link from "next/link"

const trustIndicators = [
  { icon: Bot, label: "AI Powered" },
  { icon: Smartphone, label: "Mobile Optimised" },
  { icon: Zap, label: "Fast Delivery" },
  { icon: Target, label: "Conversion Focused" },
]

function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => {
        // Deterministic position and animations based on index to prevent SSR hydration mismatch
        const left = `${(i * 17) % 100}%`
        const top = `${(i * 23) % 100}%`
        const delay = (i * 0.37) % 2
        const duration = 4 + ((i * 0.73) % 2)
        const xOffset = ((i * 29) % 20) - 10
        // Hide particles index >= 8 on mobile to boost performance
        const isMobileHidden = i >= 8

        return (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full bg-gold/30 ${isMobileHidden ? "hidden md:block" : ""}`}
            style={{
              left,
              top,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, xOffset, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
            }}
          />
        )
      })}
    </div>
  )
}

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
      <GoldParticles />

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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5"
              >
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-sm text-gold">The Digital Legacy Architect</span>
              </motion.div>

              <h1 className="font-serif text-3xl min-[360px]:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-balance">
                <span className="text-foreground">Luxury Websites Built to </span>
                <motion.span 
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="text-gradient-gold bg-[length:200%_auto]"
                >
                  Scale Your Business.
                </motion.span>
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
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] text-gold font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>Trusted by 50+ 7-figure brands</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              {trustIndicators.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <item.icon size={18} className="text-gold" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold-light/10 rounded-3xl blur-3xl" />
              
              {/* Main Card */}
              <div className="relative glass rounded-3xl p-8 border border-gold/20">
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
                    <div className="h-8 bg-gradient-to-r from-gold/20 to-transparent rounded w-3/4" />
                    <div className="h-4 bg-secondary rounded w-full" />
                    <div className="h-4 bg-secondary rounded w-5/6" />
                    <div className="grid grid-cols-3 gap-3 pt-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-secondary rounded-lg border border-gold/10" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute hidden sm:block -top-6 -right-6 glass rounded-2xl p-4 border border-gold/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                      <Bot size={20} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">AI Assistant</p>
                      <p className="text-xs text-gold">Active</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute hidden sm:block -bottom-4 -left-4 glass rounded-xl p-3 border border-gold/30"
                >
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-gold" />
                    <span className="text-xs text-muted-foreground">98% Performance</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
