import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import { useUpdateMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { Loader2, Trash } from 'lucide-react'
import { FC } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

interface EditPendingRequestProps {
  isOpen: boolean
  onClose: () => void
  pendingRequestId: string
}

const EditPendingRequest: FC<EditPendingRequestProps> = ({
  isOpen,
  onClose,
  pendingRequestId,
}) => {
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const { mutateAsync, isPending } = useUpdateMutation(
    supabase.from('pending_accounts') as any,
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Request deleted!',
          description: 'Successfully deleted request',
        })
        onClose()
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

  const handleDelete = () => {
    mutateAsync({ id: pendingRequestId, is_active: false })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Pending Request Notice</AlertDialogTitle>
          <AlertDialogDescription>
            Your request is awaiting admin approval. If you wish to make further
            changes to the company details, you may delete the current request,
            but{' '}
            <span className="font-bold">all changes will be discarded.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDelete} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" /> Delete Request
              </>
            )}
          </AlertDialogCancel>
          <AlertDialogAction disabled={isPending}>
            Wait for Approval
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditPendingRequest
