"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card via-background to-background" />
      
      {/* Gold gradient orbs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2" />
      
      {/* Large faded logo watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] opacity-[0.02]">
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-serif text-[300px] font-bold text-gold">GS</span>
          </div>
        </div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-gold/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-balance">
            <span className="text-foreground">Your Website Should Build Authority </span>
            <span className="text-gradient-gold">While You Sleep.</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Position your business like a premium brand with AI-powered design and automation. 
            Let&apos;s create a digital asset that works for you 24/7.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-8 mx-auto max-w-xl"
          >
            <div className="glass rounded-3xl p-6 md:p-8 text-left border border-gold/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <div className="w-32 h-32 rounded-full border-4 border-gold border-dashed animate-[spin_10s_linear_infinite]" />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shadow-lg">
                  <span className="font-serif font-bold text-background">GS</span>
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground text-lg">AI Concierge</h3>
                  <p className="text-xs text-gold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Online & Ready
                  </p>
                </div>
              </div>
              
              <div className="bg-background/50 rounded-2xl p-5 mb-6 border border-border/50">
                <p className="text-sm md:text-base text-foreground leading-relaxed">
                  "Hello. Let our AI analyze your current brand and architecture. We'll identify exactly where you're losing high-ticket conversions and build a custom strategy to scale."
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  variant="default"
                  className="flex-1 text-base py-6 shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                >
                  <Link href="https://calendly.com" target="_blank" className="flex items-center justify-center gap-2">
                    Start Free Analysis
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base py-6 border-gold/20 hover:bg-gold/5"
                >
                  <Link href="#portfolio" className="flex items-center justify-center">
                    See Examples
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          <p className="text-sm text-muted-foreground">
            Limited spots available. We only work with select clients each month.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
