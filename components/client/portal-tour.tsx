'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

type TourStep = {
  path: string
  target: string
  title: string
  description: string
  position: 'bottom' | 'top' | 'left' | 'right' | 'center'
}

const TOUR_STEPS: TourStep[] = [
  {
    path: '/client',
    target: '', // Center modal
    title: 'Welcome to Your Client Portal',
    description: 'Welcome, partner. We have built this dashboard to give you complete transparency over your project build, roadmap, and direct communication with our team. Let\'s take a quick interactive tour.',
    position: 'center'
  },
  {
    path: '/client',
    target: '[data-tour="welcome"]',
    title: 'Command Deck Overview',
    description: 'This is your main command deck. It displays your active build stage and target launch date at a glance.',
    position: 'bottom'
  },
  {
    path: '/client',
    target: '[data-tour="asset-vault"]',
    title: 'Encrypted Asset Vault',
    description: 'Your secure document vault. Final assets, style guides, and tech deliverables are stored here safely with cryptographic integrity checks.',
    position: 'top'
  },
  {
    path: '/client',
    target: '[data-tour="sync-call"]',
    title: 'Milestone Dev Syncs',
    description: 'Schedule check-in sessions or strategy reviews with our lead engineer whenever you reach key build checkpoints.',
    position: 'top'
  },
  {
    path: '/client/actions',
    target: '', // Center modal — avoids Server Component redirect race
    title: 'Action Required Console',
    description: 'Whenever we need your brand assets, logo files, copy details, or preferences — it appears here. Respond directly to keep your build timeline on schedule. Items are sorted oldest-first so the most overdue tasks are always at the top.',
    position: 'center'
  },
  {
    path: '/client/progress',
    target: '', // Center modal — avoids Server Component redirect race
    title: 'Project Progress Tracker',
    description: 'Track the live 5-phase roadmap here. Once we complete a stage (like Discovery or Design), you can review the deliverables and sign off on that phase to advance the build.',
    position: 'center'
  },
  {
    path: '/client/messages',
    target: '', // Center modal — avoids Server Component redirect race
    title: 'Secure Communication Hub',
    description: 'Chat directly with our engineering team here. Upload reference files, request priority reviews, or ask any questions about your build. Messages are responded to within 2 hours.',
    position: 'center'
  },
  {
    path: '/client',
    target: '',
    title: 'Tour Complete',
    description: 'You are now fully briefed on your Sovereign Console. Replay this guide any time by clicking the Portal Tour button in the top bar. Let\'s build something legendary.',
    position: 'center'
  }
]

