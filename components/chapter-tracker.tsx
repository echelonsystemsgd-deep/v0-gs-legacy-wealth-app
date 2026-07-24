"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const chapters = [
  { id: "bottleneck", label: "I", title: "Friction" },
  { id: "divergence", label: "II", title: "Divergence" },
  { id: "architecture", label: "III", title: "Architecture" },
  { id: "telemetry", label: "IV", title: "Telemetry" },
  { id: "cta", label: "V", title: "Integration" },
]

export function ChapterTracker() {
  const [activeChapter, setActiveChapter] = useState<string>("bottleneck")
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      // Toggle visibility based on scroll position
      const scrollY = window.scrollY
      if (scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      // Check which chapter section is currently in view
      const sectionElements = [
        { id: "bottleneck", el: document.getElementById("bottleneck") },
        { id: "divergence", el: document.getElementById("divergence") },
        { id: "architecture", el: document.getElementById("process") || document.getElementById("why-mercian") },
        { id: "telemetry", el: document.getElementById("testimonials") },
        { id: "cta", el: document.getElementById("cta") },
      ]

      for (const section of sectionElements) {
        if (section.el) {
          const rect = section.el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
            setActiveChapter(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3 p-3 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md shadow-2xl select-none"
        >
          <div className="text-[9px] font-mono text-accent-gold/80 font-bold uppercase tracking-widest text-center border-b border-white/10 pb-2">
            PROTOCOL
          </div>
          {chapters.map((ch) => {
            const isActive = activeChapter === ch.id
            return (
              <button
                key={ch.id}
                onClick={() => scrollToSection(ch.id)}
                className={`group flex items-center gap-3 px-2 py-1.5 rounded-lg text-left transition-all duration-300 bg-transparent border-0 cursor-pointer ${
                  isActive ? "text-accent-gold" : "text-white/40 hover:text-white/80"
                }`}
              >
                <span className={`font-mono text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isActive ? "border-accent-gold bg-accent-gold/20 text-accent-gold" : "border-white/20 group-hover:border-white/40"
                }`}>
                  {ch.label}
                </span>
                <span className={`text-[10px] font-sans font-semibold uppercase tracking-wider transition-opacity duration-300 ${
                  isActive ? "opacity-100 font-bold" : "opacity-0 group-hover:opacity-70"
                }`}>
                  {ch.title}
                </span>
              </button>
            )
          })}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
