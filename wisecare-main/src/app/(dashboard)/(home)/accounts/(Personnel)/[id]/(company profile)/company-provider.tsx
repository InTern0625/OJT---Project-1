'use client'
import { Tables } from '@/types/database.types'
import { createContext, ReactNode, useContext, useState } from 'react'

const useCompanyContext = () => {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('context must be used within a Provider')
  }
  return context
}

const CompanyContext = createContext<{
  userRole: string
  setUserRole: (value: string) => void
  accountId: string
  setAccountId: (value: string) => void
  oldEmployeeData: Tables<'company_employees'> | null
  setOldEmployeeData: (value: Tables<'company_employees'> | null) => void
}>({
  userRole: '',
  setUserRole: () => {},
  accountId: '',
  setAccountId: () => {},
  oldEmployeeData: null,
  setOldEmployeeData: () => {},
})

const CompanyProvider = ({
  companyId,
  role,
  children,
}: {
  companyId: string
  role: string
  children: ReactNode
}) => {
  const [userRole, setUserRole] = useState<string>(role)
  const [accountId, setAccountId] = useState<string>(companyId)
  const [oldEmployeeData, setOldEmployeeData] =
    useState<Tables<'company_employees'> | null>(null)

  return (
    <CompanyContext.Provider
      value={{
        userRole,
        setUserRole,
        accountId,
        setAccountId,
        oldEmployeeData,
        setOldEmployeeData,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export default CompanyProvider
export { useCompanyContext }
