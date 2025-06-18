'use client'
import { createContext, ReactNode, useContext, useState } from 'react'
import { Tables } from '@/types/database.types'

const useEmployeeExportRequestsContext = () => {
  const context = useContext(EmployeeExportRequestsContext)
  if (!context) {
    throw new Error(
      'useEmployeeExportRequestsContext must be used within a EmployeeExportRequestsProvider',
    )
  }
  return context
}

const EmployeeExportRequestsContext = createContext({
  isModalOpen: false,
  setIsModalOpen: (_value: boolean) => {},
  isLoading: false,
  setIsLoading: (_value: boolean) => {},
  selectedData: undefined as Tables<'pending_export_requests'> | undefined,
  setSelectedData: (_value: any) => {},
})

const EmployeeExportRequestsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedData, setSelectedData] = useState<any | undefined>(undefined)

  return (
    <EmployeeExportRequestsContext.Provider
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
    </EmployeeExportRequestsContext.Provider>
  )
}

export { EmployeeExportRequestsProvider, useEmployeeExportRequestsContext }
