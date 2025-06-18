import { Button } from '@/components/ui/button'
import { cn } from '@/utils/tailwind'
import {
  ActivitySquare,
  CalendarClock,
  CreditCard,
  UserCircle,
  Users,
  X,
} from 'lucide-react'
import { ComponentType, FC } from 'react'
import { TypeTabs, useTypesContext } from './type-card'

interface NavigationLink {
  name: string
  description: string
  tab: TypeTabs
  icon: ComponentType<{ className?: string }>
}

const navigationLinks: NavigationLink[] = [
  {
    name: 'Account Types',
    description: 'Manage account types',
    tab: 'account_types',
    icon: UserCircle,
  },
  {
    name: 'HMO Providers',
    description: 'Manage HMO Providers',
    tab: 'hmo_providers',
    icon: ActivitySquare,
  },
  {
    name: 'Mode of Payments',
    description: 'Manage mode of payments',
    tab: 'mode_of_payments',
    icon: CreditCard,
  },
  {
    name: 'Plan Types',
    description: 'Manage plan types',
    tab: 'plan_types',
    icon: Users,
  },
]

const NavigationItem: FC<NavigationLink> = ({
  name,
  description,
  tab,
  icon: Icon,
}) => {
  const { page, setPage, setIsNavOpen } = useTypesContext()

  const handleClick = () => {
    setPage(tab)
    setIsNavOpen(false)
  }
  return (
    <button
      className={cn(
        page === tab ? 'bg-primary/10' : 'hover:bg-muted',
        'flex max-h-28 w-full cursor-pointer flex-row items-start justify-start gap-3 px-8 py-5 sm:w-96',
      )}
      onClick={handleClick}
    >
      <Icon
        className={cn(
          page === tab ? 'text-primary' : 'text-foreground/80',
          'h-6 w-6',
        )}
      />
      <div className="flex flex-col gap-0.5">
        <span
          className={cn(
            page === tab ? 'text-primary' : 'text-foreground/80',
            'text-left text-sm font-medium',
          )}
        >
          {name}
        </span>
        <span className="text-muted-foreground/70 text-sm">{description}</span>
      </div>
    </button>
  )
}

interface Props {
  open: boolean
}

const TypesNavigation: FC<Props> = ({ open }) => {
  const { setIsNavOpen } = useTypesContext()
  return (
    <>
      <div
        data-open={open}
        className="border-border absolute -left-[600px] z-20 h-[calc(100vh-64px)] w-full border-r bg-white transition-all duration-1000 data-[open=true]:left-0 sm:-left-96 sm:w-96 md:-left-24 md:-z-10 md:data-[open=true]:left-72 md:data-[open=true]:z-20 lg:relative lg:left-0 lg:z-20 lg:transition-none"
      >
        <div className="flex flex-row items-center justify-between px-8 py-9">
          <h2 className="text-3xl font-extrabold">Manage Types</h2>
          <Button
            variant={'ghost'}
            size={'icon'}
            onClick={() => setIsNavOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="divide-border border-border divide-y border-y">
          {navigationLinks.map((link) => (
            <NavigationItem {...link} key={link.tab} />
          ))}
        </div>
      </div>
      <div
        data-open={open}
        className="absolute z-10 hidden h-screen w-screen bg-black/50 transition-all duration-1000 data-[open=true]:block md:hidden"
        onClick={() => setIsNavOpen(false)}
      />
    </>
  )
}

export default TypesNavigation
