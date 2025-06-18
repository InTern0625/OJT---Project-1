import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const EmployeesExport = dynamic(() => import('./employees-export'), {
  ssr: false,
})

const AccountsExport = dynamic(() => import('./accounts-export'), {
  ssr: false,
})

interface ExportModalProps {
  exportType: 'employees' | 'accounts' | null
  onClose: () => void
}

const ExportModal = ({ onClose, exportType }: ExportModalProps) => {
  return (
    <Dialog open={!!exportType} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export {exportType}</DialogTitle>
          <DialogDescription>
            {exportType === 'employees'
              ? 'Select an account to export'
              : 'Confirm export request'}
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={<div>Loading...</div>}>
          {exportType === 'employees' && <EmployeesExport onClose={onClose} />}
          {exportType === 'accounts' && <AccountsExport onClose={onClose} />}
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

export default ExportModal
