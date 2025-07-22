import ComboBox from '@/app/(dashboard)/(home)/accounts-corporate-sme/forms/combo-box'
import DateInput from '@/app/(dashboard)/(home)/accounts-corporate-sme/forms/date-input'
import InputWithMask from '@/app/(dashboard)/(home)/accounts-corporate-sme/forms/input-with-mask'
import NumberInput from '@/app/(dashboard)/(home)/accounts-corporate-sme/forms/number-input'
import SelectInput from '@/app/(dashboard)/(home)/accounts-corporate-sme/forms/select-input'
import TextInput from '@/app/(dashboard)/(home)/accounts-corporate-sme/forms/text-input'
import getAgents from '@/queries/get-agents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Trash2 } from 'lucide-react'
import { Plus } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import getTypes from '@/queries/get-types'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import accountsSchema from '../accounts-schema'
import { createBrowserClient } from '@/utils/supabase-client'
import FileInput from '@/app/(dashboard)/(home)/accounts-corporate-sme/forms/file-input'
import { useFeatureFlag } from '@/providers/FeatureFlagProvider'

interface Props {
  isLoading: boolean
}

  const MarketingInputs: FC<Props> = ({ isLoading }) => {
  const isAccountBenefitUploadEnabled = useFeatureFlag('account-benefit-upload')
  const onSubmit = async (data) => {
    console.log('🧾 Submitted form data:', data)
  }
  const form = useFormContext<z.infer<typeof accountsSchema>>()
  const supabase = createBrowserClient()
  const { control, watch, setValue } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'affiliate_entries',
  })
  const { data: agents } = useQuery(getAgents(supabase))
  const { data: hmoProviders } = useQuery(getTypes(supabase, 'hmo_providers'))
  const { data: accountTypes } = useQuery(getTypes(supabase, 'account_types'))
  const { data: planTypes } = useQuery(getTypes(supabase, 'plan_types'))
  const { data: modeOfPayments } = useQuery(
    getTypes(supabase, 'mode_of_payments'),
  )

  return (
    <div className="grid gap-4 py-4">
      <h3 className="text-md font-semibold">Company Information</h3>
      <div className="grid gap-4 sm:grid-flow-col sm:grid-rows-5">
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Company Name"
          name="company_name"
          placeholder="Enter company name"
        />
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Company Address"
          name="company_address"
          placeholder="Enter company address"
        />
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Nature of Business"
          name="nature_of_business"
          placeholder="Enter nature of business"
        />
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Name of Signatory"
          name="name_of_signatory"
          placeholder="Enter name of signatory"
        />
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Signatory Designation"
          name="signatory_designation"
          placeholder="Enter signatory designation"
        />
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
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Contact Person"
          name="contact_person"
          placeholder="Enter contact person"
        />
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Designation of Contact Person"
          name="designation_of_contact_person"
          placeholder="Enter designation of contact person"
        />
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Email Address of Contact Person"
          name="email_address_of_contact_person"
          placeholder="Enter email address of contact person"
        />
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Contact Number"
          name="contact_number"
          placeholder="Enter contact number"
          validation="contactnumber"
        />
      </div>

      <h3 className="text-md mt-3 font-semibold">HMO Information</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          label="Previous HMO Provider"
          name="previous_hmo_provider_id"
          options={hmoProviders?.map((hmoProvider) => ({
            label: hmoProvider.name,
            value: hmoProvider.id,
          }))}
        />
        <SelectInput
          form={form}
          isLoading={isLoading}
          label="Old HMO Provider"
          name="old_hmo_provider_id"
          options={hmoProviders?.map((hmoProvider) => ({
            label: hmoProvider.name,
            value: hmoProvider.id,
          }))}
        />
        <SelectInput
          form={form}
          isLoading={isLoading}
          label="Principal Plan Type"
          name="principal_plan_type_id"
          options={planTypes?.map((planType) => ({
            label: planType.name,
            value: planType.id,
          }))}
        />
        <SelectInput
          form={form}
          isLoading={isLoading}
          label="Dependent Plan Type"
          name="dependent_plan_type_id"
          options={planTypes?.map((planType) => ({
            label: planType.name,
            value: planType.id,
          }))}
        />
        <NumberInput
          form={form}
          isLoading={isLoading}
          label="Total Utilization"
          name="total_utilization"
          placeholder="Enter total utilization"
          validation="numberOnly"
        />
        <InputWithMask
          form={form}
          isLoading={isLoading}
          label="Total Premium Paid"
          name="total_premium_paid"
          maskType="currency"
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
      {isAccountBenefitUploadEnabled ? (
        <FileInput
          form={form}
          isLoading={isLoading}
          label="Special Benefits"
          name="special_benefits_files"
          placeholder="Enter special benefits"
          maxFileSize={25 * 1024 * 1024}
        />
      ) : (
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Special Benefits"
          name="special_benefits"
          placeholder="Enter special benefits"
          
        />
      )}
      {isAccountBenefitUploadEnabled ? (
        <FileInput
          form={form}
          isLoading={isLoading}
          label="Additional Benefits"
          name="additional_benefits_files"
          placeholder="Enter additional benefits"
          maxFileSize={25 * 1024 * 1024}
        />
      ) : (
        <TextInput
          form={form}
          isLoading={isLoading}
          label="Additional Benefits"
          name="additional_benefits_text"
          placeholder="Enter additional benefits"
        />
      )}

      <h3 className="text-md mt-3 font-semibold">Contract Information</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <InputWithMask
          form={form}
          isLoading={isLoading}
          label="Initial Contract Value"
          name="initial_contract_value"
          maskType="currency"
        />
        <NumberInput
          form={form}
          isLoading={isLoading}
          label="Initial Head Count"
          name="initial_head_count"
          placeholder="Enter initial head count"
          validation="numberOnly"
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
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DateInput
          form={form}
          isLoading={isLoading}
          label="Expiration Date"
          name="expiration_date"
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
          label="Original Effective Date"
          name="original_effective_date"
        />
        <DateInput
          form={form}
          isLoading={isLoading}
          label="COC Issue Date"
          name="coc_issue_date"
        />

        <DateInput
          form={form}
          isLoading={isLoading}
          label="Delivery Date of Membership IDs"
          name="delivery_date_of_membership_ids"
        />
        <DateInput
          form={form}
          isLoading={isLoading}
          label="Orientation Date"
          name="orientation_date"
        />
        <DateInput
          form={form}
          isLoading={isLoading}
          label="Wellness Lecture Date"
          name="wellness_lecture_date"
        />
        <DateInput
          form={form}
          isLoading={isLoading}
          label="Annual Physical Examination Date"
          name="annual_physical_examination_date"
        />
      </div>

      <h3 className="text-md mt-3 font-semibold">Account Information</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectInput
          form={form}
          isLoading={isLoading}
          label="Account Type"
          name="account_type_id"
          options={accountTypes
          ?.map((accountType) => ({
            label: accountType.name,
            value: accountType.id,
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

      {/* Affiliates */}
      <div className="space-y-4">
        <h3 className="text-md mt-3 font-semibold">Affiliates</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            form={form}
            isLoading={isLoading}
            label="Affiliate Company Name"
            name="affiliate_name"
            placeholder="Enter affiliate name"
          />
          <TextInput
            form={form}
            isLoading={isLoading}
            label="Affiliate Address"
            name="affiliate_address"
            placeholder="Enter affiliate address"
          />

          <div className="sm:col-span-2">
            <Button
              type="button"
              variant="ghost"
              className="border border-gray-300 hover:bg-gray-100"
              onClick={() => {
                const newName = form.watch('affiliate_name')?.toString().trim()
                const newAddress = form.watch('affiliate_address')?.toString().trim()
                if (newName && newAddress) {
                  append({
                    affiliate_name: newName,
                    affiliate_address: newAddress,
                    is_active: true, // default value
                  })
                  form.setValue('affiliate_name', '')
                  form.setValue('affiliate_address', '')
                }
              }}
            >
              <Plus size={18} className="mr-2" /> Add Affiliate
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md bg-gray-50 p-4 border"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`affiliate_entries.${index}.affiliate_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Affiliate Name" className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`affiliate_entries.${index}.affiliate_address`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Affiliate Address" className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-4">
                <Button
                  variant="destructive"
                  size="icon"
                  type="button"
                  onClick={() => remove(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketingInputs
