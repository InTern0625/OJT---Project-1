'use client'
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
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'
import {
  getTotal,
  isPendAccExp,
  isPendAcc,
  isPendEmpExp,
} from '@/utils/get-pending-count'
import { BookType, FileText, ListTodo, Minus, Plus, Users } from 'lucide-react'

const AdminNavigationClient = () => {
  const [totalCount, setTotalCount] = useState(0)
  const [accExCount, setAccExCount] = useState(0)
  const [accCount, setAccCount] = useState(0)
  const [empExCount, setEmpExCount] = useState(0)

  useEffect(() => {
    const supabase = createBrowserClient()

    const fetchData = async () => {
      const [total, accExp, acc, empExp] = await Promise.all([
        getTotal(supabase),
        isPendAccExp(supabase),
        isPendAcc(supabase),
        isPendEmpExp(supabase),
      ])

      setTotalCount(total)
      setAccExCount(accExp)
      setAccCount(acc)
      setEmpExCount(empExp)
    }

    fetchData()

    const interval = setInterval(fetchData, 3_000) 
    return () => clearInterval(interval)
  }, [])

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
                      <div data-count={totalCount > 0 ? "pending " : "none"} className="data-[count=pending]:opacity-100 data-[count=none]:opacity-0 flex text-white text-[10px] justify-center items-center w-4 h-4 bg-red-400 rounded-full">
                        {totalCount}
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
                      badge={
                      <div
                        data-count={accCount > 0 ? "pending" : "none"}
                        className="data-[count=pending]:opacity-100 data-[count=none]:opacity-0 flex text-white text-[10px] justify-center items-center w-4 h-4 bg-red-400 rounded-full"
                      >
                        {accCount}
                      </div>
                      }
                    />
                    <SubNavigationItem
                      title="Account Exports"
                      href="/admin/approval-request/account-exports"
                      badge={
                      <div
                        data-count={accExCount > 0 ? "pending" : "none"}
                        className="data-[count=pending]:opacity-100 data-[count=none]:opacity-0 flex text-white text-[10px] justify-center items-center w-4 h-4 bg-red-400 rounded-full"
                      >
                        {accExCount}
                      </div>
                      }
                    />
                    <SubNavigationItem
                      title="Company Employee Exports"
                      href="/admin/approval-request/employee-exports"
                      badge={
                      <div
                        data-count={empExCount > 0 ? "pending" : "none"}
                        className="data-[count=pending]:opacity-100 data-[count=none]:opacity-0 flex text-white text-[10px] justify-center items-center w-4 h-4 bg-red-400 rounded-full"
                      >
                        {empExCount}
                      </div>
                      }
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

export default AdminNavigationClient
