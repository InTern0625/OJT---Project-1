'use client'
import { createContext, ReactNode, useContext, useState } from 'react'
import { Tables } from '@/types/database.types'

const useAccountExportRequestsContext = () => {
  const context = useContext(AccountExportRequestsContext)
  if (!context) {
    throw new Error(
      'useAccountExportRequestsContext must be used within a AccountExportRequestsProvider',
    )
  }
  return context
}

const AccountExportRequestsContext = createContext({
  isModalOpen: false,
  setIsModalOpen: (_value: boolean) => {},
  isLoading: false,
  setIsLoading: (_value: boolean) => {},
  selectedData: undefined as Tables<'pending_export_requests'> | undefined,
  setSelectedData: (_value: any) => {},
})

const AccountExportRequestsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedData, setSelectedData] = useState<any | undefined>(undefined)
  return (
    <AccountExportRequestsContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        isLoading,
        setIsLoading,
        selectedData,
        setSelectedData,
      }}
    >
      {children}
    </AccountExportRequestsContext.Provider>
  )
}

export { AccountExportRequestsProvider, useAccountExportRequestsContext }
