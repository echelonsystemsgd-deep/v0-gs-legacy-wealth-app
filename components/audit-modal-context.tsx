'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuditModalContextType {
  isOpen: boolean
  tier: string | null
  openModal: (selectedTier?: string) => void
  closeModal: () => void
}

const AuditModalContext = createContext<AuditModalContextType | undefined>(undefined)

export const AuditModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tier, setTier] = useState<string | null>(null)

  // Pre-fill selected tier from query parameters if present (e.g. ?tier=Operations%20Machine)
  // Access window.location directly in useEffect to avoid de-optimizing layout via useSearchParams hook
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const tierParam = searchParams.get('tier')
      if (tierParam) {
        setTier(tierParam)
      }
    }
  }, [])

  const openModal = (selectedTier?: string) => {
    if (selectedTier) {
      setTier(selectedTier)
    }
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <AuditModalContext.Provider value={{ isOpen, tier, openModal, closeModal }}>
      {children}
    </AuditModalContext.Provider>
  )
}

export const useAuditModal = () => {
  const context = useContext(AuditModalContext)
  if (context === undefined) {
    throw new Error('useAuditModal must be used within an AuditModalProvider')
  }
  return context
}
