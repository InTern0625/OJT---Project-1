'use client'
import { createContext, useContext, useState } from 'react'
import CreateType from './create-type'
import TypeList from './type-list'
import TypesNavigation from './types-navigation'
import TypesTitle from './types-title'
import { createBrowserClient } from '@/utils/supabase-client'


const useTypesContext = () => {
  const context = useContext(TypesContext)
  if (context === undefined) {
    throw new Error('useTypesContext must be used within a TypesProvider')
  }
  return context
}

const TypesContext = createContext<{
  isNavOpen: boolean
  setIsNavOpen: (value: boolean) => void
  page: string
  setPage: (value: string) => void
}>({
  isNavOpen: false,
  setIsNavOpen: () => {},
  page: '',
  setPage: () => {},
})

const TypeCard = () => {
  const [page, setPage] = useState<string>('account_types')
  const [isNavOpen, setIsNavOpen] = useState(false)

  return (
    <TypesContext.Provider value={{ isNavOpen, setIsNavOpen, page, setPage }}>
      <div className="flex w-full flex-row">
        <TypesNavigation open={isNavOpen} />
        <div className="w-full pt-9">
          <TypesTitle handleClick={() => setIsNavOpen(true)} page={page} />
          <CreateType page={page} />
          <TypeList page={page} />
        </div>
      </div>
    </TypesContext.Provider>
  )
}

export default TypeCard
export { useTypesContext }
