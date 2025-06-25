'use client'
import { DeleteCompanySchema } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/delete-company-schema'
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import getAccountById from '@/queries/get-account-by-id'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useInsertMutation,
  useQuery,
} from '@supabase-cache-helpers/postgrest-react-query'
import { Loader2, X } from 'lucide-react'
import { FC, FormEventHandler, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createBrowserClient } from '@/utils/supabase-client'

interface Props {
  accountId: string
  setIsOpen: (value: boolean) => void
  setIsEditPendingRequestOpen: (value: boolean) => void
  setPendingRequestId: (value: string) => void
}

const CompanyDeleteForm: FC<Props> = ({
  accountId,
  setIsOpen,
  setIsEditPendingRequestOpen,
  setPendingRequestId,
}) => {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof DeleteCompanySchema>>({
    resolver: zodResolver(DeleteCompanySchema),
    defaultValues: {
      companyName: '',
    },
  })

  const supabase = createBrowserClient()
  const { data: account } = useQuery(getAccountById(supabase, accountId))

  const { mutateAsync, isPending } = useInsertMutation(
    // @ts-ignore
    supabase.from('pending_accounts'),
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Deletion Request Submitted',
          description:
            'Your request to delete the company account has been submitted successfully and is awaiting approval.',
        })

        setIsOpen(false)
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: error.message,
        })
      },
    },
  )

  const onUpdateHandler = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      form.handleSubmit(async (data) => {
        // check if companyName is same as account?.company_name
        if (data.companyName !== account?.company_name) {
          form.setError('companyName', {
            type: 'manual',
            message: 'Company name does not match',
          })
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          return
        }

        // check if there is already a pending request
        const { data: pendingRequest } = await supabase
          .from('pending_accounts')
          .select('id')
          .eq('account_id', accountId)
          .eq('is_active', true)
          .eq('is_approved', false)
          .eq('created_by', user?.id)
          .limit(1)
          .maybeSingle()

        if (pendingRequest) {
          setIsEditPendingRequestOpen(true)
          setPendingRequestId(pendingRequest.id)
          return Error('Request already exists')
        }

        await mutateAsync([
          {
            account_id: accountId,
            is_delete_account: true,
            company_name: data.companyName,
            created_by: user?.id,
            operation_type: 'delete',
          },
        ])
      })(e)
    },
    [
      account?.company_name,
      accountId,
      form,
      mutateAsync,
      setIsEditPendingRequestOpen,
      setPendingRequestId,
      supabase,
    ],
  )
  return (
    <AlertDialogContent>
      <Form {...form}>
        <form onSubmit={onUpdateHandler}>
          <AlertDialogCancel className="absolute top-5 right-5 h-fit w-fit border-0 p-0">
            <X className="h-4 w-4" />
          </AlertDialogCancel>
          <AlertDialogHeader className="mb-3">
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              This action <span className="font-bold">CANNOT</span> be undone.
              This will permanently delete the{' '}
              <span className="font-bold">{account?.company_name}</span>{' '}
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Please type in the name of the account to confirm.
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AlertDialogFooter className="mt-3">
            <Button
              variant={'destructive'}
              className="w-full"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'I understand, delete this account'
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </AlertDialogContent>
  )
}

export default CompanyDeleteForm
