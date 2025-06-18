'use client'

import SettingsNavItem from '@/app/(dashboard)/settings/(layout)/settings-nav-item'
import { useSettingsContext } from '@/app/(dashboard)/settings/(layout)/settings-provider'
import { Button } from '@/components/ui/button'
import { UserCog, X, Lock } from 'lucide-react'
import { ComponentType, useState } from 'react'

const navigationLinks: {
  name: string
  description: string
  url: string
  icon: ComponentType<{ className?: string }>
}[] = [
  {
    name: 'Account',
    description: 'Manage your account settings',
    url: '/settings/account',
    icon: UserCog,
  },
  {
    name: 'Security',
    description: 'Manage your security settings',
    url: '/settings/security',
    icon: Lock,
  },
]

const SettingsNavigation = () => {
  const { isOpen, setIsOpen } = useSettingsContext()

  return (
    <div
      data-open={isOpen}
      className="border-border absolute -left-[600px] z-20 h-[calc(100vh-64px)] w-full border-r bg-white transition-all duration-1000 data-[open=true]:left-0 sm:-left-96 sm:w-96 md:-left-24 md:-z-10 md:data-[open=true]:left-72 md:data-[open=true]:z-20 lg:relative lg:left-0 lg:z-20 lg:transition-none"
    >
      <div className="flex flex-row items-center justify-between px-8 py-9">
        <h2 className="text-3xl font-extrabold">Settings</h2>

        <Button
          variant={'ghost'}
          size={'icon'}
          className="lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="divide-border border-border divide-y border-y">
        {navigationLinks.map((link) => (
          <SettingsNavItem {...link} key={link.url} />
        ))}
      </div>
    </div>
  )
}

export default SettingsNavigation
