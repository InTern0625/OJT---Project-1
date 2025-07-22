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

// ✅ Extended type to include related company affiliate
type CompanyEmployeeWithAffiliate = Tables<'company_employees'> & {
  company_affiliates?: Pick<Tables<'company_affiliates'>, 'affiliate_name'>
}

const employeesColumns: ColumnDef<CompanyEmployeeWithAffiliate>[] = [
  {
    accessorKey: 'card_number',
    header: ({ column }) => <TableHeader column={column} title="Card Number" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.card_number}</span>
    ),
  },
  {
    accessorKey: 'full_name',
    header: ({ column }) => <TableHeader column={column} title="Full Name" />,
    cell: ({ row }) => {
      const {
        first_name = '',
        middle_name = '',
        last_name = '',
        suffix = '',
      } = row.original
      return `${first_name} ${middle_name} ${last_name} ${suffix}`.trim()
    },
  },
  {
    accessorKey: 'member_type',
    header: ({ column }) => <TableHeader column={column} title="Member Type" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.member_type}</span>
    ),
  },
  {
    id: 'company_affiliate',
    header: ({ column }) => (
      <TableHeader column={column} title="Affiliated Company" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.company_affiliates?.affiliate_name ?? '---'}
      </span>
    ),
    accessorFn: (originalRow) =>
      (originalRow as CompanyEmployeeWithAffiliate).company_affiliates
        ?.affiliate_name ?? '',
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
            <DropdownMenuSeparator />
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
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default employeesColumns
