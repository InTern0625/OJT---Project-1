import React, { FC } from 'react'
import EmployeesInformation from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/employees-information'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import getEmployeeInputs from '@/queries/get-employee-inputs'
import { Tables } from '@/types/database.types'
import { createBrowserClient } from '@/utils/supabase-client'

interface Props {
  companyId: string
}

const EmployeesPage: FC<Props> = ({ companyId }) => {
  const supabase = createBrowserClient()
  const { data: employees, isPending } = useQuery(
    getEmployeeInputs(supabase, companyId),
  )

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-between gap-6">
      {isPending &&
        [1, 2, 3].map((i) => (
          <Collapsible
            key={i}
            className={
              'bg-background mx-auto w-full rounded-2xl border border-slate-200 p-6 drop-shadow-md'
            }
          ></Collapsible>
        ))}
      {employees &&
        employees.map((employee) => (
          <Collapsible
            key={employee.id}
            className={
              'bg-background mx-auto w-full rounded-2xl border border-slate-200 p-6 drop-shadow-md'
            }
          >
            <CollapsibleTrigger asChild={true}>
              <Button
                variant="ghost"
                className="w-full max-w-5xl items-center justify-between p-0 hover:bg-transparent"
              >
                <span className="text-lg font-semibold capitalize">
                  {employee.first_name} {employee.last_name}
                </span>
                <ChevronsUpDown className="justify-end" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid-cols-3 lg:grid">
                <EmployeesInformation
                  data={employee as unknown as Tables<'company_employees'>}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
    </div>
  )
}

export default EmployeesPage
