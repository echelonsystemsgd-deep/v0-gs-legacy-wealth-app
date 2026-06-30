'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { X, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type TourStep = {
  path: string
  target: string
  title: string
  description: string
  position: 'bottom' | 'top' | 'left' | 'right' | 'center'
}

function getSteps(project: any): TourStep[] {
  const steps: TourStep[] = [
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
    }
  ]

  // Only include provisioning logs if status is Discovery or Design
  const status = project?.status || 'Discovery'
  const isEarlyStage = status === 'Discovery' || status === 'Design'
  if (isEarlyStage) {
    steps.push({
      path: '/client',
      target: '[data-tour="provisioning-logs"]',
      title: 'System Build Logs',
      description: 'For early phase builds, this terminal outputs live engineering trajectory logs so you can monitor server allocation and database initialization milestones in real-time.',
      position: 'top'
    })
  }

  // Contract & Pricing Step
  if (project) {
    if (!project.contract_type) {
      // Contract pending enrollment
      steps.push({
        path: '/client',
        target: '[data-tour="telemetry-deck"]',
        title: 'Contract Enrollment Desk',
        description: `Your custom support options are ready. Choose between the Monthly Retainer (£${Number(project.retainer_amount || 0).toLocaleString()}/mo), One-Time Setup (£${Number(project.one_time_fee || 0).toLocaleString()}), or Performance Royalty Yield (${project.rev_share_percentage || 0}% Rev Share) to activate project telemetry.`,
        position: 'top'
      })
    } else {
      // Contract enrolled
      const contractTypeLabel = 
        project.contract_type === 'retainer' ? 'Monthly Retainer' : 
        project.contract_type === 'one_time' ? 'One-Time Setup Fee' : 
        project.contract_type === 'rev_share' ? 'Performance Royalty Yield (PRY)' : 'Contract Scheme';

      const contractVal = Number(project.contract_value) || 0
      const amtPaid = Number(project.amount_paid) || 0

      steps.push({
        path: '/client',
        target: '[data-tour="telemetry-deck"]',
        title: `Financial Telemetry: ${contractTypeLabel}`,
        description: project.contract_type === 'rev_share'
          ? `Your Performance Royalty Yield (${project.rev_share_percentage}%) agreement is active. Your milestone unlocks are determined by project phase completions.`
          : `Track your total contract value (£${contractVal.toLocaleString()}) and amount settled (£${amtPaid.toLocaleString()}). Phase unlock milestones below show the exact payment thresholds needed to advance the build stages.`,
        position: 'top'
      })
    }
  } else {
    // Fallback if no project loaded yet
    steps.push({
      path: '/client',
      target: '[data-tour="telemetry-deck"]',
      title: 'Financial Telemetry & Contract Desk',
      description: 'Select your preferred billing model (Monthly Retainer, Flat Setup, or PRY Agreement) to initialize your operational build and unlock live milestone metrics.',
      position: 'top'
    })
  }

  steps.push(
    {
      path: '/client',
      target: '[data-tour="asset-vault"]',
      title: 'Encrypted Asset Vault',
      description: 'Your secure document vault. Final assets, style guides, and tech deliverables are stored here safely with cryptographic integrity and security checks.',
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
      path: '/client',
      target: '[data-tour="sidebar-actions"]',
      title: 'Action Console Navigation',
      description: 'Clicking here (or clicking Next) will navigate to your Action Required Console, where we collect files and copy parameters from you.',
      position: 'right'
    },
    {
      path: '/client/actions',
      target: '[data-tour="actions-title"]',
      title: 'Action Required Console',
      description: 'Whenever we need your brand assets, logo files, copy details, or preferences — it appears here. Respond directly to keep your build timeline on schedule. Items are sorted oldest-first so the most overdue tasks are always at the top.',
      position: 'bottom'
    },
    {
      path: '/client/actions',
      target: '[data-tour="sidebar-progress"]',
      title: 'Project Progress Navigation',
      description: 'Clicking here (or clicking Next) will take you to your Project Progress page to track the timeline.',
      position: 'right'
    },
    {
      path: '/client/progress',
      target: '[data-tour="progress-timeline"]',
      title: 'Project Progress Tracker',
      description: 'Track the live 5-phase roadmap here. Once we complete a stage (like Discovery or Design), you can review the deliverables and sign off on that phase to advance the build.',
      position: 'top'
    },
    {
      path: '/client/progress',
      target: '[data-tour="sidebar-messages"]',
      title: 'Secure Messages Navigation',
      description: 'Clicking here (or clicking Next) will take you to your Secure Communication Hub to chat with the engineering team.',
      position: 'right'
    },
    {
      path: '/client/messages',
      target: '[data-tour="messages-chat"]',
      title: 'Secure Communication Hub',
      description: 'Chat directly with our engineering team here. Upload reference files, request priority reviews, or ask any questions about your build. Messages are responded to within 2 hours.',
      position: 'top'
    },
    {
      path: '/client',
      target: '',
      title: 'Tour Complete',
      description: 'You are now fully briefed on your Sovereign Console. Replay this guide any time by clicking the Portal Tour button in the top bar. Let\'s build something legendary.',
      position: 'center'
    }
  )

  return steps
}


