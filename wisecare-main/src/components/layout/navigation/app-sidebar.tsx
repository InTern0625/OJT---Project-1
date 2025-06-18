'use server'
import AdminNavigation from '@/components/layout/navigation/admin-navigation'
import NavLogo from '@/components/layout/navigation/nav-logo'
import NavUser from '@/components/layout/navigation/nav-user'
import Navigation from '@/components/layout/navigation/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

const AppSidebar = async () => {
  const supabase = createServerClient(await cookies())
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="mt-8 mb-2">
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <Navigation />
        <AdminNavigation />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
