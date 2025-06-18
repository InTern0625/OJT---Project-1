'use client'
import { Button } from '@/components/ui/button'

interface EmployeesAddPersonnelButtonProps {
  isPending: boolean
}

const EmployeesAddPersonnelButton = ({
  isPending,
}: EmployeesAddPersonnelButtonProps) => {
  return (
    <Button
      variant="outline"
      className="w-full rounded-md lg:w-auto"
      type="button"
      disabled={isPending}
    >
      Cancel
    </Button>
  )
}

export default EmployeesAddPersonnelButton
