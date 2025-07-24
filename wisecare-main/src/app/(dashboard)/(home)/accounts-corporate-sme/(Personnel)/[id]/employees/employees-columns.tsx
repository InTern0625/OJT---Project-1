import DeleteEmployee from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/employees/employee-information/delete-employee'
import EmployeeDetails from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/employees/employee-information/employee-details'
import EmployeeFormModal from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/employees/employee-information/employee-form-modal'
import TableHeader from '@/components/table-header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tables } from '@/types/database.types'
import { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-provider'
import getCompanyName from '@/queries/get-company-name-by-id'
import { createBrowserClient } from '@/utils/supabase-client'
import { useEffect, useState } from 'react'

const CompanyAffiliationCell = ({ employee }: { employee: any }) => {
  const [companyName, setCompanyName] = useState<string | null>(null)
  const { accountId } = useCompanyContext()

  useEffect(() => {
    if (!employee?.affiliate?.affiliate_name && employee?.account_id) {
      const fetchName = async () => {
        const supabase = createBrowserClient()
        const { data } = await getCompanyName(supabase, accountId)

        setCompanyName(data?.company_name ?? null)
      }
      fetchName()
    }
  })

  const name = employee?.affiliate?.affiliate_name ?? companyName ?? '---'

  return <span>{name}</span>
}

const employeesColumns: ColumnDef<Tables<'company_employees'>>[] = [
  // company name is not needed since we are already in the company page
  {
    accessorKey: 'card_number',
    header: ({ column }) => <TableHeader column={column} title="Card Number" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.card_number}</span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.card_number ?? '',
  },
  {
    accessorKey: 'full_name',
    header: ({ column }) => <TableHeader column={column} title="Full Name" />,
    cell: ({ row }) => {
      const name = row.original.first_name || ''
      const lastName = row.original.last_name || ''
      const middleName = row.original.middle_name || ''
      const suffix = row.original.suffix || ''

      return `${name} ${middleName} ${lastName} ${suffix}`
    },
    accessorFn: (originalRow) =>
      `${(originalRow as any).first_name ?? ''} ${(originalRow as any).middle_name ?? ''} ${(originalRow as any).last_name ?? ''} ${(originalRow as any).suffix ?? ''}`,
  },
  {
    accessorKey: 'member_type',
    header: ({ column }) => <TableHeader column={column} title="Member Type" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.member_type}</span>
    ),
  },
  {
    accessorKey: 'affiliate?.affiliate_name',
    header: ({ column }) => <TableHeader column={column} title="Company Affiliation" />,
    cell: ({ row }) => <CompanyAffiliationCell employee={row.original} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const employee = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Employee Details Start */}
            <EmployeeDetails
              button={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
              }
              employeeData={employee}
            />
            {/* Employee Details End */}

            <DropdownMenuSeparator />

            {/* Edit employee Start */}
            <EmployeeFormModal
              oldEmployeeData={employee}
              button={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              }
            />
            {/* Edit employee End */}

            {/* Delete employee Start */}
            <DeleteEmployee
              originalData={employee}
              button={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              }
            />
            {/* Delete employee End */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default employeesColumns
