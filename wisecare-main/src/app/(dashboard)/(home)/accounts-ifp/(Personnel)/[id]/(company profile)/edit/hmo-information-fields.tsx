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
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/utils/tailwind'
import { format } from 'date-fns'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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
    <>
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
                inputMode="numeric"
                pattern="\d*"
                className="w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  // Strip all non-digit characters
                  const numericValue = e.target.value.replace(/\D/g, '');
                  field.onChange(numericValue);
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
              <div className="pt-1">
                <div className="text-sm text-[#1e293b] mb-1">
                  Mode of Payment:
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger
                    className = "w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300">
                      <SelectValue placeholder="Select a mode of payment" />
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
            <FormControl>
              <div className="pt-4">
                <div className="text-md w-full text-[#1e293b] md:grid md:grid-cols-2 lg:grid-cols-1">
                  Effective Date:
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full min-w-[240px] rounded-lg border bg-white px-4 py-3 text-sm shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                            !field.value && 'text-muted-foreground',
                            'text-left font-normal',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date('1900-01-01')}
                        initialFocus
                        captionLayout="dropdown"
                        toYear={new Date().getFullYear() + 20}
                        fromYear={1900}
                        classNames={{
                          day_hidden: 'invisible',
                          dropdown:
                            'px-2 py-1.5 max-h-[100px] overflow-y-auto rounded-md bg-popover text-popover-foreground text-sm  focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
                          caption_dropdowns: 'flex gap-3',
                          vhidden: 'hidden',
                          caption_label: 'hidden',
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
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
            <FormControl>
              <div className="pt-4">
                <div className="text-md w-full text-[#1e293b] md:grid md:grid-cols-2 lg:grid-cols-1">
                  Expiration Date:
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full min-w-[240px] rounded-lg border bg-white px-4 py-3 text-sm shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                            !field.value && 'text-muted-foreground',
                            'text-left font-normal',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date('1900-01-01')}
                        initialFocus
                        captionLayout="dropdown"
                        toYear={new Date().getFullYear() + 20}
                        fromYear={1900}
                        classNames={{
                          day_hidden: 'invisible',
                          dropdown:
                            'px-2 py-1.5 max-h-[100px] overflow-y-auto rounded-md bg-popover text-popover-foreground text-sm  focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
                          caption_dropdowns: 'flex gap-3',
                          vhidden: 'hidden',
                          caption_label: 'hidden',
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
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
                <SelectTrigger
                   className = "w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300">
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

          return (
            <FormItem>
              <FormControl>
                <div className="pt-2">
                  <div className="text-sm grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                    Room Plan:
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                        className = "w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300">
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
           <div className="text-sm text-[#1e293b]">MBL:</div>
           <Input
             className="w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
             {...field}
             value={field.value ?? ''}
             ref={maskedMBLRef}
             onInput={field.onChange}
           />
           <FormMessage />
         </FormItem>
       )}
     />

      <FormField
        control={form.control}
        name="premium"
        render={({ field }) => (
          <FormItem>
            <div className="text-sm text-[#1e293b]">Premium:</div>
            <Input
              className="w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
              {...field}
              value={field.value ?? ''}
              ref={maskedTotalPremiumPaidRef}
              onInput={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />

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
    </>
  )
}

export default HmoInformationFields
