'use client'
import ActiveBadge from '@/components/active-badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import getAccountById from '@/queries/get-account-by-id'
import getEmployeeCount from '@/queries/get-employee-count'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import Link from 'next/link'
import { FC } from 'react'
import InitialsAvatar from 'react-initials-avatar'
import { createBrowserClient } from '@/utils/supabase-client'

interface CompanyHeaderProps {
  id: string
  userRole?: string | null
}

const CompanyHeader: FC<CompanyHeaderProps> = ({ id, userRole }) => {
  const supabase = createBrowserClient()
  const { data: account } = useQuery(getAccountById(supabase, id))
  const { count: employeeCount, isPending } = useQuery(
    getEmployeeCount(supabase, id),
  )

  const canSeeBillingStatements = ['admin', 'finance'].includes(userRole || '')

  return (
    <div className="bg-background flex w-full flex-col pb-6 drop-shadow-md xl:mb-0 xl:justify-evenly">
      <div className="h-40 w-full bg-slate-400 object-cover xl:h-80"></div>
      <div className="relative mx-auto flex w-full max-w-6xl translate-y-4 flex-col items-center justify-between px-8 pt-16 text-center xl:h-28 xl:translate-y-1 xl:flex-row xl:gap-8 xl:px-0 xl:pt-1 xl:text-left">
        <div className="ring-background absolute -top-20 mx-auto flex flex-col items-center justify-between rounded-full bg-sky-950 ring-4 xl:relative xl:top-0 xl:-ml-4 xl:-translate-y-8">
          <InitialsAvatar
            name={account?.company_name || ''}
            className="h-32 w-32 translate-y-10 text-center text-5xl text-white"
          />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="text-md font-bold text-wrap break-all lg:leading-4">
            {account?.company_name || ''}
          </div>
          <div className="text-xs text-[#64748b] lg:text-wrap">
            {account?.company_address || ''}
          </div>
          {account?.is_account_active === false && (
            <div>
              <ActiveBadge isActive={false} />
            </div>
          )}
        </div>
        <div className="flex w-full flex-col items-center justify-evenly gap-4 xl:flex-row">
          <Separator
            className="text-muted-foreground hidden pt-12 xl:visible xl:block"
            orientation="vertical"
          />
          <div className="flex flex-row gap-12 pt-6 text-center xl:pt-0">
            <div className="flex flex-col">
              <div className="text-sm font-bold">
                {isPending ? (
                  <Skeleton className="mx-auto h-5 w-full" />
                ) : (
                  employeeCount
                )}
              </div>
              <div className="text-xs font-medium text-[#64748b] uppercase">
                Members
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-bold">
                {/*@ts-ignore*/}
                {account?.hmo_provider ? account?.hmo_provider.name : 'N/A'}
              </div>
              <div className="text-xs font-medium text-[#64748b] uppercase">
                HMO
              </div>
            </div>
          </div>
          <Separator
            className="text-muted-foreground hidden pt-12 xl:visible xl:block"
            orientation="vertical"
          />
        </div>
        <div className="text-muted-foreground inline-flex h-10 items-center justify-center rounded-md px-1 pt-2 pb-1">
          <Link
            href={`/accounts/${id}`}
            className="ring-offset-background focus-visible:ring-ring data-[state=active]:text-foreground inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap text-[#64748b] transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          >
            About
          </Link>
          {canSeeBillingStatements && (
            <Link
              href={`/accounts/${id}/billing`}
              className="ring-offset-background focus-visible:ring-ring data-[state=active]:text-foreground inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap text-[#64748b] transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
            >
              Billing Statements
            </Link>
          )}
          <Link
            href={`/accounts/${id}/employees`}
            className="ring-offset-background focus-visible:ring-ring data-[state=active]:text-foreground inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap text-[#64748b] transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          >
            Employees
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CompanyHeader
