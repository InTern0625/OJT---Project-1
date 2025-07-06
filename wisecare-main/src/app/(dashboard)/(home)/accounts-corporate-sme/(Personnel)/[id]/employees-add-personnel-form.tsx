'use client'
import EmployeesAddPersonnelButton from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/employees-add-personnel-button'
import employeesSchema from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/employees-add-personnel-schema'
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
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/utils/tailwind'
import { zodResolver } from '@hookform/resolvers/zod'
import { useInsertMutation, useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { FormEventHandler, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createBrowserClient } from '@/utils/supabase-client'
import getTypes from '@/queries/get-types'

const EmployeesAddPersonnelForm = () => {
  const { toast } = useToast()
  const params = useParams<{ id: string }>()
  const supabase = createBrowserClient()
  const { data: genderTypes } = useQuery(getTypes(supabase, 'gender_types'))
  const { data: civilStatusTypes } = useQuery(getTypes(supabase, 'civil_status_types'))
  const { data: roomPlanTypes } = useQuery(getTypes(supabase, 'room_plans'))
  const form = useForm<z.infer<typeof employeesSchema>>({
    resolver: zodResolver(employeesSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      birth_date: new Date(),
      gender_types_id: undefined,
      civil_status_id: undefined,
      card_number: '',
      effective_date: new Date(),
      room_plan_id: undefined,
      maximum_benefit_limit: 0,
    },
  })

  const { mutateAsync, isPending } = useInsertMutation(
    //@ts-ignore
    supabase.from('company_employees'),
    ['id'],
    'id',
    {
      onSuccess: () => {
        form.reset()
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

  const onSubmitHandler = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      form.handleSubmit(async (data) => {
        const supabase = createBrowserClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        await mutateAsync([
          {
            ...data,
            account_id: params.id || '',
            created_by: user?.id || '',
          },
        ])
      })(e)
    },
    [form, mutateAsync, params.id],
  )

  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler}>
        <div className="mx-auto grid-cols-2 gap-4 lg:grid">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        disabled={isPending}
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
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender_types_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Civil Status</FormLabel>
                <FormControl>
                  <Select disabled={isPending}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="civil_status_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Civil Status</FormLabel>
                <FormControl>
                  <Select disabled={isPending}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Civil Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {civilStatusTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="card_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="effective_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        disabled={isPending}
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
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="room_plan_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Civil Status</FormLabel>
                <FormControl>
                  <Select disabled={isPending}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Room Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomPlanTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maximum_benefit_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Benefit Limit</FormLabel>
                <FormControl>
                  <Input {...field} type="number" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4 flex flex-row items-center justify-between gap-4 lg:ml-auto lg:justify-end">
          <EmployeesAddPersonnelButton isPending={isPending} />
          <Button
            type="submit"
            variant="default"
            className="w-full rounded-md lg:w-auto"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EmployeesAddPersonnelForm
