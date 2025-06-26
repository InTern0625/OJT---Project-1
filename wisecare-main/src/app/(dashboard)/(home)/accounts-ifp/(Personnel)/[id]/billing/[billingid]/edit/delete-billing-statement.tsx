'use client'
import useConfirmationStore from '@/components/confirmation-dialog/confirmationStore'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Tables } from '@/types/database.types'
import { useUpdateMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase-client'

const DeleteBillingStatement = ({
  billingStatementId,
  accountId,
}: {
  billingStatementId: string
  accountId: string
}) => {
  const { openConfirmation } = useConfirmationStore()
  const { toast } = useToast()
  const router = useRouter()

  const supabase = createBrowserClient()
  const { mutateAsync, isPending } = useUpdateMutation(
    // @ts-ignore
    supabase.from('billing_statements'),
    ['id'],
    'id',
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Billing Statement Deleted',
          description: 'Your billing statement has been deleted.',
        })
        router.push(`/accounts-ifp/${accountId}/billing`)
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

  const onDeleteHandler = async () => {
    try {
      await mutateAsync({
        id: billingStatementId,
        is_active: false,
        updated_at: new Date().toISOString(),
      })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: error.message,
      })
    }
  }

  return (
    <Button
      variant={'destructive'}
      type="button"
      disabled={isPending}
      onClick={() => {
        openConfirmation({
          title: 'Are you sure?',
          description:
            'This action CANNOT be undone. This will permanently delete the billing statement.',
          cancelLabel: 'Cancel',
          actionLabel: 'I understand, delete this billing statement',
          confirmationButtonVariant: 'destructive',
          onAction: () => onDeleteHandler(),
          onCancel: () => {},
        })
      }}
    >
      <Trash />
    </Button>
  )
}

export default DeleteBillingStatement
