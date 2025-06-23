'use client'
import { createContext, ReactNode, useContext, useState } from 'react'

const useCompanyEditContext = () => {
  const context = useContext(CompanyEditContext)
  if (context === undefined) {
    throw new Error('context must be used within a Provider')
  }
  return context
}

const CompanyEditContext = createContext({
  editMode: false,
  setEditMode: (_value: boolean) => {},
})

const CompanyEditProvider = ({ children }: { children: ReactNode }) => {
  const [editMode, setEditMode] = useState(false)

  return (
    <CompanyEditContext.Provider
      value={{
        editMode,
        setEditMode,
      }}
    >
      {children}
    </CompanyEditContext.Provider>
  )
}

export default CompanyEditProvider
export { useCompanyEditContext }
