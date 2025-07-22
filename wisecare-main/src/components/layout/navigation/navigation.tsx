'use server'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  BookType,
  FileText,
  ListTodo,
  Minus,
  Plus,
  Users,
  User,
  Home,
  Building2,
  BookCheck,
} from 'lucide-react'
import getRole from '@/utils/get-role'
import { Book, BookCopy, Gauge, LucideDownload } from 'lucide-react'
import NavigationItem from './navigation-item'
import SubNavigationItem from '@/components/layout/navigation/sub-navigation-item'

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
        <SidebarGroupLabel>Corporate and SME Accounts</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <NavigationItem
              title="Accounts"
              href="/accounts-corporate-sme"
              icon={<BookCopy className="h-6 w-6" />}
            />
            {
              // only show pending tab if role is finance
              role && ['finance', 'admin', 'under-writing', 'finance'].includes(role) && (
                <NavigationItem
                  title="Billing Statements"
                  href="/billing-statements-corporate-sme"
                  icon={<Book className="h-6 w-6" />}
                />
              )
            }
            {
              // only show pending tab if role is finance
              role && ['admin', 'after-sales', 'marketing'].includes(role) && (
                <NavigationItem
                  title="Pending Renewals"
                  href="/renewals-corporate-sme"
                  icon={<BookCheck className="h-6 w-6" />}
                />
              )
            }
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>IFP Accounts</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <NavigationItem
              title="Accounts"
              href="/accounts-ifp"
              icon={<BookCopy className="h-6 w-6" />}
            />
            {
              // only show pending tab if role is finance
              role && ['finance', 'admin', 'under-writing', 'finance'].includes(role) && (
                <NavigationItem
                  title="Billing Statements"
                  href="/billing-statements-ifp"
                  icon={<Book className="h-6 w-6" />}
                />
              )
            }
            {
              // only show pending tab if role is finance
              role && ['admin', 'after-sales', 'marketing'].includes(role) && (
                <NavigationItem
                  title="Pending Renewals"
                  href="/renewals-ifp"
                  icon={<BookCheck className="h-6 w-6" />}
                />
              )
            }
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {
        role && ['admin'].includes(role) && (
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
        )
      }
      
    </>
  )
}

export default Navigation
