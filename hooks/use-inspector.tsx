'use client'

import React, { createContext, useContext, useState } from 'react'

interface InspectorContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggle: () => void
}

const InspectorContext = createContext<InspectorContextType | undefined>(undefined)

export function InspectorProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen((prev) => !prev)

  return (
    <InspectorContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      {children}
    </InspectorContext.Provider>
  )
}

export function useInspector() {
  const context = useContext(InspectorContext)
  if (context === undefined) {
    throw new Error('useInspector must be used within an InspectorProvider')
  }
  return context
}
