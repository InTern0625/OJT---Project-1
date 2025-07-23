'use client'

import DeleteBillingStatement from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/billing/[billingid]/edit/delete-billing-statement'
import BillingStatementSchema from '@/app/(dashboard)/(home)/billing-statements-corporate-sme/billing-statement-schema'
import formatOriginalData from '@/components/billing-statement/formatOriginalData'
import currencyOptions from '@/components/maskito/currency-options'
import percentageOptions from '@/components/maskito/percentage-options'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import getAllAccounts from '@/queries/get-all-accounts'
import getBillingStatementById from '@/queries/get-billing-statement-by-id'
import getTypes from '@/queries/get-types'
import normalizeToUTC from '@/utils/normalize-to-utc'
import { cn } from '@/utils/tailwind'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMaskito } from '@maskito/react'
import {
  useQuery,
  useUpdateMutation,
} from '@supabase-cache-helpers/postgrest-react-query'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { FormEventHandler, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createBrowserClient } from '@/utils/supabase-client'

const EditBillingForm = ({ billingid }: { billingid: string }) => {
  const supabase = createBrowserClient()
  const { data: billingStatement } = useQuery(
    getBillingStatementById(supabase, billingid),
  )
  const [openDelete, setOpenDelete] = useState(false)

  const form = useForm<z.infer<typeof BillingStatementSchema>>({
    resolver: zodResolver(BillingStatementSchema),
    defaultValues: {
      ...(billingStatement && formatOriginalData(billingStatement as any)),
      mode_of_payment_id: billingStatement?.mode_of_payments?.[0]?.id,
    },
  })

  const { mutateAsync, isPending } = useUpdateMutation(
    // @ts-ignore
    supabase.from('billing_statements'),
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Billing Statement updated!',
          description: 'Your billing statement has been updated.',
        })
      },
      onError: () => {
        toast({
          variant: 'default',
          title: 'Billing Statement updated!',
          description: 'Your billing statement has been updated.',
        })
      },
    },
  )

  const onSubmitHandler = useCallback<FormEventHandler<HTMLFormElement>>(
    (e: any) => {
      form.handleSubmit(async (data) => {
        await mutateAsync({
          ...data,
          id: billingStatement?.id,
          due_date: data.due_date
            ? normalizeToUTC(new Date(data.due_date))
            : undefined,
          or_date: data.or_date
            ? normalizeToUTC(new Date(data.or_date))
            : undefined,
          billing_date: data.billing_date
            ? normalizeToUTC(new Date(data.billing_date))
            : undefined,
        })
      })(e)
    },
    [billingStatement?.id, form, mutateAsync],
  )

  const { data: modeOfPayments } = useQuery(
    getTypes(supabase, 'mode_of_payments'),
  )
  const { data: accounts } = useQuery(getAllAccounts(supabase))

  const maskedTotalContractValueRef = useMaskito({ options: currencyOptions })
  const maskedBalanceRef = useMaskito({ options: currencyOptions })
  const maskedAmountBilledRef = useMaskito({ options: currencyOptions })
  const maskedAmountPaidRef = useMaskito({ options: currencyOptions })
  const maskedCommissionRateRef = useMaskito({ options: percentageOptions })
  const maskedCommissionEarnedRef = useMaskito({ options: currencyOptions })
  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler} className="grid grid-cols-2 gap-4 py-4">
        <FormField
          control={form.control}
          name="account_id"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">Account</FormLabel>
              <FormControl className="col-span-3">
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts &&
                      accounts?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.company_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mode_of_payment_id"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">Mode of Payment</FormLabel>
              <FormControl className="col-span-3">
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Mode of Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    {modeOfPayments &&
                      modeOfPayments?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="billing_date"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">Billing Date</FormLabel>
              <FormControl className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring col-span-3 flex h-12 w-full rounded-lg border bg-white px-4 py-3 text-sm shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                          !field.value && 'text-muted-foreground',
                          'text-left font-normal',
                        )}
                        disabled={isPending}
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
                      selected={field.value}
                      onSelect={field.onChange}
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
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="or_date"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">OR Date</FormLabel>
              <FormControl className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring col-span-3 flex h-12 w-full rounded-lg border bg-white px-4 py-3 text-sm shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                          !field.value && 'text-muted-foreground',
                          'text-left font-normal',
                        )}
                        disabled={isPending}
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
                      selected={field.value}
                      onSelect={field.onChange}
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
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sa_number"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">SA Number</FormLabel>
              <FormControl className="col-span-3">
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="or_number"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">OR Number</FormLabel>
              <FormControl className="col-span-3">
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount_billed"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">Amount Billed</FormLabel>
              <FormControl className="col-span-3">
                <Input
                  {...field}
                  disabled={isPending}
                  ref={maskedAmountBilledRef}
                  onInput={field.onChange}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount_paid"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">Amount Paid</FormLabel>
              <FormControl className="col-span-3">
                <Input
                  {...field}
                  disabled={isPending}
                  ref={maskedAmountPaidRef}
                  onInput={field.onChange}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">Due Date</FormLabel>
              <FormControl className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring col-span-3 flex h-12 w-full rounded-lg border bg-white px-4 py-3 text-sm shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                          !field.value && 'text-muted-foreground',
                          'text-left font-normal',
                        )}
                        disabled={isPending}
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
                      selected={field.value}
                      onSelect={field.onChange}
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
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
       <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">Balance</FormLabel>
              <FormControl className="col-span-3">
                <Input
                  {...field}
                  disabled={isPending}
                  ref={maskedBalanceRef}
                  onInput={field.onChange}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
        <FormItem>
          <div className="grid grid-cols-8 gap-x-4 items-center">
            <FormLabel className="text-right col-span-2">Billing Period</FormLabel>
            <FormField
              control={form.control}
              name="billing_start"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 col-span-3 items-center gap-x-4 gap-y-0">
                  <FormControl className="col-span-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring col-span-3 flex h-12 w-full rounded-lg border bg-white px-4 py-3 text-sm shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                              !field.value && 'text-muted-foreground',
                              'text-left font-normal',
                            )}
                            disabled={isPending}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Start Date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
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
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billing_end"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 col-span-3 items-center gap-x-4 gap-y-0">
                  <FormControl className="col-span-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring col-span-3 flex h-12 w-full rounded-lg border bg-white px-4 py-3 text-sm shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                              !field.value && 'text-muted-foreground',
                              'text-left font-normal',
                            )}
                            disabled={isPending}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>End Date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
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
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />
          </div>
        </FormItem>
        <FormField
          control={form.control}
          name="total_contract_value"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">Total Contract Value</FormLabel>
              <FormControl className="col-span-3">
                <Input
                  {...field}
                  disabled={isPending}
                  ref={maskedTotalContractValueRef}
                  onInput={field.onChange}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="commission_rate"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">Commission Rate</FormLabel>
              <FormControl className="col-span-3">
                <Input
                  {...field}
                  disabled={isPending}
                  value={field.value ?? ''}
                  ref={maskedCommissionRateRef}
                  onInput={field.onChange}
                />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="commission_earned"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">Commission Earned</FormLabel>
              <FormControl className="col-span-3">
                <Input
                  {...field}
                  disabled={isPending}
                  value={field.value ?? ''}
                  ref={maskedCommissionEarnedRef}
                  onInput={field.onChange}
                />
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        />
        <div className="col-span-2 flex justify-between">
          <DeleteBillingStatement
            billingStatementId={billingStatement?.id || ''}
            accountId={billingStatement?.account_id || ''}
          />
          <Button type="submit" disabled={isPending || !form.formState.isDirty}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EditBillingForm
