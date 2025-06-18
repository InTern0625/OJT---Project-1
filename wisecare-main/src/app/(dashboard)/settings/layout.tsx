import SettingsNavigation from '@/app/(dashboard)/settings/(layout)/settings-navigation'
import { SettingsProvider } from '@/app/(dashboard)/settings/(layout)/settings-provider'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { FC, ReactNode } from 'react'

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SettingsProvider>
      <div className="flex w-full flex-row">
        <SettingsNavigation />
        <div className="w-full pt-9">{children}</div>
      </div>
    </SettingsProvider>
  )
}

export default SettingsLayout
