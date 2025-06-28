'use client'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const NavigationItem = ({
  title,
  href,
  icon: Icon,
}: {
  title: string
  href: string
  icon?: ReactNode
}) => {
  const pathName = usePathname()
  const { setOpenMobile } = useSidebar()

  const isActive = pathName === href

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild={true} isActive={isActive}>
        <Link
          className="flex h-11! flex-row items-center gap-4 px-4 py-2.5"
          href={href}
          onClick={() => setOpenMobile(false)}
          prefetch={false}
        >
          {Icon && Icon}
          <span className="text-[13px] font-medium">{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default NavigationItem
