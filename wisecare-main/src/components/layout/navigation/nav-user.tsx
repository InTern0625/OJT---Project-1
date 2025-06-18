'use client'

import {
  Bell,
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  Settings,
  Lock,
  UserCog,
} from 'lucide-react'

import SignOutButton from '@/components/layout/signout-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { User } from '@supabase/supabase-js'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { genConfig } from 'react-nice-avatar'
import Link from 'next/link'

const Avatar = dynamic(() => import('react-nice-avatar'), {
  ssr: true,
})

const NavUser = ({ user }: { user?: User | null }) => {
  const { isMobile } = useSidebar()
  const avatarConfig = genConfig(user?.id || '')

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Suspense
                fallback={<Skeleton className="h-8 w-8 rounded-full" />}
              >
                <Avatar className="h-8 w-8 rounded-lg" {...avatarConfig} />
              </Suspense>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.user_metadata.first_name}{' '}
                  {user?.user_metadata.last_name}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full" {...avatarConfig} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.user_metadata.first_name}{' '}
                    {user?.user_metadata.last_name}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild={true}>
                <Link
                  href="/settings/account"
                  className="flex cursor-pointer flex-row items-center justify-start gap-4"
                >
                  <UserCog className="h-4 w-4" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild={true}>
                <Link
                  href="/settings/security"
                  className="flex cursor-pointer flex-row items-center justify-start gap-4"
                >
                  <Lock className="h-4 w-4" />
                  Security
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <SignOutButton />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default NavUser
