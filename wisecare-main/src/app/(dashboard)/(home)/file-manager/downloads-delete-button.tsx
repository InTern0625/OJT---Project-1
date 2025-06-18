import React from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { useUpdateMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { useDownloadsContext } from '@/app/(dashboard)/(home)/file-manager/downloads-provider'
import { createBrowserClient } from '@/utils/supabase-client'

const DownloadsDeleteButton = () => {
  const supabase = createBrowserClient()
  const { file, setIsSheetOpen, setFile } = useDownloadsContext()

  const { mutateAsync, isPending } = useUpdateMutation(
    supabase.from('pending_export_requests'),
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Request deleted!',
          description: 'Successfully deleted request',
        })
        setIsSheetOpen(false)
        setFile(null)
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

  const handleDeleteFile = async () => {
    await mutateAsync({ id: file?.id, is_active: false })
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full" variant="destructive">
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {file?.export_type === 'accounts'
                ? 'Delete Account Sheet'
                : 'Delete Employee Sheet'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {file?.export_type === 'accounts'
                ? 'Are you sure you want to delete this account sheet?'
                : 'Are you sure you want to delete this employee sheet?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteFile} disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>Delete</>
              )}
            </AlertDialogCancel>
            <AlertDialogAction disabled={isPending}>Cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DownloadsDeleteButton
