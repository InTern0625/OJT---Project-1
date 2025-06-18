'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

const useSettingsContext = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider')
  }
  return context
}

const SettingsContext = createContext<{
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}>({ isOpen: false, setIsOpen: () => {} })

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SettingsContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SettingsContext.Provider>
  )
}

export { useSettingsContext, SettingsProvider }
