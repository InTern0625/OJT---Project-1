'use client'
import { cn } from '@/utils/tailwind'
import { IconNode } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentType } from 'react'

interface SettingsNavItemProps {
  name: string
  description: string
  url: string
  icon: ComponentType<{ className?: string }>
}

const SettingsNavItem = ({
  name,
  description,
  url,
  icon: Icon,
}: SettingsNavItemProps) => {
  const path = usePathname()
  const isActive = path.includes(url)

  return (
    <Link
      href={url}
      className={cn(
        isActive ? 'bg-primary/10' : 'hover:bg-muted',
        'flex max-h-28 w-full cursor-pointer flex-row items-start justify-start gap-3 px-8 py-5 sm:w-96',
      )}
    >
      <Icon
        className={cn(
          isActive ? 'text-primary' : 'text-foreground/80',
          'h-6 w-6',
        )}
      />
      <div className="flex flex-col gap-0.5">
        <span
          className={cn(
            isActive ? 'text-primary' : 'text-foreground/80',
            'text-left text-sm font-medium',
          )}
        >
          {name}
        </span>
        <span className="text-muted-foreground/70 text-sm">{description}</span>
      </div>
    </Link>
  )
}

export default SettingsNavItem
