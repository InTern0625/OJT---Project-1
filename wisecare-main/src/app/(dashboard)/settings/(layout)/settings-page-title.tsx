'use client'
import { useSettingsContext } from '@/app/(dashboard)/settings/(layout)/settings-provider'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { FC } from 'react'

interface Props {
  title: string
}

const SettingsPageTitle: FC<Props> = ({ title }) => {
  const { setIsOpen } = useSettingsContext()
  return (
    <div className="flex flex-row items-center gap-1 px-3 lg:px-12">
      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={() => setIsOpen(true)}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  )
}

export default SettingsPageTitle
