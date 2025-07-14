'use client'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { useUserServer } from '@/providers/UserProvider'
import normalizeToUTC from '@/utils/normalize-to-utc'
import { createBrowserClient } from '@/utils/supabase-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useInsertMutation, useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { Loader2 } from 'lucide-react'
import { FormEventHandler, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import accountsSchema from './accounts-schema'
import MarketingInputs from './forms/marketing-inputs'
import { useUpload } from '@supabase-cache-helpers/storage-react-query'
import { useFeatureFlag } from '@/providers/FeatureFlagProvider'
import getTypes from '@/queries/get-types'

interface AddAccountFormProps {
  setIsOpen: (isOpen: boolean) => void
}

const AddAccountForm = ({ setIsOpen }: AddAccountFormProps) => {
  const isSpecialBenefitsFilesEnabled = useFeatureFlag('account-benefit-upload')
  const supabase = createBrowserClient()
  const { toast } = useToast()
  const { user } = useUserServer()
  const { data: activeTypes } = useQuery(getTypes(supabase, 'status_types'))
  const defaultStatusID = activeTypes?.[0]?.id ?? undefined
  const form = useForm<z.infer<typeof accountsSchema>>({
    resolver: zodResolver(accountsSchema),
    defaultValues: {
      is_active: true,
      status_id: defaultStatusID,
      agent_id: undefined,
      company_name: '',
      company_address: '',
      nature_of_business: '',
      hmo_provider_id: undefined,
      previous_hmo_provider_id: undefined,
      old_hmo_provider_id: undefined,
      total_utilization: '',
      total_premium_paid: null,
      signatory_designation: '',
      contact_person: '',
      contact_number: '',
      principal_plan_type_id: undefined,
      dependent_plan_type_id: undefined,
      initial_head_count: '',
      effective_date: undefined,
      original_effective_date: undefined,
      coc_issue_date: undefined,
      expiration_date: undefined,
      delivery_date_of_membership_ids: undefined,
      orientation_date: undefined,
      initial_contract_value: null,
      mode_of_payment_id: undefined,
      wellness_lecture_date: undefined,
      annual_physical_examination_date: undefined,
      commision_rate: '',
      additional_benefits: '',
      name_of_signatory: '',
      designation_of_contact_person: '',
      email_address_of_contact_person: '',
      special_benefits: '',
      special_benefits_files: [],
      contract_proposal: '',
      contract_proposal_files: [],
      additional_benefits_text: '',
      additional_benefits_files: [],
      birthdate: undefined,
      card_number: '',
      mbl: null,
      premium: null,
    },
  })

  const { mutateAsync, isPending, isSuccess } = useInsertMutation(
    // @ts-ignore
    supabase.from(
      // marketing & after-sales needs to insert to pending_accounts instead of accounts
      ['marketing', 'after-sales'].includes(user?.user_metadata?.department)
        ? 'pending_accounts'
        : 'accounts',
    ),
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          title: ['marketing', 'after-sales'].includes(
            user?.user_metadata?.department,
          )
            ? 'Account creation request submitted!'
            : 'Account created successfully!',
          description: ['marketing', 'after-sales'].includes(
            user?.user_metadata?.department,
          )
            ? 'Your request to create a new account has been submitted successfully and is awaiting approval.'
            : 'Your account has been created successfully.',
        })

        form.reset()

        // close the dialog
        setIsOpen(false)
      },
      onError: (error) => {
        toast({
          title: 'Something went wrong',
          description: error.message,
          variant: 'destructive',
        })
      },
    },
  )

  const { mutateAsync: uploadSpecialBenefits } = useUpload(supabase.storage.from('accounts'), {
    buildFileName: ({ fileName }) => {
      const randomId = Math.random().toString(36).substring(2, 15)
      return `benefits/${randomId}-${fileName}`
    },
  })
  const { mutateAsync: uploadContractProposal } = useUpload(supabase.storage.from('accounts'), {
      buildFileName: ({ fileName }) => {
        const randomId = Math.random().toString(36).substring(2, 15)
        return `contract_proposal/${randomId}-${fileName}`
      },
    })
    const { mutateAsync: uploadAdditionalBenefits } = useUpload(supabase.storage.from('accounts'), {
      buildFileName: ({ fileName }) => {
        const randomId = Math.random().toString(36).substring(2, 15)
        return `additional_benefits/${randomId}-${fileName}`
      },
    })

  const onSubmitHandler = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      form.handleSubmit(async (data) => {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        // check if company_name already exists in pending_accounts
        const { data: existingAccount } = await supabase
          .from('pending_accounts')
          .select('company_name')
          .eq('company_name', data.company_name)
          .maybeSingle()

        if (existingAccount) {
          form.setError('company_name', {
            message: 'Account already exists',
          })
          return
        }

        // check if company_name already exists in accounts
        const { data: existingAccountInAccounts } = await supabase
          .from('accounts')
          .select('company_name')
          .eq('company_name', data.company_name)
          .maybeSingle()

        if (existingAccountInAccounts) {
          form.setError('company_name', {
            message: 'Account already exists',
          })
          return
        }

        // upload special benefits
        const specialBenefitFilesToUpload = data.special_benefits_files || []
        const uploadSpecialBenefitResult = await uploadSpecialBenefits({
          files: specialBenefitFilesToUpload,
        })
        const contractProposalFilesUpload = data.contract_proposal_files || []
        const uploadContractProposalResult = await uploadContractProposal({
          files: contractProposalFilesUpload,
        })
        const additionalBenefitFilesUpload = data.additional_benefits_files || []
        const uploadAdditionalBenefitsResult = await uploadAdditionalBenefits({
          files: additionalBenefitFilesUpload,
        })

        const specialBenefitsLink = uploadSpecialBenefitResult
          .map((result) => result.data?.path)
          .filter(Boolean)
        const contractProposalLink = uploadContractProposalResult
          .map((result) => result.data?.path)
          .filter(Boolean)
        const additionalBenefitsLink = uploadAdditionalBenefitsResult
          .map((result) => result.data?.path)
          .filter(Boolean)
        await mutateAsync([
          {
            is_active: true,
            status_id: data.status_id,
            company_name: data.company_name,
            agent_id: data.agent_id,
            company_address: data.company_address,
            nature_of_business: data.nature_of_business,
            hmo_provider_id: data.hmo_provider_id,
            previous_hmo_provider_id: data.previous_hmo_provider_id,
            old_hmo_provider_id: data.old_hmo_provider_id,
            total_utilization: data.total_utilization
              ? parseInt(data.total_utilization.split(',').join(''))
              : null,
            total_premium_paid: data.total_premium_paid,
            signatory_designation: data.signatory_designation,
            contact_person: data.contact_person,
            contact_number: data.contact_number,
            principal_plan_type_id: data.principal_plan_type_id,
            dependent_plan_type_id: data.dependent_plan_type_id,
            initial_head_count: data.initial_head_count
              ? parseInt(data.initial_head_count.split(',').join(''))
              : null,
            effective_date: data.effective_date
              ? normalizeToUTC(new Date(data.effective_date))
              : null,
            original_effective_date: data.original_effective_date
              ? normalizeToUTC(new Date(data.original_effective_date))
              : null,
            coc_issue_date: data.coc_issue_date
              ? normalizeToUTC(new Date(data.coc_issue_date))
              : null,
            expiration_date: data.expiration_date
              ? normalizeToUTC(new Date(data.expiration_date))
              : null,
            delivery_date_of_membership_ids:
              data.delivery_date_of_membership_ids
                ? normalizeToUTC(new Date(data.delivery_date_of_membership_ids))
                : null,
            orientation_date: data.orientation_date
              ? normalizeToUTC(new Date(data.orientation_date))
              : null,
            initial_contract_value: data.initial_contract_value,
            mode_of_payment_id: data.mode_of_payment_id,
            wellness_lecture_date: data.wellness_lecture_date
              ? normalizeToUTC(new Date(data.wellness_lecture_date))
              : null,
            annual_physical_examination_date:
              data.annual_physical_examination_date
                ? normalizeToUTC(
                    new Date(data.annual_physical_examination_date),
                  )
                : null,
            commision_rate: data.commision_rate
              ? parseFloat(data.commision_rate.replace('%', ''))
              : null,
            special_benefits: data.special_benefits,
            special_benefits_files:
              isSpecialBenefitsFilesEnabled && specialBenefitsLink,
            contract_proposal: data.contract_proposal,
            contract_proposal_files:
              isSpecialBenefitsFilesEnabled && contractProposalLink,
            additional_benefits_text: data.special_benefits,
            additional_benefits_files:
              isSpecialBenefitsFilesEnabled && additionalBenefitsLink,
            name_of_signatory: data.name_of_signatory,
            designation_of_contact_person: data.designation_of_contact_person,
            email_address_of_contact_person:
              data.email_address_of_contact_person,
            ...(['marketing', 'after-sales'].includes(
              user?.user_metadata?.department,
            ) && {
              // marketing & after-sales needs to add this since they are inserting a row to pending_accounts instead of accounts
              created_by: user?.id,
              operation_type: 'insert',
            }),
            birthdate: data.birthdate,
            gender_types_id: data.gender_types_id,
            civil_status_id: data.civil_status_id, 
            card_number: data.card_number,
            room_plan_id: data.room_plan_id,
            mbl: data.mbl,
            premium: data.premium,
            program_types_id: data.program_types_id,
          },
        ])
      })(e)
    },
    [form, isSpecialBenefitsFilesEnabled, mutateAsync, supabase, uploadSpecialBenefits, uploadContractProposal, uploadAdditionalBenefits],
  )

  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler}>
        <MarketingInputs isLoading={isPending || isSuccess} />
        <DialogFooter className="flex flex-row items-center justify-between px-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-24"
              disabled={isPending || isSuccess}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="default"
            className="w-fit"
            disabled={isPending || isSuccess}
          >
            {isPending || isSuccess ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Create Accounts'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default AddAccountForm
