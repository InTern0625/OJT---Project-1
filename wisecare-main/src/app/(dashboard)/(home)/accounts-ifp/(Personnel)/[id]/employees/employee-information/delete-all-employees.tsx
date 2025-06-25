import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-provider'
import useConfirmationStore from '@/components/confirmation-dialog/confirmationStore'
import { toast } from '@/components/ui/use-toast'
import getEmployeeByCompanyId from '@/queries/get-employee-by-company-id'
import {
  useQuery,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query'
import { FC, ReactNode } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

interface DeleteAllEmployeesProps {
  button: ReactNode
}

const DeleteAllEmployees: FC<DeleteAllEmployeesProps> = ({ button }) => {
  const { openConfirmation } = useConfirmationStore()
  const supabase = createBrowserClient()
  const { accountId } = useCompanyContext()

  // get all employees
  const { data: employees } = useQuery(
    getEmployeeByCompanyId(supabase, accountId),
  )

  const { mutateAsync } = useUpsertMutation(
    // @ts-ignore
    supabase.from('company_employees'),
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Employees deleted!',
          description: 'All employees have been deleted successfully.',
        })
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: error.message,
        })
      },
    },
  )

  const handleDelete = async () => {
    // check if employees exist
    if (!employees) return

    // get user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // insert "delete request" for each employee
    await mutateAsync(
      employees?.map((employee) => ({
        id: employee.id,
        is_active: false,
        updated_at: new Date().toISOString(),
      })),
    )
  }

  return (
    <div
      onClick={() => {
        openConfirmation({
          title: 'Delete All Members?',
          description:
            'Are you sure you want to delete all members? This action CANNOT be undone.',
          actionLabel: 'I understand, delete all members',
          cancelLabel: 'Cancel',
          onAction: handleDelete,
          onCancel: () => {},
        })
      }}
    >
      {button}
    </div>
  )
}

export default DeleteAllEmployees
