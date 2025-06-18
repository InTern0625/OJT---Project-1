'use client'

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react'

const useBillingContext = () => {
  const context = useContext(BillingContext)
  if (!context) {
    throw new Error('useBillingContext must be used within a BillingProvider')
  }
  return context
}

const BillingContext = createContext({
  originalData: undefined,
  setOriginalData: (() => {}) as Dispatch<SetStateAction<any | undefined>>,
  isEditModalOpen: false,
  setIsEditModalOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
})

const BillingProvider = ({ children }: { children: ReactNode }) => {
  const [originalData, setOriginalData] = useState<any | undefined>(undefined)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  return (
    <BillingContext.Provider
      value={{
        originalData,
        setOriginalData,
        isEditModalOpen,
        setIsEditModalOpen,
      }}
    >
      {children}
    </BillingContext.Provider>
  )
}

export { BillingProvider, useBillingContext }
