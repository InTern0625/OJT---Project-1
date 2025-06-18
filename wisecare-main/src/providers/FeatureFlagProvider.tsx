'use client'
import { createContext, useContext, useState } from 'react'

interface Flags {
  [key: string]: boolean
}

const FeatureFlagContext = createContext<{ flags: Flags }>({
  flags: {},
})

const FeatureFlagProvider = ({
  flags: initialFlags,
  children,
}: {
  flags: Flags
  children: React.ReactNode
}) => {
  const [flags, _setFlags] = useState<Flags>(initialFlags)
  return (
    <FeatureFlagContext.Provider value={{ flags }}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

const useFeatureFlag = (flag: string) => {
  const { flags } = useContext(FeatureFlagContext)
  if (flags[flag] === undefined) {
    throw new Error(`Feature flag ${flag} is not defined`)
  }
  return flags[flag]
}

export { FeatureFlagContext, FeatureFlagProvider, useFeatureFlag }
