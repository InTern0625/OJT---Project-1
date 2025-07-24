import useConfirmationStore from '@/components/confirmation-dialog/confirmationStore'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'
import getAffiliatesByCompanyId from '@/queries/get-affiliates-by-company-id'
import { Tables } from '@/types/database.types'
import {
  useQuery,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query'
import { CopySlash } from 'lucide-react'
import { createBrowserClient } from '@/utils/supabase-client'

const DeleteDuplicateAffiliates = ({ companyId }: { companyId: string }) => {
  const { openConfirmation } = useConfirmationStore()
  const supabase = createBrowserClient()

  const { data } = useQuery<Tables<'company_affiliates'>[]>(
    // @ts-ignore
    getAffiliatesByCompanyId(supabase, companyId),
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
          title: 'Duplicate affiliates removed!',
          description:
            'All duplicate affiliates have been removed successfully.',
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

  const deleteDuplicates = async () => {
    if (!data) {
      return toast({
        variant: 'destructive',
        title: 'No duplicate affiliates found',
      })
    }

    // Sort affiliates by created_at in descending order
    const sortedData = [...data].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )

    const seenKeys = new Set<string>()
    const duplicatesToDelete = []

    for (const affiliates of sortedData) {
      const key = `${affiliates.affiliate_name}`
      if (seenKeys.has(key)) {
        duplicatesToDelete.push(affiliates) // Mark for deletion
      } else {
        seenKeys.add(key) // Keep the newest entry
      }
    }

    if (duplicatesToDelete.length === 0) {
      return toast({
        variant: 'destructive',
        title: 'No duplicate affiliates found',
      })
    }

    if (duplicatesToDelete.length > 0) {
      await mutateAsync(
        duplicatesToDelete.map((affiliates) => ({
          id: affiliates.id,
          is_active: false,
        })),
      )
    }
  }

  return (
    <DropdownMenuItem
      className="focus:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50"
      onClick={() => {
        openConfirmation({
          title: 'Delete Duplicate Affiliates',
          description:
            'Are you sure you want to remove duplicate affiliates? The most recently added affiliates will be kept.',
          actionLabel: 'Delete',
          cancelLabel: 'Cancel',
          onAction: deleteDuplicates,
          onCancel: () => {},
        })
      }}
    >
      <CopySlash className="h-4 w-4" />
      <span>Delete Duplicate Affiliates</span>
    </DropdownMenuItem>
  )
}

export default DeleteDuplicateAffiliates
