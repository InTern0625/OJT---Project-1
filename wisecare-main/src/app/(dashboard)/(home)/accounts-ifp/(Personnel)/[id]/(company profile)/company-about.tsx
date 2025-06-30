'use client'

import CompanyAccountInformation from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-account-information'
import CompanyCancelButton from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-cancel-button'
import CompanyContractInformation from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-contract-information'
import { useCompanyEditContext } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edit-provider'
import CompanyHMOInformation from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-HMO-information'
import CompanyInformation from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-information'
import accountsSchema from '@/app/(dashboard)/(home)/accounts-ifp/accounts-schema'
import currencyOptions from '@/components/maskito/currency-options'
import numberOptions from '@/components/maskito/number-options'
import percentageOptions from '@/components/maskito/percentage-options'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { useFeatureFlag } from '@/providers/FeatureFlagProvider'
import { useUserServer } from '@/providers/UserProvider'
import getAccountById from '@/queries/get-account-by-id'
import normalizeToUTC from '@/utils/normalize-to-utc'
import { createBrowserClient } from '@/utils/supabase-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { maskitoTransform } from '@maskito/core'
import {
  useQuery,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query'
import { useUpload } from '@supabase-cache-helpers/storage-react-query'
import { FC, FormEventHandler, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  companyId: string
}

const CompanyAbout: FC<Props> = ({ companyId }) => {
  const { editMode, setEditMode } = useCompanyEditContext()
  const supabase = createBrowserClient()
  const { data: account } = useQuery(getAccountById(supabase, companyId))
  const { user } = useUserServer()

  const isSpecialBenefitsFilesEnabled = useFeatureFlag('account-benefit-upload')

  const form = useForm<z.infer<typeof accountsSchema>>({
    resolver: zodResolver(accountsSchema),
    defaultValues: {
      is_active: account?.is_active ?? true,
      agent_id: account?.agent?.user_id ?? undefined,
      company_name: account?.company_name ?? '',
      company_address: account?.company_address ?? '',
      nature_of_business: account?.nature_of_business ?? '',
      hmo_provider_id: account?.hmo_provider
        ? (account.hmo_provider as any).id
        : undefined,
      previous_hmo_provider_id: account?.previous_hmo_provider
        ? (account.previous_hmo_provider as any).id
        : undefined,
      old_hmo_provider_id: account?.old_hmo_provider
        ? (account.old_hmo_provider as any).id
        : undefined,
      account_type_id: account?.account_type
        ? (account.account_type as any).id
        : undefined,
      total_utilization: account?.total_utilization
        ? (maskitoTransform(
            account.total_utilization.toString(),
            numberOptions,
          ) as unknown as string)
        : undefined,
      total_premium_paid: account?.total_premium_paid
        ? (maskitoTransform(
            account.total_premium_paid.toString(),
            currencyOptions,
          ) as unknown as number)
        : undefined,
      signatory_designation: account?.signatory_designation ?? '',
      contact_person: account?.contact_person ?? '',
      contact_number: account?.contact_number ?? '',
      principal_plan_type_id: account?.principal_plan_type
        ? (account.principal_plan_type as any).id
        : undefined,
      dependent_plan_type_id: account?.dependent_plan_type
        ? (account.dependent_plan_type as any).id
        : undefined,
      initial_head_count: account?.initial_head_count
        ? (maskitoTransform(
            account.initial_head_count.toString(),
            numberOptions,
          ) as unknown as string)
        : undefined,
      effective_date: account?.effective_date
        ? normalizeToUTC(new Date(account.effective_date))
        : undefined,
      original_effective_date: account?.original_effective_date
        ? normalizeToUTC(new Date(account.original_effective_date))
        : undefined,
      coc_issue_date: account?.coc_issue_date
        ? normalizeToUTC(new Date(account.coc_issue_date))
        : undefined,
      expiration_date: account?.expiration_date
        ? normalizeToUTC(new Date(account.expiration_date))
        : undefined,
      delivery_date_of_membership_ids: account?.delivery_date_of_membership_ids
        ? normalizeToUTC(new Date(account.delivery_date_of_membership_ids))
        : undefined,
      orientation_date: account?.orientation_date
        ? normalizeToUTC(new Date(account.orientation_date))
        : undefined,
      initial_contract_value: account?.initial_contract_value
        ? (maskitoTransform(
            account.initial_contract_value.toString(),
            currencyOptions,
          ) as unknown as number)
        : undefined,
      mode_of_payment_id: account?.mode_of_payment
        ? (account.mode_of_payment as any).id
        : undefined,
      wellness_lecture_date: account?.wellness_lecture_date
        ? normalizeToUTC(new Date(account.wellness_lecture_date))
        : undefined,
      annual_physical_examination_date:
        account?.annual_physical_examination_date
          ? normalizeToUTC(new Date(account.annual_physical_examination_date))
          : undefined,
      commision_rate: account?.commision_rate
        ? (maskitoTransform(
            account.commision_rate.toString(),
            percentageOptions,
          ) as unknown as string)
        : '',
      additional_benefits: account?.additional_benefits ?? '',
      special_benefits: account?.special_benefits ?? '',
      special_benefits_files: [],
      name_of_signatory: account?.name_of_signatory ?? '',
      designation_of_contact_person:
        account?.designation_of_contact_person ?? '',
      email_address_of_contact_person:
        account?.email_address_of_contact_person ?? '',
    },
  })

  const { mutateAsync } = useUpsertMutation(
    //@ts-ignore
    supabase.from(
      ['marketing', 'after-sales'].includes(user?.user_metadata?.department)
        ? 'pending_accounts' // marketing & after-sales needs to insert to pending_accounts instead of accounts
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
            ? 'Company details edit request submitted!'
            : 'Company details edited successfully!',
          description: ['marketing', 'after-sales'].includes(
            user?.user_metadata?.department,
          )
            ? 'Your request to edit the company details has been submitted successfully and is awaiting approval.'
            : 'Your company details have been edited successfully.',
        })
        setEditMode(false)
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
        if (!user) {
          toast({
            title: 'Something went wrong',
            description: 'Please try again',
            variant: 'destructive',
          })
          return
        }
        // Get existing files
        const existingSpecialBenefits = account?.special_benefits_files || [];
        const existingContractProposals = account?.contract_proposal_files || [];
        const existingAdditionalBenefits = account?.additional_benefits_files || [];
        
        await supabase
        .from('accounts')
        .update({
          is_editing: false, 
          editing_user: null,
          editing_timestampz: null
        })
        .eq('id', companyId)

        // Handle file inputs
        const specialBenefitsFiles = data.special_benefits_files
          ? Array.from(data.special_benefits_files)
          : [];
        const contractProposalFiles = data.contract_proposal_files
          ? Array.from(data.contract_proposal_files)
          : [];
        const additionalBenefitsFiles = data.additional_benefits_files
          ? Array.from(data.additional_benefits_files)
          : [];

        // Upload new files and combine with existing
        let specialBenefitsLink: string[] = [...existingSpecialBenefits];
        if (isSpecialBenefitsFilesEnabled && specialBenefitsFiles.length > 0) {
          const uploadResult = await uploadSpecialBenefits({
            files: specialBenefitsFiles,
          });
          if (uploadResult.length > 0) {
            specialBenefitsLink = [
              ...specialBenefitsLink,
              ...uploadResult
                .map((result) => result.data?.path)
                .filter((path): path is string => typeof path === 'string')
            ];
          }
        }

        let contractProposalLink: string[] = [...existingContractProposals];
        if (isSpecialBenefitsFilesEnabled && contractProposalFiles.length > 0) {
          const uploadResult = await uploadContractProposal({
            files: contractProposalFiles,
          });
          if (uploadResult.length > 0) {
            contractProposalLink = [
              ...contractProposalLink,
              ...uploadResult
                .map((result) => result.data?.path)
                .filter((path): path is string => typeof path === 'string')
            ];
          }
        }

        let additionalBenefitsLink: string[] = [...existingAdditionalBenefits];
        if (isSpecialBenefitsFilesEnabled && additionalBenefitsFiles.length > 0) {
          const uploadResult = await uploadAdditionalBenefits({
            files: additionalBenefitsFiles,
          });
          if (uploadResult.length > 0) {
            additionalBenefitsLink = [
              ...additionalBenefitsLink,
              ...uploadResult
                .map((result) => result.data?.path)
                .filter((path): path is string => typeof path === 'string')
            ];
          }
        }

        await mutateAsync([
          {
            company_name: data.company_name,
            company_address: data.company_address,
            nature_of_business: data.nature_of_business,
            contact_person: data.contact_person,
            contact_number: data.contact_number,
            signatory_designation: data.signatory_designation,
            name_of_signatory: data.name_of_signatory,
            designation_of_contact_person: data.designation_of_contact_person,
            email_address_of_contact_person:
              data.email_address_of_contact_person,
            account_type_id: data?.account_type_id,
            agent_id: data.agent_id,
            is_active: data.is_active,
            hmo_provider_id: data?.hmo_provider_id,
            previous_hmo_provider_id: data?.previous_hmo_provider_id,
            old_hmo_provider_id: data?.old_hmo_provider_id,
            principal_plan_type_id: data?.principal_plan_type_id,
            dependent_plan_type_id: data?.dependent_plan_type_id,
            total_premium_paid: data.total_premium_paid,
            additional_benefits: data.additional_benefits,
            initial_contract_value: data.initial_contract_value,
            mode_of_payment_id: data?.mode_of_payment_id,
            commision_rate: data.commision_rate
              ? parseFloat(data.commision_rate.replace('%', ''))
              : null,
            total_utilization: data.total_utilization
              ? parseInt(data.total_utilization.split(',').join(''))
              : null,
            initial_head_count: data.initial_head_count
              ? parseInt(data.initial_head_count.split(',').join(''))
              : null,
            expiration_date: data.expiration_date
              ? normalizeToUTC(new Date(data.expiration_date))
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
            delivery_date_of_membership_ids:
              data.delivery_date_of_membership_ids
                ? normalizeToUTC(new Date(data.delivery_date_of_membership_ids))
                : null,
            orientation_date: data.orientation_date
              ? normalizeToUTC(new Date(data.orientation_date))
              : null,
            wellness_lecture_date: data.wellness_lecture_date
              ? normalizeToUTC(new Date(data.wellness_lecture_date))
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
            annual_physical_examination_date:
              data.annual_physical_examination_date
                ? normalizeToUTC(
                    new Date(data.annual_physical_examination_date),
                  )
                : null,
            ...(['marketing', 'after-sales'].includes(
              user?.user_metadata?.department,
            )
              ? {
                  created_by: user.id, // marketing & after-sales needs to add this since they are inserting to pending_accounts instead of accounts
                  account_id: companyId,
                  operation_type: 'update',
                }
              : {
                  id: companyId, // if we're updating, we need to specify the id (not used by marketing dept)
                }),
          },
        ])
      })(e)
    },
    [
      companyId,
      form,
      isSpecialBenefitsFilesEnabled,
      mutateAsync,
      supabase,
      uploadSpecialBenefits,
      uploadContractProposal,
      uploadAdditionalBenefits,
      account?.special_benefits_files,
      account?.additional_benefits_files,
      account?.contract_proposal_files
    ],
  )

  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler}>
        <div className="mx-auto flex w-full flex-col items-center justify-between gap-6 lg:flex-row lg:items-start">
          <div className="flex w-full flex-col gap-6 lg:max-w-xs">
            <div className="border-border bg-card mx-auto w-full rounded-2xl border p-6">
              <span className="text-xl font-semibold">
                Contract Information
              </span>
              <CompanyContractInformation id={companyId} />
            </div>
            <div className="border-border bg-card mx-auto w-full rounded-2xl border p-6">
              <span className="text-xl font-semibold">Account Information</span>
              <CompanyAccountInformation id={companyId} />
            </div>
          </div>
          <div className="flex w-full flex-col gap-6">
            <div className="border-border bg-card mx-auto w-full rounded-2xl border p-6">
              <span className="text-xl font-semibold">Company Information</span>
              <CompanyInformation id={companyId} />
            </div>
            <div className="border-border bg-card mx-auto w-full rounded-2xl border p-6">
              <span className="text-xl font-semibold">HMO Information</span>
              <CompanyHMOInformation id={companyId} />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-row items-center justify-between gap-2 lg:ml-auto lg:justify-end">
          {editMode && (
            <>
              <CompanyCancelButton companyID={companyId}/>
              <Button
                type="submit"
                variant="default"
                className="w-full lg:w-auto"
              >
                Submit
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}

export default CompanyAbout
