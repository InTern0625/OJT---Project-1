import React, { FC, useCallback, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileDown, Loader2 } from 'lucide-react'
import {
  useInsertMutation,
  useQuery,
} from '@supabase-cache-helpers/postgrest-react-query'
import { toast } from '@/components/ui/use-toast'
import { Enums } from '@/types/database.types'
import DeletePendingExportRequests from '@/app/(dashboard)/(home)/accounts-corporate-sme/export-requests/delete-pending-export-requests'
import getAccounts from '@/queries/get-accounts'
import { createBrowserClient } from '@/utils/supabase-client'

interface ExportAccountsModalProps {
  exportData: Enums<'export_type'>
  exportType?: string
}

const ExportAccountsModal: FC<ExportAccountsModalProps> = ({ exportData, exportType }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const supabase = createBrowserClient()
  const [pendingRequest, setIsPendingRequest] = useState('')
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { data: oldAccountsData } = useQuery(getAccounts(supabase))
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
      .eq('export_type', exportData)
      .eq('created_by', user?.id)
      .eq('is_active', true)
      .eq('is_approved', false)
      .single()
    if (data) {
      setIsDeleteOpen(true)
      setIsPendingRequest(data.id)
    } else {
      setIsOpen(true)
    }
  }, [exportData, supabase])

  const handleConfirm = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!oldAccountsData || oldAccountsData.length === 0) {
      toast({
        title: 'No accounts data found',
        variant: 'destructive',
        description:
          'Ensure there is data in the accounts table for this user.',
      })
      return
    }
    const accountsData = oldAccountsData.map((account) => {
      const { id, created_at, updated_at, is_account_active, is_editing, ...rest } = account

      return {
        Agent: account.agent
          ? `${account.agent.first_name} ${account.agent.last_name}`
          : '',
        'Company Name': account.company_name || '',
        'Company Address': account.company_address || '',
        'HMO Provider': account.hmo_provider
          ? (account.hmo_provider as any).name
          : '',
        'Old HMO Provider': account.old_hmo_provider
          ? (account.old_hmo_provider as any).name
          : '',
        'Previous HMO Provider': account.previous_hmo_provider
          ? (account.previous_hmo_provider as any).name
          : '',
        'COC Issue Date': account.coc_issue_date || '',
        'Commission Rate': account.commision_rate || '',
        'Contact Number': account.contact_number || '',
        'Contact Person': account.contact_person || '',
        'Expiration Date': account.expiration_date || '',
        'Mode of Payment': account.mode_of_payment
          ? (account.mode_of_payment as any).name
          : '',
        'Effective Date': account.effective_date || '',
        'Original Effective Date': account.original_effective_date || '',
        'Orientation Date': account.orientation_date || '',
        'Name of Signatory': account.name_of_signatory || '',
        'Total Utilization': account.total_utilization || '',
        'Initial Head Count': account.initial_head_count || '',
        'Nature of Business': account.nature_of_business || '',
        'Total Premium Paid': account.total_premium_paid || '',
        'Dependent Plan Type': account.dependent_plan_type
          ? (account.dependent_plan_type as any).name
          : '',
        'Principal Plan Type': account.principal_plan_type
          ? (account.principal_plan_type as any).name
          : '',
        'Signatory Designation': account.signatory_designation || '',
        'Wellness Lecture Date': account.wellness_lecture_date || '',
        'Initial Contract Value': account.initial_contract_value || '',
        'Designation of Contact Person':
          account.designation_of_contact_person || '',
        'Delivery Date of Membership IDs':
          account.delivery_date_of_membership_ids || '',
        'Email Address of Contact Person':
          account.email_address_of_contact_person || '',
        'Annual Physical Examination Date':
          account.annual_physical_examination_date || '',
        'Additional Benefits': account.additional_benefits || '',
        'Special Benefits': account.special_benefits || '',
        'Summary of Benefits': account.summary_of_benefits || '',
        'Account Type': account.account_type ? `${account.account_type.name}`: '',

      }
    })
    await mutateAsync([
      {
        export_type: exportData,
        created_by: user?.id,
        data: accountsData,
      },
    ])
  }

  return (
    <>
      <Button
        className="space-x-2"
        variant={'outline'}
        onClick={handleApproval}
      >
        <FileDown />
        <span>Export</span>
      </Button>
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
      <DeletePendingExportRequests
        pendingRequestsId={pendingRequest}
        onClose={() => setIsDeleteOpen(false)}
        isOpen={isDeleteOpen}
      />
    </>
  )
}

export default ExportAccountsModal
