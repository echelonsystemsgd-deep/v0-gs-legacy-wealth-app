"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const portfolioItems = [
  {
    title: "Elite Fitness Studio",
    category: "Gym Website",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "Prestige Properties",
    category: "Estate Agent Website",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Strategic Growth Co.",
    category: "Consultant Landing Page",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    title: "AutoFlow Systems",
    category: "AI Automation Dashboard",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
]

export function Portfolio() {
  return (
    <section id="portfolio" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Designed to </span>
            <span className="text-gradient-gold">Command Attention.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A selection of premium websites crafted for ambitious businesses.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-gold/10 hover:border-gold/30 transition-all duration-300"
            >
              <div className={`aspect-[16/10] bg-gradient-to-br ${item.gradient} relative`}>
                {/* Mockup Content */}
                <div className="absolute inset-4 lg:inset-6 bg-card rounded-xl border border-border overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border-b border-border">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gold/20 rounded w-2/3" />
                    <div className="h-3 bg-secondary rounded w-full" />
                    <div className="h-3 bg-secondary rounded w-4/5" />
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="h-12 bg-secondary rounded-lg" />
                      <div className="h-12 bg-secondary rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                <div className="glass rounded-xl p-4 flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gold mb-1">{item.category}</p>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 h-8 rounded-full border-gold/30 hover:bg-gold/10">
                    <span className="text-xs">View Case Study</span>
                  </Button>
                </div>
              </div>

              {/* Always visible on mobile */}
              <div className="sm:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent z-10">
                <p className="text-sm text-gold mb-1">{item.category}</p>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <Button size="sm" variant="outline" className="h-8 rounded-full w-full border-gold/30">
                  <span className="text-xs">View Case Study</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            variant="outline"
          >
            <Link href="#contact" className="flex items-center gap-2">
              Request a Custom Website
              <ArrowRight size={18} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