export function PortalTour() {
  const pathname = usePathname()
  const router = useRouter()
  
  const [active, setActive] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [project, setProject] = useState<any>(null)
  
  const tooltipRef = useRef<HTMLDivElement>(null)

  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0,
  })
  const [computedPosition, setComputedPosition] = useState<'top' | 'bottom' | 'center'>('center')
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({})

  // Memoize steps dynamically based on project info
  const steps = useMemo(() => getSteps(project), [project])

  // Fetch project details for client
  useEffect(() => {
    const supabase = createClient()
    async function loadProject() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('client_id', user.id)
          .maybeSingle()
        setProject(data)
      }
    }
    loadProject()
  }, [])

  // Auto-trigger tour on first login from now
  useEffect(() => {
    const autoTriggered = localStorage.getItem('gs_portal_tour_v2_auto_triggered') === 'true'
    const tourActive = localStorage.getItem('gs_portal_tour_active') === 'true'

    if (!autoTriggered) {
      localStorage.setItem('gs_portal_tour_v2_auto_triggered', 'true')
      
      if (!tourActive) {
        localStorage.setItem('gs_portal_tour_active', 'true')
        localStorage.setItem('gs_portal_tour_step', '0')
        setStepIndex(0)
        setActive(true)
        router.push('/client')
      }
    }
  }, [router])

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

  // Handle mobile sidebar open/close triggers when highlighting sidebar items
  useEffect(() => {
    if (!active) return

    const step = steps[stepIndex]
    if (!step) return

    const isSidebarTarget = step.target && step.target.includes('sidebar-')
    const isMobile = window.innerWidth < 1024

    if (isSidebarTarget && isMobile) {
      window.dispatchEvent(new CustomEvent('gs-set-sidebar-open', { detail: true }))
    } else {
      window.dispatchEvent(new CustomEvent('gs-set-sidebar-open', { detail: false }))
    }
  }, [stepIndex, active, steps])

  // Track target bounding client rect with polling & scroll listeners
  useEffect(() => {
    if (!active) {
      setTargetRect(null)
      return
    }

    const step = steps[stepIndex]
    if (!step) return

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
          if (next < steps.length) {
            localStorage.setItem('gs_portal_tour_step', String(next))
            const nextStep = steps[next]
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
          window.dispatchEvent(new CustomEvent('gs-set-sidebar-open', { detail: false }))
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
  }, [stepIndex, active, pathname, router, steps])

  const handleNext = () => {
    const nextIndex = stepIndex + 1
    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex]
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
      const prevStep = steps[prevIndex]
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
    window.dispatchEvent(new CustomEvent('gs-set-sidebar-open', { detail: false }))
    // Always return client to the overview dashboard after completing the tour
    router.push('/client')
  }

  // Dynamic layout and tooltip calculations
  const updatePosition = useCallback(() => {
    if (!active) return

    const step = steps[stepIndex]
    if (!step) return
    const tooltipEl = tooltipRef.current

    if (!targetRect || step.position === 'center') {
      setTooltipStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 1,
      })
      setComputedPosition('center')
      return
    }

    const gap = 16
    const tooltipWidth = 360
    const tooltipHeight = tooltipEl ? tooltipEl.offsetHeight : 180

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let bestPosition: 'top' | 'bottom' = step.position === 'top' || step.position === 'bottom' ? step.position : 'bottom'

    // Smart flip check
    if (step.position === 'top') {
      const spaceAbove = targetRect.top - gap
      if (spaceAbove < tooltipHeight) {
        const spaceBelow = viewportHeight - targetRect.bottom - gap
        if (spaceBelow > spaceAbove) {
          bestPosition = 'bottom'
        }
      }
    } else if (step.position === 'bottom') {
      const spaceBelow = viewportHeight - targetRect.bottom - gap
      if (spaceBelow < tooltipHeight) {
        const spaceAbove = targetRect.top - gap
        if (spaceAbove > spaceBelow) {
          bestPosition = 'top'
        }
      }
    }

    let top = 0
    if (bestPosition === 'bottom') {
      top = targetRect.bottom + gap
      if (top + tooltipHeight > viewportHeight - 16) {
        top = Math.max(16, viewportHeight - tooltipHeight - 16)
      }
    } else { // top
      top = targetRect.top - gap - tooltipHeight
      if (top < 16) {
        top = 16
      }
    }

    let left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2)
    const maxLeft = Math.max(16, viewportWidth - tooltipWidth - 16)
    left = Math.max(16, Math.min(left, maxLeft))

    // Position arrow dynamically matching target alignment
    const targetCenter = targetRect.left + (targetRect.width / 2)
    const relativeLeft = targetCenter - left
    const clampedRelativeLeft = Math.max(24, Math.min(relativeLeft, tooltipWidth - 24))

    setArrowStyle({
      left: `${clampedRelativeLeft}px`,
      transform: 'translateX(-50%)',
    })

    setTooltipStyle({
      position: 'fixed',
      top,
      left,
      opacity: 1,
    })
    setComputedPosition(bestPosition)
  }, [active, stepIndex, targetRect, steps])

  // ResizeObserver to watch size changes dynamically
  useEffect(() => {
    if (!active) {
      setTooltipStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0,
      })
      setComputedPosition('center')
      return
    }

    updatePosition()

    const tooltipEl = tooltipRef.current
    if (!tooltipEl) return

    const observer = new ResizeObserver(() => {
      updatePosition()
    })
    observer.observe(tooltipEl)

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [active, updatePosition])

  if (!active) return null

  const currentStep = steps[stepIndex]
  if (!currentStep) return null

  // Only hide during page transitions — NOT while waiting for element on correct page
  if (pathname !== currentStep.path) return null

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
        ref={tooltipRef}
        style={tooltipStyle}
        className="w-[360px] max-w-[calc(100vw-32px)] bg-[#0B0B0C] border border-gold/20 rounded-2xl p-5 shadow-[0_12px_50px_rgba(0,0,0,0.9)] pointer-events-auto select-text animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4 text-sm relative z-[9999]"
      >
        {/* Custom Pointing Arrow Indicators */}
        {targetRect && computedPosition === 'bottom' && (
          <div 
            style={arrowStyle}
            className="absolute -top-2.5 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-gold/20 filter drop-shadow-[0_-2px_5px_rgba(212,175,55,0.05)]"
          >
            <div className="absolute top-[1.5px] -left-[9px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[9px] border-b-[#0B0B0C]" />
          </div>
        )}

        {targetRect && computedPosition === 'top' && (
          <div 
            style={arrowStyle}
            className="absolute -bottom-2.5 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-gold/20 filter drop-shadow-[0_2px_5px_rgba(212,175,55,0.05)]"
          >
            <div className="absolute bottom-[1.5px] -left-[9px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-[#0B0B0C]" />
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider">
            <Sparkles size={13} className="animate-pulse" />
            <span>Guide ({stepIndex + 1}/{steps.length})</span>
          </div>
          <button 
            onClick={handleComplete}
            className="p-2.5 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 border border-transparent hover:border-gold/10 text-muted-foreground hover:text-gold transition-all cursor-pointer"
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
            className="flex items-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg border border-gold/10 hover:bg-gold/5 text-xs text-gold transition-all disabled:opacity-30 cursor-pointer"
          >
            <ArrowLeft size={12} /> Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 sm:px-4 sm:py-1.5 rounded-lg bg-gold hover:bg-gold/90 text-[#050505] font-bold text-xs shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
          >
            {stepIndex === steps.length - 1 ? (
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
