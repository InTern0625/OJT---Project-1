'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import getPendingAccounts from '@/queries/get-pending-accounts'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

const AccountRequestList = dynamic(
  () =>
    import('@/app/(dashboard)/(home)/accounts-ifp/request/account-request-list'),
  { ssr: false },
)

const AccountRequest = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const supabase = createBrowserClient()

  const { count } = useQuery(getPendingAccounts(supabase))

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={true}>
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 rounded-none"
        >
          {count} Requests
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Requests</DialogTitle>
          <DialogDescription>
            View and manage account requests and submissions
          </DialogDescription>
        </DialogHeader>
        {isOpen && (
          <Suspense fallback={<div>Loading...</div>}>
            <AccountRequestList />
          </Suspense>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AccountRequest
