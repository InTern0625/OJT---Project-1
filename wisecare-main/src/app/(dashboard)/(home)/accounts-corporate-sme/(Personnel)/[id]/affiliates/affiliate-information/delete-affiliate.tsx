'use client'
import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-provider'
import useConfirmationStore from '@/components/confirmation-dialog/confirmationStore'
import { useToast } from '@/components/ui/use-toast'
import { useUpdateMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { FC, ReactNode } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

interface DeleteAffiliateProps<TData> {
  originalData: TData
  button: ReactNode
}

const DeleteAffiliate: FC<DeleteAffiliateProps<any>> = ({
  originalData,
  button,
}) => {
  const { userRole } = useCompanyContext()
  const { openConfirmation, closeConfirmation } = useConfirmationStore()
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const { mutateAsync, isPending } = useUpdateMutation(
    // @ts-ignore
    supabase.from('company_affiliates'),
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Affiliate deleted!',
          description: 'The affiliate has been deleted successfully.',
        })
        closeConfirmation()
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

  if (
    !userRole ||
    !['marketing', 'finance', 'under-writing', 'after-sales', 'admin'].includes(
      userRole,
    )
  ) {
    return null
  }

  const handleDelete = async () => {
    await mutateAsync({
      id: originalData.id,
      is_active: false,
    })
  }

  return (
    <>
      <div
        className="text-destructive cursor-pointer"
        onClick={() => {
          openConfirmation({
            title: 'Are you sure?',
            description:
              'This action CANNOT be undone. This will permanently delete the affiliate.',
            cancelLabel: 'Cancel',
            actionLabel: 'I understand, delete this affiliate',
            confirmationButtonVariant: 'destructive',
            onAction: handleDelete,
            onCancel: () => {},
          })
        }}
      >
        {button}
      </div>
    </>
  )
}

export default DeleteAffiliate
