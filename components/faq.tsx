"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Are the prices one-time fees or monthly subscriptions?",
    answer:
      "Our main packages (Launch, Legacy, and Elite) are structured as one-time setup investments. You own 100% of the completed website and custom code upon launch. We also offer optional Monthly Growth Retainers (Ascent, Sovereign, and Apex) for businesses wanting continuous high-speed hosting, advanced search engine optimization, priority design tweaks, and regular AI agent training.",
  },
  {
    question: "What is your standard payment structure?",
    answer:
      "For setup projects, we operate on a premium 50/50 milestone basis: a 50% initial commitment fee to reserve your scheduling slot and begin interactive wireframing, and the remaining 50% upon final client sign-off, testing clearance, and full handover.",
  },
  {
    question: "How long does the system build take?",
    answer:
      "Most core projects are completed within 2 to 4 weeks, depending on the complexity of custom AI integrations and pages. We work efficiently while maintaining the highest possible quality standards to ensure your digital asset is ready to generate high-value results swiftly.",
  },
  {
    question: "Do you build custom AI automations beyond chatbots?",
    answer:
      "Yes, absolutely. Under our Legacy and Elite tiers (as well as Sovereign and Apex retainers), we integrate multi-system AI automations. This includes capturing a lead on your site, automatically qualifying them, feeding their details to your CRM, scheduling appointments, drafting personalized client responses, and triggering automatic client onboarding sequences without you lifting a finger.",
  },
  {
    question: "Will the website work flawlessly on mobile?",
    answer:
      "Yes, 100%. Every single project we architect is built with a responsive, mobile-first philosophy. We prioritize fluid grid layouts, high-performance visual compression, and lightning-fast loading to ensure a flawless experience across all mobile, tablet, and desktop screens.",
  },
  {
    question: "Do you offer custom redesigns for existing websites?",
    answer:
      "We do. We specialize in transforming outdated or generic websites into luxury digital assets that build authority. We will conduct a thorough audit of your current traffic and UX before crafting a customized plan to transition your brand to our premium AI-powered systems.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Frequently Asked </span>
            <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about our premium investment models.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gold/10 rounded-xl px-6 bg-card/50 hover:border-gold/30 transition-colors data-[state=open]:border-gold/30"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-gold transition-colors py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
