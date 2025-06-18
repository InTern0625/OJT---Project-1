'use server'
import NavigationItem from '@/components/layout/navigation/navigation-item'
import SubNavigationItem from '@/components/layout/navigation/sub-navigation-item'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar'
import isAdmin from '@/utils/is-admin'
import { createServerClient } from '@/utils/supabase'
import { BookType, FileText, ListTodo, Minus, Plus, Users } from 'lucide-react'
import { cookies } from 'next/headers'

const AdminNavigation = async () => {
  const supabase = createServerClient(await cookies())
  if (!(await isAdmin(supabase))) return null

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Admin</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild={true}>
                  <SidebarMenuButton asChild={true}>
                    <div className="flex h-11! flex-row items-center justify-between px-4 py-2.5">
                      <div className="flex flex-row items-center gap-4">
                        <ListTodo className="h-6 w-6" />
                        <span className="text-[13px] font-medium">
                          Approval Request
                        </span>
                      </div>
                      <Plus className="ml-auto h-4 w-4 group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto h-4 w-4 group-data-[state=closed]/collapsible:hidden" />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SubNavigationItem
                      title="Accounts"
                      href="/admin/approval-request/accounts"
                    />
                    <SubNavigationItem
                      title="Account Exports"
                      href="/admin/approval-request/account-exports"
                    />
                    <SubNavigationItem
                      title="Company Employee Exports"
                      href="/admin/approval-request/employee-exports"
                    />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <NavigationItem
              title="Users"
              href="/admin/users"
              icon={<Users className="h-6 w-6" />}
            />
            <NavigationItem
              title="Manage Types"
              href="/admin/types"
              icon={<BookType className="h-6 w-6" />}
            />
            <NavigationItem
              title="Agents"
              href="/admin/agents"
              icon={<Users className="h-6 w-6" />}
            />
            <NavigationItem
              title="Activity Log"
              href="/admin/logs"
              icon={<FileText className="h-6 w-6" />}
            />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}

export default AdminNavigation
