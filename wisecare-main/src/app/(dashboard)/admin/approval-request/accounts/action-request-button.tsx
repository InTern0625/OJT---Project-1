import { useApprovalRequestContext } from '@/app/(dashboard)/admin/approval-request/accounts/approval-request-provider'
import { useToast } from '@/components/ui/use-toast'
import { createBrowserClient } from '@/utils/supabase-client'
import {
  useUpdateMutation,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query'
import { FC, ReactNode, useEffect } from 'react'
import getTypesIDbyName from '@/queries/get-typesIDbyName'  

interface ActionRequestButtonProps {
  children: ReactNode
  action: 'approve' | 'reject'
}

const ActionRequestButton: FC<ActionRequestButtonProps> = ({
  children,
  action,
}) => {
  const supabase = createBrowserClient()
  const { toast } = useToast()
  const { selectedData, setIsModalOpen, setIsLoading } =
    useApprovalRequestContext()

  const {
    mutateAsync: upsertAccount,
    isError: isUpsertAccountError,
    isPending: isUpsertingAccount,
  } = useUpsertMutation(supabase.from('accounts') as any, ['id'], null, {
    onError: () => {
      toast({
        title: 'Error',
        description: 'An error occurred while approving the request',
      })
    },
  })

  const {
    mutateAsync: updatePendingAccount,
    isPending: isUpdatingPendingAccount,
  } = useUpdateMutation(supabase.from('pending_accounts') as any, ['id'], null, {
    onSuccess: () => {
      toast({
        title: `Request ${action === 'approve' ? 'approved' : 'rejected'}`,
        description: `The request has been ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      })
      setIsModalOpen(false)
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'An error occurred while approving the request',
      })
    },
  })

  const handleClick = async () => {
    if (!selectedData) throw new Error('Selected data is required')
    const { data: ActiveID } = await getTypesIDbyName(supabase, 'status_types', "Active")
    const { data: InactiveID } = await getTypesIDbyName(supabase, 'status_types', "Inactive")
    // Only insert account if action is approve
    if (action === 'approve') {
      // if selectedData is insert, then check if the account already exists in accounts
      if (selectedData.operation_type === 'insert') {
        const { data } = await supabase
          .from('accounts')
          .select('id')
          .eq('company_name', selectedData.company_name)
          .maybeSingle()
        if (data) {
          toast({
            title: 'Error',
            description: 'Account already exists',
          })
          return
        }
      }
      // Insert account
      await upsertAccount([
        {
          ...(selectedData.account_id && { id: selectedData.account_id }),
          company_name: selectedData.company_name,
          is_account_active: !(selectedData.is_delete_account),
          status_id: selectedData.is_delete_account ? InactiveID?.id : ActiveID?.id, // if delete account is true, then is_active is false
          agent_id: (selectedData as any).agent?.user_id,
          company_address: selectedData.company_address,
          nature_of_business: selectedData.nature_of_business,
          hmo_provider_id: (selectedData as any).hmo_provider?.id,
          previous_hmo_provider_id: (selectedData as any).previous_hmo_provider
            ?.id,
          old_hmo_provider_id: (selectedData as any).old_hmo_provider?.id,
          account_type_id: (selectedData as any).account_type?.id,
          total_utilization: selectedData.total_utilization,
          total_premium_paid: selectedData.total_premium_paid,
          signatory_designation: selectedData.signatory_designation,
          contact_person: selectedData.contact_person,
          contact_number: selectedData.contact_number,
          principal_plan_type_id: (selectedData as any).principal_plan_type?.id,
          dependent_plan_type_id: (selectedData as any).dependent_plan_type?.id,
          initial_head_count: selectedData.initial_head_count,
          effective_date: selectedData.effective_date,
          original_effective_date: selectedData.original_effective_date,
          coc_issue_date: selectedData.coc_issue_date,
          expiration_date: selectedData.expiration_date,
          delivery_date_of_membership_ids:
            selectedData.delivery_date_of_membership_ids,
          orientation_date: selectedData.orientation_date,
          initial_contract_value: selectedData.initial_contract_value,
          mode_of_payment_id: (selectedData as any).mode_of_payment?.id,
          wellness_lecture_date: selectedData.wellness_lecture_date,
          annual_physical_examination_date:
            selectedData.annual_physical_examination_date,
          commision_rate: selectedData.commision_rate,
          additional_benefits: selectedData.additional_benefits,
          special_benefits: selectedData.special_benefits,
          special_benefits_files: Array.isArray(
            selectedData.special_benefits_files,
          )
            ? selectedData.special_benefits_files
            : [],
          contract_proposal_files: Array.isArray(
            selectedData.contract_proposal_files,
          )
            ? selectedData.contract_proposal_files
            : [],
          additional_benefits_files: Array.isArray(
            selectedData.additional_benefits_files,
          )
            ? selectedData.additional_benefits_files
            : [],
          name_of_signatory: selectedData.name_of_signatory,
          designation_of_contact_person:
            selectedData.designation_of_contact_person,
          email_address_of_contact_person:
            selectedData.email_address_of_contact_person,
          birthdate: selectedData.birthdate,
          gender_types_id: (selectedData as any).gender_type?.id,
          civil_status_id: (selectedData as any).civil_status?.id, 
          card_number: selectedData.card_number,
          room_plan_id: (selectedData as any).room_plan?.id,
          mbl: selectedData.mbl,
          premium: selectedData.premium,
          program_types_id: (selectedData as any).program_type?.id,
        },
      ])
      if (isUpsertAccountError)
        throw new Error('Error updating pending account')
    }

    // Update pending account

    await updatePendingAccount({
      id: selectedData.id,
      is_approved: action === 'approve',
      is_active: action === 'approve',
    })
  }

  useEffect(() => {
    if (isUpsertingAccount || isUpdatingPendingAccount) setIsLoading(true)
    else setIsLoading(false)
  }, [isUpsertingAccount, isUpdatingPendingAccount, setIsLoading])

  return <div onClick={handleClick}>{children}</div>
}

export default ActionRequestButton
