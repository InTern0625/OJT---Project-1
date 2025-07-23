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
import DeletePendingExportRequests from '@/app/(dashboard)/(home)/accounts-ifp/export-requests/delete-pending-export-requests'
import getAccounts from '@/queries/get-accounts'
import { createBrowserClient } from '@/utils/supabase-client'


interface ExportAccountsModalProps {
  exportData: Enums<'export_type'>
  exportType?: string
  columnSortingID?: string
  customSortID?: string | null
}


const ExportAccountsModal: FC<ExportAccountsModalProps> = ({ exportData, exportType, columnSortingID, customSortID }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const supabase = createBrowserClient()
  const [pendingRequest, setIsPendingRequest] = useState('')
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const filters = customSortID && columnSortingID
    ? {
        customSort: {
          key: columnSortingID,
          value: customSortID,
        },
      }
    : {}

  const { data: oldAccountsData } = useQuery(getAccounts(supabase, filters))
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


    const accountsData = oldAccountsData
      .filter((account) =>{
        if (exportType == "renewals"){
          const now = new Date()
          const threeMonthsLater = new Date()
          threeMonthsLater.setMonth(now.getMonth() + 3)
          const isBusiness = account.account_type !== null;
          const isIFP = account.program_type !== null;


          const validAccount = (!isBusiness && isIFP) || (!isBusiness && !isIFP);


          const expiration = account.expiration_date ? new Date(account.expiration_date) : null
         
          const isExpirationValid = expiration !== null && expiration <= threeMonthsLater


          return validAccount && isExpirationValid
        }else if (exportType == "accounts"){
          const isBusiness = account.account_type !== null;
          const isIFP = account.program_type !== null;


          const validAccount = (!isBusiness && isIFP) || (!isBusiness && !isIFP);
          return validAccount
        }else{
          return account
        }
      })
      .map((account) => {
      const { id, created_at, updated_at, is_account_active, ...rest } = account
      const birthdate = account.birthdate ? new Date(account.birthdate) : null
      const age = birthdate
        ? new Date().getFullYear() - birthdate.getFullYear() -
          (new Date().getMonth() < birthdate.getMonth() ||
          (new Date().getMonth() === birthdate.getMonth() && new Date().getDate() < birthdate.getDate()) ? 1 : 0)
        : null


      return {
        'Complete Name': account.company_name || '',
        'Age': age || '',
        'Gender': account.gender_type
          ? (account.gender_type as any).name || ''
          : '',
        'Civil Status': account.civil_status
          ? (account.civil_status as any).name || ''
          : '',
        'Permanent Address': account.company_address || '',
        'Contact Number': account.contact_number || '',
        'Email Address':
          account.email_address_of_contact_person || '',
        'Card Number': account.contact_number || '',
        'Effective Date': account.effective_date || '',
        'Expiration Date': account.expiration_date || '',
        'Mode of Payment': account.mode_of_payment
          ? (account.mode_of_payment as any).name
          : '',
        'HMO Provider': account.hmo_provider
          ? (account.hmo_provider as any).name
          : '',
        'Program Type': account.program_type
          ? (account.program_type as any).name
          : '',
        'MBL': account.mbl || '',
        'Premium': account.premium || '',
        Agent: account.agent
          ? `${account.agent?.[0].first_name} ${account.agent?.[0].last_name}`
          : '',
        'Commission Rate': account.commision_rate || '',
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



