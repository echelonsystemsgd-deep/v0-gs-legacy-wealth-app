import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unauthorized Access',
  description: 'You do not have permission to view this dashboard page.',
}

export default function UnauthorizedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
