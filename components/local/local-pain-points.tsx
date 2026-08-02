"use client"

import { motion } from "framer-motion"
import { PhoneOff, MessageSquareX, TrendingDown, Clock, AlertTriangle } from "lucide-react"

const painPoints = [
  {
    icon: PhoneOff,
    title: "Unanswered Calls During Baking Hours",
    description: "You're kneading dough or serving a line of 10 people. The phone rings for a custom catering quote. Nobody answers, and that customer calls the next shop down the street.",
  },
  {
    icon: MessageSquareX,
    title: "Order Details Scribbled on Paper & WhatsApp",
    description: "Flavors, pickup dates, and deposit notes scattered across napkins and chat threads. One misread date means a ruined weekend and an unhappy regular customer.",
  },
  {
    icon: TrendingDown,
    title: "Losing Catering Deals to Franchise Chains",
    description: "Corporate lunch planners and wedding hosts buy online in 30 seconds. If your business requires sending an email inquiry and waiting 24 hours, you lose the deal.",
  },
  {
    icon: Clock,
    title: "Forgotten Google Review Requests",
    description: "Happy customers walk out your door smiling every single day. But without an automated text sent right after purchase, 95% forget to leave a 5-star Google review.",
  },
]

export function LocalPainPoints() {
  return (
    <section className="py-16 sm:py-24 bg-[#090410] border-y border-accent-gold/15 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <AlertTriangle size={14} />
            <span>The Daily Reality For Local Businesses</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            How Many Custom Orders Slip Through the Cracks Every Single Week?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {painPoints.map((point, idx) => {
            const Icon = point.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-accent-gold/40 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-accent-gold transition-colors">
                      {point.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed font-sans">
                      {point.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
