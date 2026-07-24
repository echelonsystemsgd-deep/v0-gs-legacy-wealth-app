"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, ChevronRight, RefreshCw, ShieldAlert, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Question {
  id: number
  title: string
  subtitle: string
  options: { label: string; scorePenalty: number }[]
}

const questions: Question[] = [
  {
    id: 1,
    title: "How quickly does your team respond to inbound lead inquiries?",
    subtitle: "Speed-to-lead directly dictates initial booking conversion rates.",
    options: [
      { label: "Under 60 seconds (Automated / AI)", scorePenalty: 0 },
      { label: "5 to 30 minutes", scorePenalty: 15 },
      { label: "1 to 4 hours", scorePenalty: 28 },
      { label: "24+ hours or manual follow-up", scorePenalty: 40 },
    ],
  },
  {
    id: 2,
    title: "How are inbound prospects qualified before hitting your calendar?",
    subtitle: "Unqualified leads waste executive sales calendar availability.",
    options: [
      { label: "AI Concierge semantic qualification", scorePenalty: 0 },
      { label: "Basic webform fields + manual review", scorePenalty: 15 },
      { label: "Anyone can book without screening", scorePenalty: 30 },
    ],
  },
  {
    id: 3,
    title: "How is lead data synced into your CRM and email sequences?",
    subtitle: "Manual copy-pasting creates data latency and human error.",
    options: [
      { label: "100% automated API data pipeline", scorePenalty: 0 },
      { label: "Partial Zapier / basic integrations", scorePenalty: 15 },
      { label: "Manual data re-entry by staff", scorePenalty: 30 },
    ],
  },
  {
    id: 4,
    title: "What is your primary revenue growth target for this quarter?",
    subtitle: "Helps us match the optimal architectural leverage tier.",
    options: [
      { label: "$10,000 - $50,000 / month", scorePenalty: 5 },
      { label: "$50,000 - $250,000 / month", scorePenalty: 0 },
      { label: "$250,000+ / month (Enterprise)", scorePenalty: 0 },
    ],
  },
]

export function DiagnosticsWizard() {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isCompleted, setIsCompleted] = useState<boolean>(false)

  const handleSelectOption = (optionIndex: number) => {
    const nextAnswers = [...answers, optionIndex]
    setAnswers(nextAnswers)
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const restartWizard = () => {
    setCurrentStep(0)
    setAnswers([])
    setIsCompleted(false)
  }

  // Calculate score
  const totalPenalty = answers.reduce((acc, optIdx, qIdx) => {
    return acc + (questions[qIdx]?.options[optIdx]?.scorePenalty || 0)
  }, 0)

  const frictionScore = Math.min(98, Math.max(12, totalPenalty + 12))

  return (
    <div className="w-full max-w-3xl mx-auto bg-bg-tertiary/60 border border-accent-gold/30 p-6 sm:p-10 rounded-2xl shadow-2xl glass text-left">
      
      {!isCompleted ? (
        <div className="space-y-8">
          
          {/* Progress Bar Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-gold flex items-center gap-2">
              <Sparkles size={14} />
              DIAGNOSTIC HEURISTIC AUDIT · STEP {currentStep + 1} OF {questions.length}
            </span>
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent-gold transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Stack */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {questions[currentStep].title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-text-secondary mt-1.5">
                  {questions[currentStep].subtitle}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {questions[currentStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="w-full p-4 rounded-xl border border-white/10 bg-black/40 hover:bg-accent-purple/20 hover:border-accent-gold/50 transition-all duration-200 text-left font-sans text-sm text-white flex items-center justify-between group cursor-pointer"
                  >
                    <span>{option.label}</span>
                    <ChevronRight size={16} className="text-white/40 group-hover:text-accent-gold group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      ) : (
        /* Results View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-xs font-mono font-bold uppercase tracking-wider">
            <CheckCircle2 size={14} />
            DIAGNOSTIC AUDIT COMPLETE
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-3xl font-bold text-white">Your Operational Friction Index</h3>
            <div className="font-serif text-6xl font-bold text-accent-gold tracking-tight">
              {frictionScore}%
            </div>
            <p className="font-sans text-xs sm:text-sm text-text-secondary max-w-lg mx-auto">
              {frictionScore > 50 
                ? "Significant speed-to-lead latency detected. Your current intake pipeline is bleeding actionable leads to manual delays."
                : "Moderate friction detected. Implementing Mercian Wealth's autonomic architecture will unlock an immediate conversion lift."
              }
            </p>
          </div>

          {/* Action Box */}
          <div className="p-6 rounded-xl bg-black/50 border border-accent-gold/30 text-left space-y-4">
            <h4 className="font-mono text-xs font-bold text-accent-gold uppercase tracking-wider">
              RECOMMENDED ARCHITECTURE INTEGRATION:
            </h4>
            <p className="font-sans text-sm text-white leading-relaxed">
              <strong>Mercian Autonomic Capture Protocol</strong> — Custom AI qualification concierge, zero-latency lead routing, and continuous CRM synchronization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button
              asChild
              size="lg"
              className="font-bold shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:shadow-accent-gold/30 px-8 py-6"
            >
              <Link href="/book" className="flex items-center justify-center gap-2">
                <span>Schedule Alignment to Plug Friction</span>
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={restartWizard}
              className="text-xs text-text-secondary hover:text-white border-white/10"
            >
              <RefreshCw size={14} className="mr-1" />
              Retake Audit
            </Button>
          </div>

        </motion.div>
      )}

    </div>
  )
}
