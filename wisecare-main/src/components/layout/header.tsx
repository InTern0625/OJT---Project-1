'use server'
import { Sheet } from '@/components/ui/sheet'

import NotificationBell from '@/components/layout/notification/notification-bell'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ButtonBack } from '@/components/layout/navigation/navigation-back'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

const Header = async () => {
  const supabase = createServerClient(await cookies())
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <Sheet>
      <header className="bg-card flex h-16 w-full flex-row items-center border-b px-3 py-2 shadow-md md:justif-start">
        <SidebarTrigger />
        <ButtonBack />
        {/* <SheetTrigger asChild={true}>
          <Button variant={'ghost'} size={'icon'} className="md:hidden">
            <Menu className="text-muted-foreground/50" />
          </Button>
        </SheetTrigger> */}
        <NotificationBell user={user} />
      </header>
    </Sheet>
  )
}

export default Header
