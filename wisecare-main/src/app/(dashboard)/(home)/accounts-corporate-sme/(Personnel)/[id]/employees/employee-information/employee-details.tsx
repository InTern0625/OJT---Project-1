import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tables } from '@/types/database.types'
import { format } from 'date-fns'
import {
  BookUser,
  Calendar,
  CalendarDays,
  CreditCard,
  DollarSign,
  Heart,
  Home,
  LucideIcon,
  MessageCircle,
  User,
  Users,
} from 'lucide-react'
import { FC, ReactNode } from 'react'
import getCompanyAffiliates from '@/queries/get-company-affiliates'
import { createBrowserClient } from '@/utils/supabase-client'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'

const supabase = createBrowserClient()

const EmployeeDetailsItem = (item: {
  label: string
  value: string
  icon: LucideIcon
}) => {
  const Icon = item.icon
  return (
    <div className="flex items-center gap-3">
      <Icon className="text-muted-foreground h-5 w-5 shrink-0" />
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{item.label}</span>
        <span className="text-muted-foreground text-sm capitalize">
          {item.value}
        </span>
      </div>
    </div>
  )
}

//Extend gender_type to company schema
interface ExtendedEmployeeData extends Tables<'company_employees'> {
  gender_type?: {
    id: string
    name: string
  } | null
  room_plan_type?: {
    id: string
    name: string
  } | null
  civil_status_type?: {
    id: string
    name: string
  } | null
}
interface EmployeeDetailsProps {
  button: ReactNode
  employeeData: ExtendedEmployeeData
}

const EmployeeDetails: FC<EmployeeDetailsProps> = ({
  button,
  employeeData,
}) => {

  const data = [
    {
      label: 'Birth Date',
      value: employeeData.birth_date
        ? format(new Date(employeeData.birth_date), 'PPP')
        : 'N/A',
      icon: Calendar,
    },
    { label: 'Gender', value: employeeData?.gender_type?.name, icon: User },
    { label: 'Civil Status', value: employeeData.civil_status_type?.name, icon: Heart },
    { label: 'Card Number', value: employeeData.card_number, icon: CreditCard },
    {
      label: 'Effective Date',
      value: employeeData.effective_date
        ? format(new Date(employeeData.effective_date), 'PPP')
        : 'N/A',
      icon: CalendarDays,
    },
    { label: 'Room Plan', value: employeeData.room_plan_type?.name, icon: Home },
    {
      label: 'Maximum Benefit Limit',
      value: employeeData.maximum_benefit_limit,
      icon: DollarSign,
    },
    { label: 'Member Type', value: employeeData.member_type, icon: User },
    {
      label: 'Dependent Relation',
      value: employeeData.dependent_relation,
      icon: Users,
    },
    {
      label: 'Principal Member Name',
      value: employeeData.principal_member_name,
      icon: BookUser,
    },
    {
      label: 'Expiration Date',
      value: employeeData.expiration_date
        ? format(new Date(employeeData.expiration_date), 'PPP')
        : 'N/A',
      icon: CalendarDays,
    },
    {
      label: 'Cancelation Date',
      value: employeeData.cancelation_date
        ? format(new Date(employeeData.cancelation_date), 'PPP')
        : 'N/A',
      icon: CalendarDays,
    },
    { label: 'Remarks', value: employeeData.remarks, icon: MessageCircle },
    { label: 'Affiliations', 
      value: 'placeholder', 
      icon: User},
  ]

  return (
    <Dialog>
      <DialogTrigger asChild={true}>{button}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>View the employee details</DialogDescription>
        </DialogHeader>

        <h4 className="mt-5 text-center text-xl font-semibold">
          {employeeData.first_name || ''} {employeeData.middle_name || ''}{' '}
          {employeeData.last_name || ''} {employeeData.suffix || ''}
        </h4>
        <div className="grid grid-cols-2 gap-4 py-4">
          {data.map((employee) => (
            <EmployeeDetailsItem
              key={employee.label}
              label={employee.label}
              icon={employee.icon}
              value={employee.value?.toString() ?? 'N/A'}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeDetails
