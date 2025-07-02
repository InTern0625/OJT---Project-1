'use client'

import companyEditsSchema from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edits-schema'
import FileInput from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/edit/file-upload'
import currencyOptions from '@/components/maskito/currency-options'
import { maskitoNumberOptionsGenerator } from '@maskito/kit'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFeatureFlag } from '@/providers/FeatureFlagProvider'
import getTypes from '@/queries/get-types'
import { createBrowserClient } from '@/utils/supabase-client'
import { useMaskito } from '@maskito/react'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import getAccountById from '@/queries/get-account-by-id'
import { FC } from 'react'

interface HmoInformationProps {
  id: string
}

  const HmoInformationFields: FC<HmoInformationProps> = ({ id }) => {
  const form = useFormContext<z.infer<typeof companyEditsSchema>>()

  const currencyOptions = maskitoNumberOptionsGenerator({
    decimalSeparator: '.',
    thousandSeparator: ',',
    precision: 2,
    prefix: '₱ ',
  });
  const supabase = createBrowserClient()
  const { data: hmoProviders } = useQuery(getTypes(supabase, 'hmo_providers'))
  const { data: planTypes } = useQuery(getTypes(supabase, 'plan_types'))
  const { data: account } = useQuery(getAccountById(supabase, id))
  const maskedTotalPremiumPaidRef = useMaskito({ options: currencyOptions })
  const maskedMBLRef = useMaskito({ options: currencyOptions });
  const isAccountBenefitUploadEnabled = useFeatureFlag('account-benefit-upload')
  const { data: modeOfPayments } = useQuery(getTypes(supabase, 'mode_of_payments'))
  const { data: roomPlans } = useQuery(getTypes(supabase, 'room_plans'))
  return (
    <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 md:grid-auto-rows-auto">
      {/* Row 1: Card Number | Mode of Payment */}
      <FormField
        control={form.control}
        name="card_number"
        render={({ field }) => (
          <FormItem>
            <div className="text-sm text-[#1e293b]">Card Number:</div>
            <FormControl>
              <Input
                type="text"
                className="w-full"
                {...field}
                value={field.value ?? ''}
                onInput={(e) => {
                  const val = e.currentTarget.value
                  // Allow only integers (no decimals, no letters)
                  if (/^\d*$/.test(val)) {
                    field.onChange(val)
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
      control={form.control}
      name="mode_of_payment_id"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="pt-4">
              <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                Mode of Payment:
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {modeOfPayments?.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
      {/* Row 2: Effective Date | Expiration Date */}
      <FormField
        control={form.control}
        name="effective_date"
        render={({ field }) => (
          <FormItem>
            <div className="text-sm text-[#1e293b]">Effective Date:</div>
            <FormControl>
              <input
                type="date"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                value={
                  field.value
                    ? new Date(field.value).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) => field.onChange(e.target.value)} // ✅ This is required!
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

        <FormField
          control={form.control}
          name="expiration_date"
          render={({ field }) => (
            <FormItem>
              <div className="text-sm text-[#1e293b]">Expiration Date:</div>
              <FormControl>
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) => field.onChange(e.target.value)} // ✅ This is required!
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      {/* Row 3: HMO Provider | Room Plan */}
      <FormField
        control={form.control}
        name="hmo_provider_id"
        render={({ field }) => (
          <FormItem>
            <div className="text-sm text-[#1e293b]">HMO Provider:</div>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {hmoProviders?.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="room_plan_id"
        render={({ field }) => {
          console.log("room_plan_id value at render:", field.value); // ✅ debug log

          return (
            <FormItem>
              <FormControl>
                <div className="pt-4">
                  <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                    Room Plan:
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Room Plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomPlans?.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      {/* Row 4: MBL | Premium */}
       <FormField
         control={form.control}
         name="mbl"
         render={({ field }) => (
           <FormItem>
             <FormLabel className="text-sm text-[#1e293b]">MBL</FormLabel>
             <FormControl>
               <input
                 ref={maskedMBLRef}
                 value={
                   field.value !== null && field.value !== undefined
                     ? `₱ ${Number(field.value).toLocaleString('en-US', {
                         minimumFractionDigits: 2,
                         maximumFractionDigits: 2,
                       })}`
                     : ''
                 }
                 onChange={(e) => {
                   const rawValue = e.target.value.replace(/[₱, ]/g, '');
                   const numericValue = parseFloat(rawValue);
                   field.onChange(isNaN(numericValue) ? null : numericValue);
                 }}
                 placeholder="₱ 0.00"
                 className="w-full px-3 py-2 border rounded"
               />
             </FormControl>
             <FormMessage />
           </FormItem>
         )}
       />

      <FormField
        control={form.control}
        name="total_premium_paid"
        render={({ field }) => (
          <FormItem>
            <div className="text-sm text-[#1e293b]">Premium:</div>
            <Input
              className="w-full"
              {...field}
              value={field.value ?? ''}
              ref={maskedTotalPremiumPaidRef}
              onInput={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Row 5: Contract and Proposal */}
      <div className="md:col-span-2">
        {isAccountBenefitUploadEnabled ? (
          <FileInput
            form={form}
            name="contract_proposal_files"
            label="Contract and Proposal"
            maxFileSize={25 * 1024 * 1024}
            existingFiles={account?.contract_proposal_files || []}
            id={id}
          />
        ) : (
          <FormField
            control={form.control}
            name="contract_proposal"
            render={({ field }) => (
              <FormItem>
                <div className="text-sm text-[#1e293b]">Contract and Proposal:</div>
                <Input className="w-full" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  )
}

export default HmoInformationFields
