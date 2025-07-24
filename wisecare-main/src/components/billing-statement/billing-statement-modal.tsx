'use client'

import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-provider'
import BillingStatementSchema from '@/app/(dashboard)/(home)/billing-statements-corporate-sme/billing-statement-schema'
import DeleteBillingStatement from '@/components/billing-statement/delete-billing-statement'
import formatOriginalData from '@/components/billing-statement/formatOriginalData'
import currencyOptions from '@/components/maskito/currency-options'
import percentageOptions from '@/components/maskito/percentage-options'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { useToast } from '@/components/ui/use-toast'
import getAllAccounts from '@/queries/get-all-accounts'
import getTypes from '@/queries/get-types'
import { Tables } from '@/types/database.types'
import normalizeToUTC from '@/utils/normalize-to-utc'
import { cn } from '@/utils/tailwind'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMaskito } from '@maskito/react'
import {
  useInsertMutation,
  useQuery,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query'
import { format } from 'date-fns'
import { CalendarIcon, Loader2, ChevronsUpDown, Check} from 'lucide-react'
import { FormEventHandler, ReactNode, useCallback, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createBrowserClient } from '@/utils/supabase-client'
import { Skeleton } from "@/components/ui/skeleton"

interface Props<TData> {
  originalData?: TData & Tables<'billing_statements'>
  button?: ReactNode
  open: boolean
  setOpen: (value: boolean) => void
  accountType?: string
}

const BillingStatementModal = <TData,>({
  originalData,
  button,
  open,
  setOpen,
  accountType
}: Props<TData>) => {
  const { toast } = useToast()
  const [tableRerender, setTableRerender] = useState(0)

  const CompanyContext = useCompanyContext()

  const form = useForm<z.infer<typeof BillingStatementSchema>>({
    resolver: zodResolver(BillingStatementSchema),
    defaultValues: {
      mode_of_payment_id: undefined,
      due_date: undefined,
      or_number: '',
      or_date: undefined,
      sa_number: '',
      total_contract_value: undefined,
      balance: undefined,
      billing_period: undefined,
      billing_start: undefined,
      billing_end: undefined,
      billing_date:undefined,
      amount_billed: undefined,
      amount_paid: undefined,
      commission_rate: undefined,
      commission_earned: undefined,
      account_id: undefined,
    },
    values: {
      account_id: CompanyContext?.accountId ?? undefined,
      ...(originalData && formatOriginalData(originalData as any)),
    },
  })

  const supabase = createBrowserClient()
  const { data: modeOfPayments } = useQuery(
    getTypes(supabase, 'mode_of_payments'),
  )
  
  const { data: unFilteredAccounts } = useQuery(getAllAccounts(supabase))
  let accounts = unFilteredAccounts 
  if (accountType == "Business"){
    accounts = unFilteredAccounts?.filter(
      (acc) => {
        const isBusiness = acc.account_type !== null;
        const isIFP = acc.program_type !== null;

        return (isBusiness && !isIFP) || (!isBusiness && !isIFP);
      }
    )
    
  }else if(accountType == "IFP"){
    accounts = unFilteredAccounts?.filter(
      (acc) => {
        const isBusiness = acc.account_type !== null;
        const isIFP = acc.program_type !== null;

        return (!isBusiness && isIFP) || (!isBusiness && !isIFP);
      }
    )
  }else{
    accounts = unFilteredAccounts 
  }
  const { mutateAsync, isPending } = useUpsertMutation(
    // @ts-ignore
    supabase.from('billing_statements'),
    ['id'],
    null,
    {
      onSuccess: () => {
        setOpen(false)

        toast({
          variant: 'default',
          title: originalData
            ? 'Billing Statement updated!'
            : 'Billing Statement created!',
          description: originalData
            ? 'Your billing statement has been updated.'
            : 'Your billing statement has been created.',
        })

        // if creating new billing statement. then we should reset the form
        if (!originalData) {
          form.reset()
        }

        // rerender table to refresh masking inputs
        setTableRerender((prev) => prev + 1)
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message,
        })
      },
    },
  )
  
  const onSubmitHandler = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      form.handleSubmit(async (data) => {

        await mutateAsync([
          {
            ...data,
            // @ts-ignore
            ...(originalData?.id && {
              id: originalData.id,
              updated_at: new Date().toISOString(),
            }),
            due_date: data.due_date
              ? normalizeToUTC(new Date(data.due_date))
              : undefined,
            or_date: data.or_date
              ? normalizeToUTC(new Date(data.or_date))
              : undefined,
            billing_start: data.billing_start
              ? normalizeToUTC(new Date(data.billing_start))
              : undefined,
            billing_end: data.billing_end
              ? normalizeToUTC(new Date(data.billing_end))
              : undefined,   
            billing_date: data.billing_date
              ? normalizeToUTC(new Date(data.billing_date))
              : undefined,
            //assign weeks to billing period
          },
        ])
      })(e)
    },
    [form, mutateAsync, originalData],
  )

  // if the modal is opened from the Company Profile page,
  // it should automatically fill the account_id field with the company id
  // const CompanyContext = useCompanyContext()
  // useEffect(() => {
  //   // check if context exist
  //   if (CompanyContext && CompanyContext !== undefined) {
  //     form.reset({
  //       account_id: CompanyContext.accountId,
  //     })
  //   }
  // }, [CompanyContext, form])
  const [openCommand, setOpenCommand] = useState(false)
  const [search, setSearch] = useState("")
  
  //filter accounts by search letters
  const filteredAccounts = useMemo(() => {
  if (!search) return accounts ?? []
    return (accounts ?? []).filter((item) =>
    item.company_name.toLowerCase().startsWith(search.toLowerCase())
  )
  }, [search, accounts])

  const maskedTotalContractValueRef = useMaskito({ options: currencyOptions })
  const maskedBalanceRef = useMaskito({ options: currencyOptions })
  const maskedAmountBilledRef = useMaskito({ options: currencyOptions })
  const maskedAmountPaidRef = useMaskito({ options: currencyOptions })
  const maskedCommissionRateRef = useMaskito({ options: percentageOptions })
  const maskedCommissionEarnedRef = useMaskito({ options: currencyOptions })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {button && <DialogTrigger asChild={true}>{button}</DialogTrigger>}
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>
            {originalData ? 'Edit billing statement' : 'Add Billing Statement'}
          </DialogTitle>
          <DialogDescription>
            {originalData
              ? `Edit billing statement ${originalData.id}`
              : 'Add a new billing statement to the account'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmitHandler} key={tableRerender}>
            <div className="grid grid-cols-2 gap-4 py-4">
              {accounts ? (
                <FormField
                  control={form.control}
                  name="account_id"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
                      <FormLabel className="text-right">Account</FormLabel>
                      <FormControl className="col-span-3">
                        <Popover open={openCommand} onOpenChange={setOpenCommand}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openCommand}
                              className="col-span-3 rounded-sm justify-between overflow-hidden"
                            >
                              {accounts?.find((item) => item.id === field.value)?.company_name ??
                                "Select Company..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[500px] p-0 overflow-hidden">
                            <Command className="overflow-hidden">
                              <CommandInput placeholder="Search Company..." onValueChange={setSearch}/>
                              <CommandList>
                                <CommandEmpty>No Companies.</CommandEmpty>
                                <CommandGroup>
                                  {filteredAccounts?.map((item) => (
                                    <CommandItem
                                      key={item.id}
                                      value={item.company_name}
                                      onSelect={() => {
                                        field.onChange(item.id) 
                                        setOpenCommand(false)
                                      }}
                                    >
                                      {item.company_name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="col-span-3 col-start-2" />
                    </FormItem>
                  )}
                />
              ) : (
                <Skeleton className="h-10 w-[200px] col-span-3 col-start-2" />
              )}
              <FormField
                control={form.control}
                name="mode_of_payment_id"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
                    <FormLabel className="text-right">
                      Mode of Payment
                    </FormLabel>
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
                                <span>Select due date</span>
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
                    <FormLabel className="text-right">
                      Total Contract Value
                    </FormLabel>
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
                    <FormLabel className="text-right">
                      Commission Rate
                    </FormLabel>
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
                    <FormLabel className="text-right">
                      Commission Earned
                    </FormLabel>
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
            </div>
            <DialogFooter
              className={cn(
                'flex w-full items-center',
                originalData && 'justify-between!',
              )}
            >
              {originalData && (
                <DeleteBillingStatement
                  originalData={{
                    ...originalData,
                    account_id: (originalData as any).account.id,
                    mode_of_payment_id:
                      (originalData as any).mode_of_payment?.id ?? '',
                    updated_at: originalData.created_at,
                  }}
                  setOpen={setOpen}
                />
              )}
              <div className="space-x-2">
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : originalData ? (
                    'Update Billing Statement'
                  ) : (
                    'Add Billing Statement'
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default BillingStatementModal
