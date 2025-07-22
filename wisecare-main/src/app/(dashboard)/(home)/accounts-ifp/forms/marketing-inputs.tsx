import ComboBox from '@/app/(dashboard)/(home)/accounts-ifp/forms/combo-box'
import DateInput from '@/app/(dashboard)/(home)/accounts-ifp/forms/date-input'
import InputWithMask from '@/app/(dashboard)/(home)/accounts-ifp/forms/input-with-mask'
import NumberInput from '@/app/(dashboard)/(home)/accounts-ifp/forms/number-input'
import SelectInput from '@/app/(dashboard)/(home)/accounts-ifp/forms/select-input'
import TextInput from '@/app/(dashboard)/(home)/accounts-ifp/forms/text-input'
import ComputedAge from '@/app/(dashboard)/(home)/accounts-ifp/forms/age_compute'
import getAgents from '@/queries/get-agents'
import getTypes from '@/queries/get-types'
import getEnumOptions  from '@/queries/get-enum-types'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import accountsSchema from '../accounts-schema'
import { createBrowserClient } from '@/utils/supabase-client'
import FileInput from '@/app/(dashboard)/(home)/accounts-ifp/forms/file-input'
import { useFeatureFlag } from '@/providers/FeatureFlagProvider'
import { useState, useEffect } from 'react'

interface Props {
  isLoading: boolean
}

const MarketingInputs: FC<Props> = ({ isLoading }) => {
  const isAccountBenefitUploadEnabled = useFeatureFlag('account-benefit-upload')

  const form = useFormContext<z.infer<typeof accountsSchema>>()
  const supabase = createBrowserClient()

  const { data: agents } = useQuery(getAgents(supabase))
  const { data: hmoProviders } = useQuery(getTypes(supabase, 'hmo_providers'))
  const { data: accountTypes } = useQuery(getTypes(supabase, 'account_types'))
  const { data: planTypes } = useQuery(getTypes(supabase, 'plan_types'))
  const { data: modeOfPayments } = useQuery(getTypes(supabase, 'mode_of_payments'))
  const { data: programTypes } = useQuery(getTypes(supabase, 'program_types'))
  const { data: roomPlan } = useQuery(getTypes(supabase, 'room_plans'))
  const { data: genderTypes } = useQuery(getTypes(supabase, 'gender_types'))
  const { data: civilStatusTypes } = useQuery(getTypes(supabase, 'civil_status_types'))

  return (
    <div className="grid gap-4 py-4">
      <h3 className="text-md font-semibold">Personal Information</h3>
      <div className="grid gap-4 sm:grid-flow-col sm:grid-rows-4">
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Complete Name"
          name="company_name"
          placeholder="Enter complete name"
        />
        <DateInput
          form={form}
          isLoading={isLoading}
          label="Birthdate"
          name="birthdate"
          validation="birthdate"
        />
        <SelectInput
          form={form}
          isLoading={isLoading}
          label="Gender"
          name="gender_types_id"
          options={genderTypes?.map((genderType) => ({
            label: genderType.name,
            value: genderType.id,
          }))}
        />
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Contact Number"
          name="contact_number"
          placeholder="Enter contact number"
          validation="contactnumber"
        />
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Complete Address"
          name="company_address"
          placeholder="Enter complete address"
        />
        
        <ComputedAge
          form={form}
          label="Age"
        />
        <SelectInput
          form={form}
          isLoading={isLoading}
          label="Civil Status"
          name="civil_status_id"
          options={civilStatusTypes?.map((civilStatusType) => ({
            label: civilStatusType.name,
            value: civilStatusType.id,
          }))}
        />
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Email Address"
          name="email_address_of_contact_person"
          placeholder="Enter email address"
        />
      </div>

      <h3 className="text-md mt-3 font-semibold">HMO Information</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Card Number"
          name="card_number"
          placeholder="Enter card number"
          validation="alphanumeric"
        />
        <SelectInput
          form={form}
          isLoading={isLoading}
          label="Mode of Payment"
          name="mode_of_payment_id"
          options={modeOfPayments?.map((modeOfPayment) => ({
            label: modeOfPayment.name,
            value: modeOfPayment.id,
          }))}
        />
        <DateInput
          form={form}
          isLoading={isLoading}
          label="Effective Date"
          name="effective_date"
        />
        <DateInput
          form={form}
          isLoading={isLoading}
          label="Expiration Date"
          name="expiration_date"
        />
        <SelectInput
          form={form}
          isLoading={isLoading}
          label="HMO Provider"
          name="hmo_provider_id"
          options={hmoProviders?.map((hmoProvider) => ({
            label: hmoProvider.name,
            value: hmoProvider.id,
          }))}
        />
        <SelectInput
          form={form}
          isLoading={isLoading}
          label="Room Plan"
          name="room_plan_id"
          options={roomPlan?.map((roomPlan) => ({
            label: roomPlan.name,
            value: roomPlan.id,
          }))}
        />
        <InputWithMask
          form={form}
          isLoading={isLoading}
          label="MBL"
          name="mbl"
          maskType="currency"
        />
        <InputWithMask
          form={form}
          isLoading={isLoading}
          label="Premium"
          name="premium"
          maskType="currency"
        />
        <SelectInput
          form={form}
          isLoading={isLoading}
          label="Account Types"
          name="program_types_id"
          options={programTypes?.map((programTypes) => ({
            label: programTypes.name,
            value: programTypes.id,
          }))}
        />
      </div>
      {isAccountBenefitUploadEnabled ? (
        <FileInput
          form={form}
          isLoading={isLoading}
          label="Contract and Proposal"
          name="contract_proposal_files"
          placeholder="Enter contract and proposal"
          maxFileSize={25 * 1024 * 1024}
        />
      ) : (
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Contract and Proposal"
          name="contract_proposal"
          placeholder="Enter contract and proposal"
        />
      )}
      <h3 className="text-md mt-3 font-semibold">Account Information</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ComboBox
          form={form}
          isLoading={isLoading}
          name="agent_id"
          label="Agent"
          placeholder="Select Agent"
          options={agents?.map((agent) => ({
            label: `${agent.first_name} ${agent.last_name}`,
            value: agent.user_id,
          }))}
        />
        <InputWithMask
          form={form}
          isLoading={isLoading}
          label="Commission Rate (%)"
          name="commision_rate"
          maskType="percentage"
        />
      </div>
    </div>
  )
}

export default MarketingInputs
