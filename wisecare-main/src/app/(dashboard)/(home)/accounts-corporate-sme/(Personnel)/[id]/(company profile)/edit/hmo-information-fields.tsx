import companyEditsSchema from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-edits-schema'
import FileInput from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/edit/file-upload'
import currencyOptions from '@/components/maskito/currency-options'
import numberOptions from '@/components/maskito/number-options'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
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
import { FC, Suspense, useEffect, useState } from 'react'

interface HmoInformationProps {
  id: string
}
const HmoInformationFields: FC<HmoInformationProps> = ({ id }) => {
  const form = useFormContext<z.infer<typeof companyEditsSchema>>()
  const supabase = createBrowserClient()
  const { data: hmoProviders } = useQuery(getTypes(supabase, 'hmo_providers'))
  const { data: planTypes } = useQuery(getTypes(supabase, 'plan_types'))
  const { data: account } = useQuery(getAccountById(supabase, id))
  const maskedTotalPremiumPaidRef = useMaskito({ options: currencyOptions })
  const maskedTotalUtilizationRef = useMaskito({ options: currencyOptions })
  const isAccountBenefitUploadEnabled = useFeatureFlag('account-benefit-upload')

  return (
    <>
      <FormField
        key={'monds'}
        control={form.control}
        name="hmo_provider_id"
        render={({ field }) => (
          <FormItem>
            <div className="pt-4">
              <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                HMO Provider:
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
                    {hmoProviders?.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="previous_hmo_provider_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                  Previous HMO Provider:
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
                      {hmoProviders?.map((provider) => (
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
      <FormField
        control={form.control}
        name="old_hmo_provider_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                  Old HMO Provider:
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
                      {hmoProviders?.map((provider) => (
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
      <FormField
        control={form.control}
        name="principal_plan_type_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                  Principal Plan Type:
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
                      {planTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
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
      <FormField
        control={form.control}
        name="dependent_plan_type_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                  Dependent Plan Type:
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
                      {planTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
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
      <FormField
        control={form.control}
        name="total_utilization"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                  Total Utilization:
                  <Input
                    className="w-full"
                    {...field}
                    value={field.value ?? ''}
                    ref={maskedTotalUtilizationRef}
                    onInput={field.onChange}
                  />
                </div>
              </div>
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
            <FormControl>
              <div className="pt-4">
                <div className="text-md w-full text-[#1e293b] md:grid md:grid-cols-2 lg:grid-cols-1">
                  Total Premium Paid:
                  <Input
                    className="w-full"
                    {...field}
                    value={field.value ?? ''}
                    ref={maskedTotalPremiumPaidRef}
                    onInput={field.onChange}
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
              <FormControl>
                <div className="pt-4">
                  <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                    Contract and Proposal:
                    <Input className="w-full" {...field} />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {isAccountBenefitUploadEnabled ? (
        <FileInput
          form={form}
          name="special_benefits_files"
          label="Special Benefits"
          maxFileSize={25 * 1024 * 1024} 
          existingFiles={account?.special_benefits_files || []}
          id={id}
        />
      ) : (
        <FormField
          control={form.control}
          name="special_benefits"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="pt-4">
                  <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                    Special Benefits:
                    <Input className="w-full" {...field} />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {isAccountBenefitUploadEnabled ? (
        <FileInput
          form={form}
          name="additional_benefits_files"
          label="Additional Benefits"
          maxFileSize={25 * 1024 * 1024} 
          existingFiles={account?.additional_benefits_files || []}
          id={id}
        />
      ) : (
        <FormField
          control={form.control}
          name="additional_benefits_text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="pt-4">
                  <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                    Additional Benefits:
                    <Input className="w-full" {...field} />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

  <FormField
    control={form.control}
    name="remarks"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <div className="pt-4">
            <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
              Remarks:
              <Input className="w-full" {...field} />
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
    </>
  )
}

export default HmoInformationFields
