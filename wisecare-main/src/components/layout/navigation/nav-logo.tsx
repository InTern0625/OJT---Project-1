import WisecareLogo from '@/assets/images/wisecare-logo-2 1.png'
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import Image from 'next/image'

const NavLogo = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Image
          src={WisecareLogo}
          alt="Wisecare Logo"
          height={32}
          className="mx-auto"
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default NavLogo
