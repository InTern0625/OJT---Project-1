'use client'
import { useCompanyEditContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-edit-provider'
import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-provider'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import dynamic from 'next/dynamic'
import { FC, Suspense, useState } from 'react'

const CompanyDeleteForm = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/delete/company-delete-form'
    ),
  { ssr: false },
)

const EditPendingRequest = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/edit-pending-request'
    ),
  { ssr: false },
)

interface Props {
  accountId: string
  userRole: string | null
}

const CompanyDeleteButton: FC<Props> = ({ accountId, userRole }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { editMode } = useCompanyEditContext()

  const [isEditPendingRequestOpen, setIsEditPendingRequestOpen] =
    useState(false)
  const [pendingRequestId, setPendingRequestId] = useState('')

  if (
    ['marketing', 'finance', 'admin', 'under-sales', 'after-sales'].includes(
      userRole || '',
    ) &&
    !editMode
  ) {
    return (
      <>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild={true}>
            <Button variant={'link'} className="text-red-500" type="button">
              <Trash className="mr-2" /> Delete Account
            </Button>
          </AlertDialogTrigger>
          <Suspense fallback={<div>Loading...</div>}>
            <CompanyDeleteForm
              accountId={accountId}
              setIsOpen={setIsOpen}
              setIsEditPendingRequestOpen={setIsEditPendingRequestOpen}
              setPendingRequestId={setPendingRequestId}
            />
          </Suspense>
        </AlertDialog>
        <Suspense fallback={<div>Loading...</div>}>
          <EditPendingRequest
            isOpen={isEditPendingRequestOpen}
            onClose={() => setIsEditPendingRequestOpen(false)}
            pendingRequestId={pendingRequestId}
          />
        </Suspense>
      </>
    )
  }
  return null
}

export default CompanyDeleteButton
