import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Login · Mercian Wealth',
  description: 'Sign in to your Mercian Wealth client dashboard or administrator control panel.'
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
