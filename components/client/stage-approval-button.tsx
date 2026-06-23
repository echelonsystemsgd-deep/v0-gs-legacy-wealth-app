'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Award, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type StageApprovalButtonProps = {
  projectId: string
  clientId: string
  stage: string
  isApproved: boolean
  approval?: {
    approved_at: string
    approved_by_profile?: {
      first_name?: string | null
      last_name?: string | null
      full_name?: string | null
    } | null
  } | null
  clientName: string
}

export function StageApprovalButton({
  projectId,
  clientId,
  stage,
  isApproved,
  approval,
  clientName,
}: StageApprovalButtonProps) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    if (loading) return
    setLoading(true)

    try {
      const { error } = await supabase.from('project_approvals').insert({
        project_id: projectId,
        stage: stage,
        approved_by: clientId,
      })

      if (error) {
        console.error('Error signing off stage:', error)
        toast.error(`Sign-off failed: ${error.message || 'database error'}`)
      } else {
        toast.success(`Milestone phase "${stage}" successfully approved and logged.`)
        router.refresh()
      }
    } catch (err) {
      console.error('Stage approval exception:', err)
      toast.error('Connection timeout during authorization.')
    } finally {
      setLoading(false)
    }
  }

  if (isApproved) {
    const approverName =
      approval?.approved_by_profile?.first_name ||
      approval?.approved_by_profile?.full_name ||
      clientName

    const approvalDate = approval?.approved_at
      ? new Date(approval.approved_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })

    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold/5 border border-gold/20 text-gold animate-fade-in shrink-0">
        <Award size={13} className="text-gold" />
        <span className="text-[10px] font-medium tracking-wide">
          Approved on {approvalDate} by {approverName}
        </span>
      </div>
    )
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 hover:border-gold/50 text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-[0_0_8px_rgba(201,162,39,0.05)] hover:shadow-[0_0_12px_rgba(201,162,39,0.15)] ml-auto shrink-0"
    >
      {loading ? (
        <>
          <Loader2 size={10} className="animate-spin text-gold" />
          <span>Signing...</span>
        </>
      ) : (
        <span>Sign Off Phase</span>
      )}
    </button>
  )
}
