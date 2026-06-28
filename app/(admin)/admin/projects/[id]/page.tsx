'use client'

import { ProjectWorkspace } from '@/components/admin/project-workspace'
import { useParams } from 'next/navigation'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  return <ProjectWorkspace id={id} />
}
