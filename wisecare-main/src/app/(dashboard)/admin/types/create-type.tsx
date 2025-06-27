'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useInsertMutation,
  useQuery,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query'
import getTypes from '@/queries/get-types'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { FC, FormEventHandler, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TypeTabs } from './type-card'
import typeSchema from './type-schema'
import { createBrowserClient } from '@/utils/supabase-client'

interface Props {
  page: TypeTabs
}

const CreateType: FC<Props> = ({ page }) => {
  const renderTitle = () => {
    switch (page) {
      case 'account_types':
        return 'Account Types'
      case 'hmo_providers':
        return 'HMO Providers'
      case 'mode_of_payments':
        return 'Mode of Payments'
      case 'plan_types':
        return 'Plan Types'
    }
  }

  const form = useForm<z.infer<typeof typeSchema>>({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      name: undefined,
    },
  }) 

  const supabase = createBrowserClient()

  const { data: accType } = useQuery(
    getTypes(supabase, page),
  )

  const { toast } = useToast()

  const { mutateAsync, isPending } = useInsertMutation(
    // @ts-ignore
    supabase.from(page),
    ['name'],
    'name, id, created_at',
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Type created!',
          description: `Successfully created ${form.getValues('name')} on ${renderTitle()}.`,
        })

        // clear form
        form.reset()
      },
    },
  )

  const onSubmitHandler = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      form.handleSubmit(async (data) => {
        console.log(data);
        await mutateAsync([
          {
            name: data.name,
          },
        ])
      })(e)
    },
    [mutateAsync, form],
  )

  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler} className="mt-8 px-6 lg:px-12">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
              <FormLabel className="text-right">
                Add <span className="lowercase">{renderTitle()}</span>
              </FormLabel>
              <FormControl className="col-span-4">
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accType &&
                      accType?.map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                </FormControl>
                <FormControl className="col-span-1">
                <Button
                  size={'icon'}
                  variant={'ghost'}
                  type="submit"
                  disabled={isPending}
                >
                  <div className="rounded-full bg-[#97a2b1] p-1">
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              </FormControl>
              <FormMessage className="col-span-3 col-start-2" />
            </FormItem>
          )}
        /> 
      </form>
    </Form>
  )
}
export default CreateType
