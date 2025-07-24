import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-provider'
import useConfirmationStore from '@/components/confirmation-dialog/confirmationStore'
import { toast } from '@/components/ui/use-toast'
import getAffiliateByCompanyId from '@/queries/get-affiliates-by-company-id'
import {
  useQuery,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query'
import { FC, ReactNode } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

interface DeleteAllAffiliatesProps {
  button: ReactNode
}

const DeleteAllAffiliates: FC<DeleteAllAffiliatesProps> = ({ button }) => {
  const { openConfirmation } = useConfirmationStore()
  const supabase = createBrowserClient()
  const { accountId } = useCompanyContext()

  // get all affiliates
  const { data: affiliates } = useQuery(
    getAffiliateByCompanyId(supabase, accountId),
  )

  const { mutateAsync } = useUpsertMutation(
    // @ts-ignore
    supabase.from('company_affiliates'),
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Affiliate deleted!',
          description: 'All Affiliate have been deleted successfully.',
        })
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

  const handleDelete = async () => {
    // check if Affiliate exist
    if (!affiliates) return

    // get user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // insert "delete request" for each affiliates
    await mutateAsync(
      affiliates?.map((affiliates) => ({
        id: affiliates.id,
        is_active: false,
        updated_at: new Date().toISOString(),
      })),
    )
  }

  return (
    <div
      onClick={() => {
        openConfirmation({
          title: 'Delete All Affiliates?',
          description:
            'Are you sure you want to delete all affiliates? This action CANNOT be undone.',
          actionLabel: 'I understand, delete all affiliates',
          cancelLabel: 'Cancel',
          onAction: handleDelete,
          onCancel: () => {},
        })
      }}
    >
      {button}
    </div>
  )
}

export default DeleteAllAffiliates
