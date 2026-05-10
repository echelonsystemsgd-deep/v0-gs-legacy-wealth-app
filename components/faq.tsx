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
    question: "How long does the process take?",
    answer:
      "Most projects are completed within 2-4 weeks, depending on the scope and complexity. We work efficiently while maintaining the highest quality standards to ensure your website is ready to generate results quickly.",
  },
  {
    question: "Do you work with all industries?",
    answer:
      "We specialise in working with ambitious businesses, personal brands, consultants, gyms, estate agents, and high-ticket service providers. If you're serious about positioning your business as a premium brand, we'd love to hear from you.",
  },
  {
    question: "Can you redesign existing websites?",
    answer:
      "Absolutely. We offer luxury website redesigns that transform outdated sites into premium digital assets. We'll analyse your current site and create a strategic plan to elevate your online presence.",
  },
  {
    question: "Do you offer AI automation?",
    answer:
      "Yes, AI automation is at the core of what we do. From AI-powered chatbots to automated lead generation and booking systems, we integrate cutting-edge AI technology to help your business operate more efficiently.",
  },
  {
    question: "Is hosting included?",
    answer:
      "We can recommend and set up premium hosting solutions as part of your package. Our recommendations are tailored to your specific needs, ensuring fast load times and reliable performance for your visitors.",
  },
  {
    question: "Will the website work on mobile devices?",
    answer:
      "100%. Every website we build is fully mobile-optimised and responsive. We design mobile-first to ensure a flawless experience on all devices, from smartphones to desktop computers.",
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
            Everything you need to know about working with us.
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
