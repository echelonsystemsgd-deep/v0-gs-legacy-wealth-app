"use client"

import { motion } from "framer-motion"

export function SocialProofStrip() {
  const integrations = [
    { name: "WhatsApp Business", icon: "💬" },
    { name: "Stripe Payments", icon: "💳" },
    { name: "SumUp", icon: "📱" },
    { name: "Square", icon: "🔲" },
    { name: "Google Calendar", icon: "📅" },
    { name: "Shopify", icon: "🛍️" },
    { name: "Instagram DM", icon: "📸" },
  ]

  return (
    <section className="relative bg-[#0B0F17] py-10 border-y border-[#D9A74A]/15 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Label */}
        <p className="text-xxs sm:text-xs font-bold uppercase tracking-[0.2em] text-[#D9A74A] mb-6 font-mono">
          [ INTEGRATES SEAMLESSLY WITH YOUR DAILY BUSINESS TOOLS ]
        </p>

        {/* Integrations Logo Pills Grid */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
          {integrations.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-200 hover:border-[#D9A74A]/40 transition-all duration-300 shadow-sm"
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
