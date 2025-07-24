import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-provider'
import affiliateSchema from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-schema'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Tables } from '@/types/database.types'
import { createBrowserClient } from '@/utils/supabase-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpsertMutation, useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { Loader2 } from 'lucide-react'
import { FC, FormEventHandler, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
//Extend gender_type to company schema


interface AffiliatesFormProps {
  setIsOpen: (value: boolean) => void
  oldAffiliateData?: Tables<'company_affiliates'>
}

const AffiliateForm: FC<AffiliatesFormProps> = ({
  setIsOpen,
  oldAffiliateData,
}) => {
  const { accountId } = useCompanyContext()

  // form updater
  const [isDone, setIsDone] = useState(false)

  const form = useForm<z.infer<typeof affiliateSchema>>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: {
      affiliate_name: '',
      affiliate_address: '',
    },
  })
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const { mutateAsync, isPending } = useUpsertMutation(
    // @ts-ignore
    supabase.from('company_affiliates'),
    ['id'],
    null,
    {
      onSuccess: () => {
        setIsOpen(false)

        toast({
          variant: 'default',
          title: oldAffiliateData ? 'Affiliates updated!' : 'Affiliates added!',
          description: oldAffiliateData
            ? 'The affiliates details have been updated successfully.'
            : 'The affiliates details have been added successfully.',
        })
      },
      onError: (err: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err.message,
        })
      },
    },
  )

  const onSubmitHandler = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      form.handleSubmit(async (data) => {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          return toast({
            variant: 'destructive',
            title: 'Error',
            description: 'User not found',
          })
        }

        await mutateAsync([
          {
            ...(oldAffiliateData && {
              id: oldAffiliateData.id,
            }),
            ...data,
            parent_company_id: accountId,
            created_by: user.id,
          },
        ])
      })(e)
    },
    [accountId, form, mutateAsync, oldAffiliateData, supabase.auth, toast],
  )

  // If oldAffiliateData is provided, we are editing an existing Affiliate
  useEffect(() => {
    if (oldAffiliateData) {
      form.reset({
        affiliate_name: oldAffiliateData.affiliate_name ?? '',
        affiliate_address: oldAffiliateData.affiliate_address ?? '',
      })

      // trigger a re-render
      setIsDone(true)
    }
  }, [form, oldAffiliateData])
  
  return (
    <Form {...form}>
      {/* key is used to trigger a re-render */}
      <form key={isDone ? 0 : 1} onSubmit={onSubmitHandler}>
        <div className="grid grid-cols-2 gap-4 py-4">
          <FormField
            control={form.control}
            name="affiliate_name"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
                <FormLabel className="text-right">Affiliate Name</FormLabel>
                <FormControl className="col-span-3">
                  <Input type="text" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage className="col-span-3 col-start-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="affiliate_address"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4 gap-y-0">
                <FormLabel className="text-right">Affiliate Address</FormLabel>
                <FormControl className="col-span-3">
                  <Input type="text" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage className="col-span-3 col-start-2" />
              </FormItem>
            )}
          />

          <div className="col-span-2 flex justify-end gap-2 pt-2">
            <Button
              variant={'outline'}
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : oldAffiliateData ? (
                'Update'
              ) : (
                'Add'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default AffiliateForm
