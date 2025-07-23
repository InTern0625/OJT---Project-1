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
import { Loader2 } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import getTypes from '@/queries/get-types'

interface Props {
  companyId: string
}

const CompanyAbout: FC<Props> = ({ companyId }) => {
  const { editMode, setEditMode, statusId } = useCompanyEditContext()
  const supabase = createBrowserClient()
  const { data: account, refetch: refetchAccount } = useQuery(getAccountById(supabase, companyId));
  const { user } = useUserServer()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: activeTypes } = useQuery(getTypes(supabase, 'status_types'))
  const defaultStatusID = activeTypes?.[0]?.id ?? undefined
  const isSpecialBenefitsFilesEnabled = useFeatureFlag('account-benefit-upload')
  const existingContractFiles = useMemo(
    () => account?.contract_proposal_files ?? [],
    [account?.contract_proposal_files]
  )
  const form = useForm<z.infer<typeof accountsSchema>>({
    resolver: zodResolver(accountsSchema),
    defaultValues: {
      is_active: true,
      status_id: account?.status_type
        ? (account.status_type as any).id
        : defaultStatusID,
      company_name: account?.company_name ?? '',
      company_address: account?.company_address ?? '',
      birthdate: account?.birthdate
        ? normalizeToUTC(new Date(account.birthdate))
        : undefined,
      gender_types_id: account?.gender_type
        ? (account.gender_type as any).id
        : undefined,
      civil_status_id: account?.civil_status_type
        ? (account.civil_status_type as any).id
        : undefined,
      contact_number: account?.contact_number ?? '',
      email_address_of_contact_person:
        account?.email_address_of_contact_person ?? '',
      card_number: account?.card_number ?? '',
      expiration_date: account?.expiration_date
        ? normalizeToUTC(new Date(account.expiration_date))
        : undefined,
      effective_date: account?.effective_date
        ? normalizeToUTC(new Date(account.effective_date))
        : undefined,
      mode_of_payment_id: account?.mode_of_payment
        ? (account.mode_of_payment as any).id
        : undefined,
      hmo_provider_id: account?.hmo_provider
        ? (account.hmo_provider as any).id
        : undefined,
      room_plan_id: account?.room_plan
        ? (account.room_plan as any).id
        : undefined,
      mbl: account?.mbl
        ? (maskitoTransform(
            account.mbl.toString(),
            currencyOptions,
          ) as unknown as number)
        : undefined,
      program_types_id: account?.program_type
        ? (account.program_type as any).id
        : undefined,
      premium: account?.premium
        ? (maskitoTransform(
            account.premium.toString(),
            currencyOptions,
          ) as unknown as number)
        : undefined,
      agent_id: account?.agent?.[0]?.user_id ?? undefined,
      commision_rate: account?.commision_rate

        ? (maskitoTransform(
            account.commision_rate.toString(),
            percentageOptions,
          ) as unknown as string)
        : '',
      contract_proposal: account?.contract_proposal ?? '',
      contract_proposal_files: []
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

  const { mutateAsync: uploadContractProposal } = useUpload(supabase.storage.from('accounts'), {
    buildFileName: ({ fileName }) => {
      const randomId = Math.random().toString(36).substring(2, 15)
      return `contract_proposal/${randomId}-${fileName}`
    },
  })

  const onSubmitHandler = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      form.handleSubmit(async (data) => {
        setIsSubmitting (true)
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

        await supabase
        .from('accounts')
        .update({
          is_editing: false, 
          editing_user: null,
          editing_timestampz: null
        })
        .eq('id', companyId)

        // Handle file input
        const contractProposalFiles = data.contract_proposal_files
          ? Array.from(data.contract_proposal_files)
          : []
        // Upload special benefits files only if the feature is enabled and there are files
        let contractProposalLink: string[] = []
        if (
          isSpecialBenefitsFilesEnabled &&
          Array.isArray(data.contract_proposal_files) &&
          data.contract_proposal_files.length > 0
        ) {
          const uploadResult = await uploadContractProposal({
            files: contractProposalFiles,
          })

          if (uploadResult.length > 0) {
            const uploadProposalLink = uploadResult
              .map((result) => result.data?.path)
              .filter((path): path is string => typeof path === 'string')
            contractProposalLink = [...new Set([...existingContractFiles, ...uploadProposalLink].filter(x => x))]
          }
          
        }

        await mutateAsync([
          {
            status_id: statusId ?? data.status_id,
            company_name: data.company_name,
            company_address: data.company_address,
            birthdate: data?.birthdate
              ? normalizeToUTC(new Date(data.birthdate))
              : null,
            gender_types_id: data?.gender_types_id,
            civil_status_id: data?.civil_status_id,
            contact_number: data.contact_number,
            email_address_of_contact_person:
              data.email_address_of_contact_person,
            card_number: data.card_number,
            expiration_date: data.expiration_date
              ? normalizeToUTC(new Date(data.expiration_date))
              : null,
            effective_date: data.effective_date
              ? normalizeToUTC(new Date(data.effective_date))
              : null,
            mode_of_payment_id: data?.mode_of_payment_id,
            hmo_provider_id: data?.hmo_provider_id,
            room_plan_id: data?.room_plan_id,
            mbl: data.mbl,
            program_types_id: data.program_types_id,
            premium: data.premium,
            agent_id: data.agent_id,
            commision_rate: data.commision_rate
              ? parseFloat(data.commision_rate.replace('%', ''))
              : null,
            contract_proposal: data.contract_proposal,
            contract_proposal_files:
              isSpecialBenefitsFilesEnabled && contractProposalLink,
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
      uploadContractProposal,
      existingContractFiles,
      statusId
    ],
  )
  useEffect(() => {
    if (editMode) {
      setIsSubmitting(false)
    }
  }, [editMode])
  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler}>
        <div className="mx-auto flex w-full flex-col items-center justify-between gap-6 lg:flex-row lg:items-start">
          <div className="flex w-full flex-col gap-6 lg:max-w-xs">
            <div className="border-border bg-card mx-auto w-full rounded-2xl border p-6">
              <span className="text-xl font-semibold">Account Information</span>
              <CompanyAccountInformation id={companyId} />
            </div>
          </div>
          <div className="flex w-full flex-col gap-6">
            <div className="border-border bg-card mx-auto w-full rounded-2xl border p-6">
              <span className="text-xl font-semibold">Personal Information</span>
              <CompanyInformation id={companyId} />
            </div>
            <div className="border-border bg-card mx-auto w-full rounded-2xl border p-6">
              <span className="text-xl font-semibold">HMO Information</span>
                <CompanyHMOInformation id={companyId} account={account} refetchAccount={refetchAccount} />
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Submit'
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}

export default CompanyAbout
