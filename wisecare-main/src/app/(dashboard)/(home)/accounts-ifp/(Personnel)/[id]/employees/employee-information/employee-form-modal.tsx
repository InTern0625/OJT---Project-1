'use client'

import EmployeeForm from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/employees/employee-information/employee-form'
import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-provider'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tables } from '@/types/database.types'
import { FC, ReactNode, useState } from 'react'

interface AddEmployeeModalProps {
  oldEmployeeData?: Tables<'company_employees'>
  button: ReactNode
}

const EmployeeFormModal: FC<AddEmployeeModalProps> = ({
  oldEmployeeData,
  button,
}) => {
  const { userRole } = useCompanyContext()
  const [isOpen, setIsOpen] = useState(false)

  if (
    !userRole ||
    !['marketing', 'finance', 'under-writing', 'after-sales', 'admin'].includes(
      userRole,
    )
  ) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={true}>{button}</DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            {oldEmployeeData ? 'Edit Employee' : 'Add Employee'}
          </DialogTitle>
          <DialogDescription>
            {oldEmployeeData
              ? 'Edit the employee details'
              : 'Add a new employee to the company'}
          </DialogDescription>
        </DialogHeader>

        {/* Employee Form */}
        <EmployeeForm setIsOpen={setIsOpen} oldEmployeeData={oldEmployeeData} />
        {/* End of Employee Form */}
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeFormModal
