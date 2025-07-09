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
import AdminNavigationClient from '@/components/layout/navigation/admin-navigation-client'
import isAdmin from '@/utils/is-admin'
import { createServerClient } from '@/utils/supabase'
import { BookType, FileText, ListTodo, Minus, Plus, Users } from 'lucide-react'
import { cookies } from 'next/headers'
import { isPendEmpExp, isPendAcc, isPendAccExp, getTotal } from '@/utils/get-pending-count'

const AdminNavigation = async () => {
  const supabase = createServerClient(await cookies())
  if (!(await isAdmin(supabase))) return null

  return <AdminNavigationClient />
}

export default AdminNavigation
