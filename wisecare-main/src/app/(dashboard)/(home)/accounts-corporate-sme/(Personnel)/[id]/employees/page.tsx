'use server'
import CompanyProvider from '@/app/(dashboard)/(home)/accounts/(Personnel)/[id]/(company profile)/company-provider'
import employeesColumns from '@/app/(dashboard)/(home)/accounts/(Personnel)/[id]/employees/employees-columns'
import EmployeesDataTable from '@/app/(dashboard)/(home)/accounts/(Personnel)/[id]/employees/employees-data-table'
import getEmployeeByCompanyId from '@/queries/get-employee-by-company-id'
import getRole from '@/utils/get-role'
import { createServerClient } from '@/utils/supabase'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { cookies } from 'next/headers'

const EmployeesPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params
  const supabase = createServerClient(await cookies())
  const companyId = params.id

  const queryClient = new QueryClient()
  await prefetchQuery(queryClient, getEmployeeByCompanyId(supabase, companyId))

  const role = await getRole()
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CompanyProvider companyId={companyId} role={role ?? ''}>
        <div className="ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden">
          <EmployeesDataTable companyId={companyId} role={role ?? ''} />
        </div>
      </CompanyProvider>
    </HydrationBoundary>
  )
}

export default EmployeesPage
