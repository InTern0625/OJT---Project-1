'use client'
import { createContext, ReactNode, useContext, useState } from 'react'

const useCompanyEditContext = () => {
  const context = useContext(CompanyEditContext)
  if (context === undefined) {
    throw new Error('context must be used within a Provider')
  }
  return context
}

type CompanyEditContextType = {
  editMode: boolean
  setEditMode: (editMode: boolean) => void
  statusId: string | undefined
  setStatusId: (statusId: string | undefined ) => void
}

const CompanyEditContext = createContext<CompanyEditContextType>({
  editMode: false,
  setEditMode: (_value: boolean) => {},
  statusId: undefined,
  setStatusId: () => {},
})

const CompanyEditProvider = ({ children }: { children: ReactNode }) => {
  const [editMode, setEditMode] = useState(false)
  const [statusId, setStatusId] = useState<string | undefined>(undefined)

  return (
    <CompanyEditContext.Provider
      value={{
        editMode,
        setEditMode,
        statusId,
        setStatusId
      }}
    >
      {children}
    </CompanyEditContext.Provider>
  )
}

export default CompanyEditProvider
export { useCompanyEditContext }
