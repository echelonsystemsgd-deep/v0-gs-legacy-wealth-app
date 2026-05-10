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
            className="pt-4"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-10 py-7"
            >
              <Link href="https://calendly.com" target="_blank" className="flex items-center gap-3">
                Book Your Free Strategy Call
                <ArrowRight size={20} />
              </Link>
            </Button>
          </motion.div>

          <p className="text-sm text-muted-foreground">
            Limited spots available. We only work with select clients each month.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
