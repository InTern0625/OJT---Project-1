import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-provider'
import EmployeeDeleteRequests from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/employees/export-requests/employee-delete-requests'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { Enums } from '@/types/database.types'
import { useInsertMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { Loader2 } from 'lucide-react'
import { FC, ReactNode, useCallback, useState } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'
import { Tables } from '@/types/database.types'

interface ExtendedEmployeeData extends Tables<'company_employees'> {
  gender_type?: {
    id: string
    name: string
  } | null
  civil_status_type?: {
    id: string
    name: string
  } | null
  room_plan?: {
    id: string
    name: string
  } | null
}
interface EmployeeExportModalProps {
  exportData: Enums<'export_type'>
  button: ReactNode
}

const EmployeeExportModal: FC<EmployeeExportModalProps> = ({
  exportData,
  button,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [pendingRequests, setPendingRequests] = useState('')
  const { accountId } = useCompanyContext()
  const supabase = createBrowserClient()

  const { mutateAsync, isPending } = useInsertMutation(
    //@ts-ignore
    supabase.from('pending_export_requests'),
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          title: 'Export Request Submitted',
          variant: 'default',
          description:
            'Your export request has been submitted and is waiting for approval',
        })
        setIsOpen(false)
      },
      onError: (error) => {
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
          description: error.message,
        })
      },
    },
  )

  const handleApproval = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('pending_export_requests')
      .select('id')
      .eq('created_by', user?.id)
      .eq('account_id', accountId)
      .eq('export_type', exportData)
      .eq('is_active', true)
      .eq('is_approved', false)
      .single()

    if (data) {
      setPendingRequests(data.id)
      setIsDeleteOpen(true)
    } else {
      setIsOpen(true)
    }
  }, [accountId, exportData, supabase])

  const handleConfirm = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: oldEmployeesData } = await supabase
      .from('company_employees')
      .select(`
      id,
      account_id,
      first_name,
      last_name,
      birth_date,
      card_number,
      effective_date,
      maximum_benefit_limit,
      created_at,
      updated_at,
      created_by,
      cancelation_date,
      dependent_relation,
      expiration_date,
      member_type,
      remarks,
      middle_name,
      suffix,
      principal_member_name,
      gender_type: gender_types_id(name, id),
      civil_status_type: civil_status_id (name, id),
      room_plan: room_plan_id (name, id)
      `)
      .eq('account_id', accountId) as unknown as { data: ExtendedEmployeeData[] }
    if (!oldEmployeesData || oldEmployeesData.length === 0) {
      toast({
        title: 'No employees data found',
        variant: 'destructive',
        description: 'No employees data found to export',
      })
      return
    }

    const employeesData = oldEmployeesData.map((employee) => {
      const {
        id,
        account_id,
        created_at,
        created_by,
        updated_at,
        ...rest
      } = employee

      return {
        'Full Name': `${employee.first_name || ''} ${employee.middle_name || ''} ${employee.last_name || ''} ${employee.suffix || ''}`,
        'Card Number': employee.card_number || '',
        'Effective Date': employee.effective_date || '',
        'Room Plan': employee?.room_plan?.name || '',
        'Maximum Benefit Limit': employee.maximum_benefit_limit || '',
        'Gender': employee?.gender_type?.name || '',
        'Date of Birth': employee.birth_date || '',
        'Civil Status': employee?.civil_status_type?.name || '',
        'Dependent Relation': employee.dependent_relation || '',
        'Member Type': employee.member_type || '',
        'Expiration Date': employee.expiration_date || '',
        'Cancelation Date': employee.cancelation_date || '',
        Remarks: employee.remarks || '',
        'Principal Member Name': employee.principal_member_name || '',
      }
    })
    
    await mutateAsync([
      {
        export_type: exportData,
        created_by: user?.id,
        account_id: accountId,
        data: employeesData,
      },
    ])
  }

  return (
    <>
      <div onClick={handleApproval}>{button}</div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirm Export Submission</DialogTitle>
          </DialogHeader>
          <div>
            Are you sure you want to submit this file for approval? Your export
            request will be reviewed before it is processed.
          </div>
          <DialogFooter>
            <Button
              variant={'default'}
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin" /> : 'Confirm'}
            </Button>
            <Button variant={'outline'} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <EmployeeDeleteRequests
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        pendingRequestsId={pendingRequests}
      />
    </>
  )
}

export default EmployeeExportModal
