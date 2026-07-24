"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Chapter {
  id: string
  label: string
  title: string
  selectors: string[]
}

const chapters: Chapter[] = [
  { id: "bottleneck", label: "I", title: "Friction", selectors: ["#chapter-divider-I", "#bottleneck", "#roi-calculator"] },
  { id: "divergence", label: "II", title: "Divergence", selectors: ["#chapter-divider-II", "#divergence"] },
  { id: "architecture", label: "III", title: "Architecture", selectors: ["#chapter-divider-III", "#architecture", "#system-blueprint"] },
  { id: "telemetry", label: "IV", title: "Telemetry", selectors: ["#chapter-divider-IV", "#telemetry", "#pricing"] },
  { id: "cta", label: "V", title: "Integration", selectors: ["#chapter-divider-V", "#cta"] },
]

export function ChapterTracker() {
  const [activeChapter, setActiveChapter] = useState<string>("bottleneck")
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const isClickScrolling = useRef<boolean>(false)

  useEffect(() => {
    let animationFrameId: number | null = null

    const checkActiveSection = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY > 300)

      if (isClickScrolling.current) return

      const viewportHeight = window.innerHeight

      let maxOverlap = 0
      let bestMatchId: string | null = null

      for (const ch of chapters) {
        let minTop = Infinity
        let maxBottom = -Infinity
        let hasElements = false

        for (const selector of ch.selectors) {
          const el = document.querySelector(selector)
          if (el) {
            hasElements = true
            const rect = el.getBoundingClientRect()
            if (rect.top < minTop) minTop = rect.top
            if (rect.bottom > maxBottom) maxBottom = rect.bottom
          }
        }

        if (hasElements) {
          // Compute vertical pixel overlap of chapter group within visible window [0, viewportHeight]
          const visibleTop = Math.max(0, minTop)
          const visibleBottom = Math.min(viewportHeight, maxBottom)
          const overlap = Math.max(0, visibleBottom - visibleTop)

          if (overlap > maxOverlap) {
            maxOverlap = overlap
            bestMatchId = ch.id
          }
        }
      }

      if (bestMatchId) {
        setActiveChapter(bestMatchId)
      }
    }

    const onScroll = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = requestAnimationFrame(checkActiveSection)
    }

    // Run check immediately on mount
    checkActiveSection()

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const scrollToSection = (id: string) => {
    const chapterObj = chapters.find((c) => c.id === id)
    if (!chapterObj) return

    // Find the primary anchor element for this chapter
    const primarySelector = chapterObj.selectors[0]
    const el = document.querySelector(primarySelector)
    if (el) {
      isClickScrolling.current = true
      setActiveChapter(id)

      const navbarOffset = 84
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = el.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - navbarOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      // Re-enable automatic scroll detection after smooth scroll completes
      setTimeout(() => {
        isClickScrolling.current = false
      }, 800)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2 p-3 rounded-2xl bg-[#09070F]/80 border border-white/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] select-none"
        >
          {/* Header Badge */}
          <div className="flex flex-col items-center gap-1 border-b border-white/10 pb-2.5 px-1">
            <span className="text-[9px] font-mono text-accent-gold/90 font-bold uppercase tracking-[0.25em]">
              PROTOCOL
            </span>
          </div>

          {/* Chapter Buttons List */}
          <div className="relative flex flex-col gap-1.5 pt-1">
            {chapters.map((ch) => {
              const isActive = activeChapter === ch.id
              return (
                <button
                  key={ch.id}
                  onClick={() => scrollToSection(ch.id)}
                  aria-label={`Jump to Chapter ${ch.label}: ${ch.title}`}
                  className="relative group flex items-center gap-3 px-2.5 py-1.5 rounded-xl transition-colors duration-200 bg-transparent border-0 cursor-pointer text-left"
                >
                  {/* Active Animated Pill Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeChapterBg"
                      className="absolute inset-0 rounded-xl bg-accent-gold/15 border border-accent-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Roman Numeral Node */}
                  <span
                    className={`relative z-10 font-mono text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isActive
                        ? "border-accent-gold bg-accent-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.5)] scale-105"
                        : "border-white/20 text-white/50 group-hover:border-white/50 group-hover:text-white/90 group-hover:scale-105"
                    }`}
                  >
                    {ch.label}
                  </span>

                  {/* Chapter Title Label */}
                  <span
                    className={`relative z-10 text-[10px] font-sans font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? "text-accent-gold font-bold opacity-100 translate-x-0"
                        : "text-white/40 opacity-0 max-w-0 group-hover:max-w-[120px] group-hover:opacity-80 group-hover:text-white/80 transition-all"
                    }`}
                  >
                    {ch.title}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