export function PortalTour() {
  const pathname = usePathname()
  const router = useRouter()
  
  const [active, setActive] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Sync state on mount and register trigger event listener
  useEffect(() => {
    const tourActive = localStorage.getItem('gs_portal_tour_active') === 'true'
    const savedStep = localStorage.getItem('gs_portal_tour_step')
    
    if (tourActive) {
      setActive(true)
      if (savedStep) {
        setStepIndex(Number(savedStep))
      }
    }

    const handleTriggerTour = () => {
      localStorage.setItem('gs_portal_tour_active', 'true')
      localStorage.setItem('gs_portal_tour_step', '0')
      setStepIndex(0)
      setActive(true)
      router.push('/client')
    }

    window.addEventListener('trigger-portal-tour', handleTriggerTour)
    return () => window.removeEventListener('trigger-portal-tour', handleTriggerTour)
  }, [router])

  // Track target bounding client rect with polling & scroll listeners
  useEffect(() => {
    if (!active) {
      setTargetRect(null)
      return
    }

    const step = TOUR_STEPS[stepIndex]

    // If it's a center modal or path mismatch, clear immediately
    if (pathname !== step.path || !step.target) {
      setTargetRect(null)
      return
    }

    let intervalId: ReturnType<typeof setInterval> | null = null
    let attempts = 0
    const MAX_ATTEMPTS = 60 // 6 seconds max polling (60 × 100ms)

    const attachListeners = (el: Element) => {
      const updateRect = () => setTargetRect(el.getBoundingClientRect())

      // Set rect IMMEDIATELY so the spotlight appears
      setTargetRect(el.getBoundingClientRect())

      // Scroll the element into the centre of the viewport
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // Re-measure after smooth scroll has settled (~400ms)
      const resettleTimer = setTimeout(() => {
        setTargetRect(el.getBoundingClientRect())
      }, 450)

      // Also re-measure on any scroll/resize (capture phase catches scrolls inside overflow containers)
      const scrollableMain = document.querySelector('main')
      window.addEventListener('scroll', updateRect, true)
      window.addEventListener('resize', updateRect)
      scrollableMain?.addEventListener('scroll', updateRect)

      return () => {
        clearTimeout(resettleTimer)
        window.removeEventListener('scroll', updateRect, true)
        window.removeEventListener('resize', updateRect)
        scrollableMain?.removeEventListener('scroll', updateRect)
      }
    }

    let detachListeners: (() => void) | null = null

    const poll = () => {
      attempts++
      const el = document.querySelector(step.target)
      if (el) {
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
        detachListeners = attachListeners(el)
      } else if (attempts >= MAX_ATTEMPTS) {
        // Safety net: element never appeared — auto-advance to next step
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
        setStepIndex((prev) => {
          const next = prev + 1
          if (next < TOUR_STEPS.length) {
            localStorage.setItem('gs_portal_tour_step', String(next))
            const nextStep = TOUR_STEPS[next]
            if (nextStep.path !== pathname) {
              router.push(nextStep.path)
            }
            return next
          }
          // Tour finished
          localStorage.setItem('gs_portal_tour_completed', 'true')
          localStorage.removeItem('gs_portal_tour_active')
          localStorage.removeItem('gs_portal_tour_step')
          setActive(false)
          return prev
        })
      }
    }

    // Attempt immediately, then poll every 100ms until found or timed out
    poll()
    if (!document.querySelector(step.target)) {
      intervalId = setInterval(poll, 100)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (detachListeners) detachListeners()
    }
  }, [stepIndex, active, pathname, router])

  const handleNext = () => {
    const nextIndex = stepIndex + 1
    if (nextIndex < TOUR_STEPS.length) {
      const nextStep = TOUR_STEPS[nextIndex]
      setStepIndex(nextIndex)
      localStorage.setItem('gs_portal_tour_step', String(nextIndex))

      if (pathname !== nextStep.path) {
        router.push(nextStep.path)
      }
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    const prevIndex = stepIndex - 1
    if (prevIndex >= 0) {
      const prevStep = TOUR_STEPS[prevIndex]
      setStepIndex(prevIndex)
      localStorage.setItem('gs_portal_tour_step', String(prevIndex))

      if (pathname !== prevStep.path) {
        router.push(prevStep.path)
      }
    }
  }

  const handleComplete = () => {
    localStorage.setItem('gs_portal_tour_completed', 'true')
    localStorage.removeItem('gs_portal_tour_active')
    localStorage.removeItem('gs_portal_tour_step')
    setActive(false)
    // Always return client to the overview dashboard after completing the tour
    router.push('/client')
  }

  if (!active) return null

  const currentStep = TOUR_STEPS[stepIndex]

  // Only hide during page transitions — NOT while waiting for element on correct page
  // This prevents the tour from hanging after navigating
  if (pathname !== currentStep.path) return null

  // Compute fixed coordinate position relative to target or center screen
  const getTooltipStyle = () => {
    if (!targetRect || currentStep.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const
      }
    }

    const gap = 16
    const tooltipWidth = 360

    switch (currentStep.position) {
      case 'bottom':
        return {
          top: targetRect.bottom + gap,
          left: Math.max(16, targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2)),
          position: 'fixed' as const
        }
      case 'top':
        return {
          top: targetRect.top - gap,
          left: Math.max(16, targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2)),
          transform: 'translateY(-100%)',
          position: 'fixed' as const
        }
      case 'right':
        return {
          top: targetRect.top,
          left: targetRect.right + gap,
          position: 'fixed' as const
        }
      case 'left':
        return {
          top: targetRect.top,
          left: targetRect.left - gap - tooltipWidth,
          position: 'fixed' as const
        }
      default:
        return {
          top: targetRect.bottom + gap,
          left: targetRect.left,
          position: 'fixed' as const
        }
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none">
      {/* Only show a dismissable backdrop on center modal steps — spotlight steps must NOT have a click-to-dismiss layer */}
      {!targetRect && (
        <div
          className="fixed inset-0 bg-black/75 pointer-events-auto backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
          onClick={handleComplete}
        />
      )}

      {/* Viewport Locked Spotlight Outline with massive box-shadow mask */}
      {targetRect && (
        <div 
          className="fixed rounded-2xl border border-gold/50 shadow-[0_0_40px_rgba(212,175,55,0.2)] bg-gold/[0.02] transition-all duration-150 pointer-events-none z-[9998]"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)'
          }}
        />
      )}

      {/* Viewport Locked Floating Tooltip Card */}
      <div
        style={getTooltipStyle()}
        className="w-[360px] max-w-[calc(100vw-32px)] bg-[#0B0B0C] border border-gold/20 rounded-2xl p-5 shadow-[0_12px_50px_rgba(0,0,0,0.9)] pointer-events-auto select-text animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4 text-sm relative z-[9999]"
      >
        {/* Custom Pointing Arrow Indicators */}
        {targetRect && currentStep.position === 'bottom' && (
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-gold/20 filter drop-shadow-[0_-2px_5px_rgba(212,175,55,0.05)]">
            <div className="absolute top-[1.5px] -left-[9px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[9px] border-b-[#0B0B0C]" />
          </div>
        )}

        {targetRect && currentStep.position === 'top' && (
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-gold/20 filter drop-shadow-[0_2px_5px_rgba(212,175,55,0.05)]">
            <div className="absolute bottom-[1.5px] -left-[9px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-[#0B0B0C]" />
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider">
            <Sparkles size={13} className="animate-pulse" />
            <span>Guide ({stepIndex + 1}/{TOUR_STEPS.length})</span>
          </div>
          <button 
            onClick={handleComplete}
            className="p-1 rounded-lg hover:bg-white/5 border border-transparent hover:border-gold/10 text-muted-foreground hover:text-gold transition-all cursor-pointer"
            aria-label="Skip Guide"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-base text-foreground leading-snug">
            {currentStep.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-gold/10">
          <button
            onClick={handleBack}
            disabled={stepIndex === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold/10 hover:bg-gold/5 text-xs text-gold transition-all disabled:opacity-30 cursor-pointer"
          >
            <ArrowLeft size={12} /> Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gold hover:bg-gold/90 text-[#050505] font-bold text-xs shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
          >
            {stepIndex === TOUR_STEPS.length - 1 ? (
              <>Finish <Check size={12} /></>
            ) : (
              <>Next <ArrowRight size={12} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
