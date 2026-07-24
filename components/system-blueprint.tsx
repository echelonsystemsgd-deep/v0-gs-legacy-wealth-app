"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cpu, Database, GitMerge, ShieldCheck, Zap, Server, Activity } from "lucide-react"

interface NodeSpec {
  id: string
  title: string
  subtitle: string
  icon: any
  latency: string
  throughput: string
  mechanism: string
  specs: string[]
}

const nodes: NodeSpec[] = [
  {
    id: "ingestion",
    title: "1. Autonomic Ingestion",
    subtitle: "Webhooks, API Gateways & Edge Forms",
    icon: Zap,
    latency: "< 45ms",
    throughput: "10,000 req/min",
    mechanism: "Zero-latency edge webhook routing with instant payload validation & duplicate protection.",
    specs: ["Global Edge Dispatch", "AES-256 Encryption", "Instant Fallback Buffers"]
  },
  {
    id: "qualification",
    title: "2. AI Qualification Engine",
    subtitle: "Multi-Model Intent Analysis & Scoring",
    icon: Cpu,
    latency: "< 350ms",
    throughput: "Real-time AI ICP Match",
    mechanism: "Semantic intent parsing against ICP metrics to score high-ticket opportunity value instantly.",
    specs: ["Custom LLM Prompt Pipelines", "High-Ticket ICP Classifier", "Dynamic Intent Extraction"]
  },
  {
    id: "orchestration",
    title: "3. Pipeline Orchestration",
    subtitle: "CRM Sync & Calendar Dispatch",
    icon: GitMerge,
    latency: "< 120ms",
    throughput: "Zero-Collision Booking",
    mechanism: "Automated booking validation and CRM pipeline state mutation without human delay.",
    specs: ["Salesforce & HubSpot Connectors", "Calendly/Custom API Dispatch", "Auto-Assignment Rules"]
  },
  {
    id: "telemetry",
    title: "4. Live Telemetry & Nurture",
    subtitle: "Autonomic Follow-up & Slack Alerts",
    icon: Database,
    latency: "Continuous",
    throughput: "24/7 Monitoring",
    mechanism: "Instant Slack/SMS alerts to sales reps + automated drip Sequences for instant lead retention.",
    specs: ["Instant Team #alerts", "Smart Re-engagement Triggers", "Conversion Latency Logs"]
  }
]

export function SystemBlueprint() {
  const [selectedNode, setSelectedNode] = useState<string>("ingestion")
  const activeNode = nodes.find((n) => n.id === selectedNode) || nodes[0]

  return (
    <div id="system-blueprint" className="relative py-24 bg-bg-primary border-t border-white/5 text-left overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-accent-gold">
            [ ARCHITECTURAL BLUEPRINT ]
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3">
            The <span className="bg-gradient-to-r from-accent-gold via-amber-200 to-accent-gold bg-clip-text text-transparent">Autonomic Protocol</span> Node Graph
          </h2>
          <p className="font-sans text-sm sm:text-base text-text-primary opacity-75 leading-relaxed mt-4">
            Click any node below to inspect execution parameters and latency telemetry of our enterprise architecture.
          </p>
        </div>

        {/* Node Blueprint Grid */}
        <div className="grid md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Node Selector Column (5 cols on md+) */}
          <div className="md:col-span-5 space-y-3">
            {nodes.map((node) => {
              const IconComp = node.icon
              const isSelected = selectedNode === node.id
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`w-full p-4 sm:p-5 rounded-xl border text-left transition-all duration-300 flex items-center justify-between group cursor-pointer focus:outline-none ${
                    isSelected 
                      ? "bg-bg-tertiary border-accent-gold shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
                      : "bg-bg-tertiary/20 border-white/5 hover:border-white/20 hover:bg-bg-tertiary/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-lg border transition-colors shrink-0 ${
                      isSelected ? "bg-accent-gold/15 border-accent-gold text-accent-gold" : "bg-white/5 border-white/10 text-white/60"
                    }`}>
                      <IconComp size={20} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-sans font-bold text-sm text-white truncate">{node.title}</h4>
                      <p className="font-sans text-xs text-text-secondary opacity-70 mt-0.5 truncate">{node.subtitle}</p>
                    </div>
                  </div>
                  <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded ${
                    isSelected ? "bg-accent-gold/20 text-accent-gold" : "bg-white/5 text-text-secondary"
                  }`}>
                    {node.latency}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Active Node Detail Card (7 cols on md+) */}
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-bg-tertiary border border-accent-gold/30 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl glass"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <Activity size={20} className="text-accent-gold animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-gold">
                      ACTIVE NODE SPECIFICATION
                    </span>
                  </div>
                  <span className="font-mono text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                    ● ONLINE
                  </span>
                </div>

                {/* Node Title */}
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white">{activeNode.title}</h3>
                  <p className="font-sans text-xs text-text-secondary mt-1">{activeNode.subtitle}</p>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-4 bg-black/40 border border-white/5 p-4 rounded-xl font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-text-secondary uppercase block">Execution Latency</span>
                    <span className="text-accent-gold font-bold text-base mt-0.5 block">{activeNode.latency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary uppercase block">Throughput Capacity</span>
                    <span className="text-white font-bold text-base mt-0.5 block">{activeNode.throughput}</span>
                  </div>
                </div>

                {/* Core Mechanism */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-2">Core Mechanism</h4>
                  <p className="text-sm text-text-primary opacity-90 leading-relaxed font-medium">
                    {activeNode.mechanism}
                  </p>
                </div>

                {/* Sub-Specs List */}
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-3">Enterprise Standards</h4>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {activeNode.specs.map((spec, i) => (
                      <div key={i} className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg flex items-center gap-2">
                        <ShieldCheck size={14} className="text-accent-gold shrink-0" />
                        <span className="text-[11px] font-sans text-white/90 font-medium">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  )
}
