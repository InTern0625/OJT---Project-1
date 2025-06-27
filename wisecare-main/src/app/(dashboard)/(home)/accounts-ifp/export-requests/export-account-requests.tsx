import ExportAccountRequestList from '@/app/(dashboard)/(home)/accounts-ifp/export-requests/export-account-request-list'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import getPendingAccountExports from '@/queries/get-pending-account-exports'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createBrowserClient } from '@/utils/supabase-client'

const ExportAccountRequests = () => {
  const supabase = createBrowserClient()
  const { count } = useQuery(getPendingAccountExports(supabase, 'accounts'))

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button
          variant={'outline'}
          size={'sm'}
          className="flex h-8 w-fit rounded-none"
        >
          {count} Export Requests
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Requests</DialogTitle>
          <DialogDescription>
            View and manage export requests and submissions
          </DialogDescription>
        </DialogHeader>
        <ExportAccountRequestList />
      </DialogContent>
    </Dialog>
  )
}

export default ExportAccountRequests
