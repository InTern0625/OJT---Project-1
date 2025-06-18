'use client'

import { User } from '@supabase/supabase-js'
import { createContext, ReactNode, useContext, useState } from 'react'

const useUserServer = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

const UserContext = createContext<{
  user: User | null
  setUser: (user: User | null) => void
}>({
  user: null,
  setUser: () => {},
})

const UserProvider = ({
  children,
  user,
}: {
  children: ReactNode
  user: User | null
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(user)

  return (
    <UserContext.Provider
      value={{
        user: currentUser,
        setUser: setCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider, useUserServer }
