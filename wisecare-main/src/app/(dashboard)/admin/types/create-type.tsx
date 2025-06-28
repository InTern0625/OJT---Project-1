'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useInsertMutation } from '@supabase-cache-helpers/postgrest-react-query'
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
      name: '',
    },
  })

  const supabase = createBrowserClient()
  const { toast } = useToast()

  const { mutateAsync, isPending } = useInsertMutation(
    // @ts-ignore
    supabase.from(page),
    ['id'],
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
            <FormItem>
              <FormLabel>
                Add <span className="lowercase">{renderTitle()}</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} disabled={isPending} />
                  <Button
                    className="absolute top-1 right-1"
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
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default CreateType
