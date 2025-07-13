import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import PendingInputs from './forms/pending-inputs'
import pendingSchema from './forms/pending-schema'
import { Separator } from '@/components/ui/separator'
import DisabledInputs from './forms/disabled-inputs'
import { Button } from '@/components/ui/button'
import { FC, FormEventHandler, useCallback } from 'react'
import { useUpdateMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { createBrowserClient } from '@/utils/supabase-client'

interface Props {
  accountId: string
  setOpenForm: (_value: string | null) => void
}

const UpdatePendingForm: FC<Props> = ({ accountId, setOpenForm }) => {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof pendingSchema>>({
    resolver: zodResolver(pendingSchema),
    defaultValues: {
      mode_of_payment_id: null,
      due_date: null,
      or_number: null,
      or_date: null,
      sa_number: null,
      amount: null,
      total_contract_value: null,
      balance: null,
      billing_period: null,
    },
  })

  const supabase = createBrowserClient()
  const { mutateAsync, isPending } = useUpdateMutation(
    // @ts-ignore
    supabase.from('accounts'),
    ['id'],
    'id',
    {
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: error.message,
        })
      },
      onSuccess: () => {
        setOpenForm(null)
        // reset form
        form.reset()
        toast({
          variant: 'default',
          title: 'Success',
          description: 'Pending updated',
        })
      },
    },
  )

  const onUpdateHandler = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      form.handleSubmit(async (data) => {
        // check if mode_of_payment_id is not empty
        if (data.mode_of_payment_id === '') {
          toast({
            variant: 'destructive',
            title: 'Something went wrong',
            description: 'Mode of payment is required',
          })
          return
        }
        await mutateAsync({
          ...data,
          id: accountId,
        })
      })(e)
    },
    [form, mutateAsync, accountId, toast],
  )

  return (
    <Form {...form}>
      <form onSubmit={onUpdateHandler}>
        <div className="w-full space-y-5 px-8 py-5">
          <DisabledInputs isLoading={false} id={accountId} />
          <Separator className="my-5" />
          <PendingInputs isLoading={isPending} />
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : 'Update'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UpdatePendingForm
