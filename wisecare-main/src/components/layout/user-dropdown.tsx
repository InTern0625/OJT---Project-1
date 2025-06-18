'use client'
import { LogOut, UserCircle } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import useUser from '@/hooks/useUser'
import SignOutButton from './signout-button'

const UserDropdown = () => {
  const { data: user } = useUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <UserCircle className="text-primary-foreground/50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-card-foreground text-xs font-light">
            Signed in as
          </span>
          <span className="text-sm font-medium">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
