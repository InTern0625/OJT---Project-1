import DeleteEmployee from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/employees/employee-information/delete-employee'
import EmployeeDetails from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/employees/employee-information/employee-details'
import EmployeeFormModal from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/employees/employee-information/employee-form-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Enums, Tables } from '@/types/database.types'
import { Table } from '@tanstack/react-table'
import { Edit, Eye, Trash2 } from 'lucide-react'

const getMemberTypeColor = (type: Enums<'member_type'>) => {
  switch (type) {
    case 'principal':
      return 'bg-yellow-100 text-yellow-800'
    case 'dependent':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'text-gray-500 bg-gray-100'
  }
}

const EmployeeItem = ({ member }: { member: Tables<'company_employees'> }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              {member.first_name} {member.middle_name} {member.last_name}{' '}
              {member.suffix}
            </h3>
            {member.member_type && (
              <Badge
                className={`${getMemberTypeColor(member.member_type)} rounded px-2.5 py-0.5 text-xs font-semibold capitalize`}
              >
                {member.member_type}
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
        </div>
        <div className="flex justify-end space-x-2">
          <EmployeeDetails
            button={
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            }
            employeeData={member}
          />

          <EmployeeFormModal
            oldEmployeeData={member}
            button={
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            }
          />

          <DeleteEmployee
            originalData={member}
            button={
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

const EmployeeMobileTable = ({ table }: { table: Table<any> }) => {
  return (
    <div className="space-y-4 lg:hidden">
      {table.getRowModel().rows?.length &&
        table
          .getRowModel()
          .rows.map((row) => (
            <EmployeeItem key={row.id} member={row.original} />
          ))}
    </div>
  )
}

export default EmployeeMobileTable
