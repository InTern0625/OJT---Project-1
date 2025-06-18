'use client'
import React from 'react'
import { createContext, ReactNode, useContext, useState } from 'react'
import { Tables } from '@/types/database.types'

const useDownloadsContext = () => {
  const context = useContext(DownloadsContext)
  if (!context) {
    throw new Error(
      'useAccountDownloadsContext must be used within a DownloadsProvider',
    )
  }
  return context
}

const DownloadsContext = createContext({
  isSheetOpen: false,
  setIsSheetOpen: (_value: boolean) => {},
  isLoading: false,
  setIsLoading: (_value: boolean) => {},
  file: null as Tables<'pending_export_requests'> | null,
  setFile: (_value: Tables<'pending_export_requests'> | null) => {},
})

const DownloadsProvider = ({ children }: { children: ReactNode }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<Tables<'pending_export_requests'> | null>(
    null,
  )
  return (
    <DownloadsContext.Provider
      value={{
        isSheetOpen,
        setIsSheetOpen,
        isLoading,
        setIsLoading,
        file,
        setFile,
      }}
    >
      {children}
    </DownloadsContext.Provider>
  )
}

export { DownloadsProvider, useDownloadsContext }
