'use client'
import { Tables } from '@/types/database.types'
import { createContext, ReactNode, useContext, useState } from 'react'

const useApprovalRequestContext = () => {
  const context = useContext(ApprovalRequestContext)
  if (!context) {
    throw new Error(
      'useApprovalRequestContext must be used within a ApprovalRequestProvider',
    )
  }
  return context
}

const ApprovalRequestContext = createContext({
  isModalOpen: false,
  setIsModalOpen: (_value: boolean) => {},
  selectedData: undefined as Tables<'pending_accounts'> | undefined,
  setSelectedData: (_value: any) => {},
  isLoading: false,
  setIsLoading: (_value: boolean) => {},
})

const ApprovalRequestProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedData, setSelectedData] = useState<any | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <ApprovalRequestContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        selectedData,
        setSelectedData,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ApprovalRequestContext.Provider>
  )
}

export { ApprovalRequestProvider, useApprovalRequestContext }
