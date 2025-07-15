'use client'

import getEmployeeByCompanyId from '@/queries/get-employee-by-company-id'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { useMemo } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

const MemberType = ({ companyId }: { companyId: string }) => {
  const supabase = createBrowserClient()
  const { data } = useQuery(getEmployeeByCompanyId(supabase, companyId))

  const principal = useMemo(
    () =>
      data?.filter(
        (employee) =>
          employee.member_type === 'principal' &&
          (!employee.cancelation_date ||
            new Date(employee.cancelation_date) >= new Date()),
      ),
    [data],
  )

  const dependent = useMemo(
    () =>
      data?.filter(
        (employee) =>
          employee.member_type === 'dependent' &&
          (!employee.cancelation_date ||
            new Date(employee.cancelation_date) >= new Date()),
      ),
    [data],
  )
  return (
    <div className="hidden grid-cols-2 gap-2 lg:grid">
      <div className="mb-4 w-24 rounded-lg p-3">
        <div className="text-muted-foreground text-sm">Principal</div>
        <div className="text-2xl font-bold">{principal?.length}</div>
      </div>
      <div className="mb-4 w-24 rounded-lg p-3">
        <div className="text-muted-foreground text-sm">Dependent</div>
        <div className="text-2xl font-bold">{dependent?.length}</div>
      </div>
    </div>
  )
}

export default MemberType
