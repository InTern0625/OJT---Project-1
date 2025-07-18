'use client'
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const SubNavigationItem = ({
  title,
  href,
  icon: Icon,
  badge,
}: {
  title: string
  href: string
  icon?: ReactNode
  badge?: ReactNode
}) => {
  const pathName = usePathname()
  const { setOpenMobile } = useSidebar()

  const isActive = pathName === href

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild={true} isActive={isActive}>
        <Link
          className="flex h-11! flex-row items-center justify-between gap-4 px-4 py-2.5"
          href={href}
          onClick={() => setOpenMobile(false)}
        >
          {Icon && Icon}
          <span className="flex items-center text-[13px] font-medium">
            {title}
          </span>
          {badge && badge}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

export default SubNavigationItem
