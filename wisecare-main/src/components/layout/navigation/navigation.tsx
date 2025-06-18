'use server'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar'
import getRole from '@/utils/get-role'
import { Book, BookCopy, Gauge, LucideDownload } from 'lucide-react'
import NavigationItem from './navigation-item'

const Navigation = async () => {
  const role = await getRole()
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <NavigationItem
              title="Dashboard"
              href="/"
              icon={<Gauge className="h-6 w-6" />}
            />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Accounts</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <NavigationItem
              title="Accounts"
              href="/accounts"
              icon={<BookCopy className="h-6 w-6" />}
            />
            {
              // only show pending tab if role is finance
              role && ['finance', 'admin'].includes(role) && (
                <NavigationItem
                  title="Billing Statements"
                  href="/billing-statements"
                  icon={<Book className="h-6 w-6" />}
                />
              )
            }
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>File Manager</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <NavigationItem
              title="Download Files"
              href="/file-manager"
              icon={<LucideDownload className="h-6 w-6" />}
            />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}

export default Navigation
