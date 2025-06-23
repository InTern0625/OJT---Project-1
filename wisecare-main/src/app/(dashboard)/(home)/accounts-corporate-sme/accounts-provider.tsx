import { ReactNode, createContext, useContext, useState } from 'react'

const useAccountsContext = () => {
  const context = useContext(AccountsContext)
  if (context === undefined) {
    throw new Error('useAccountsContext must be used within a AccountsProvider')
  }
  return context
}

const AccountsContext = createContext({
  isFormOpen: false,
  setIsFormOpen: (_value: boolean) => {},
})

const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  return (
    <AccountsContext.Provider
      value={{
        isFormOpen,
        setIsFormOpen,
      }}
    >
      {children}
    </AccountsContext.Provider>
  )
}

export default AccountsProvider
export { useAccountsContext }
