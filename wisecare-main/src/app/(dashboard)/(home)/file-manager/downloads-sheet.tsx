'use client'
import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { File, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDownloadsContext } from '@/app/(dashboard)/(home)/file-manager/downloads-provider'
import { formatDate } from 'date-fns'
import DownloadsDeleteButton from '@/app/(dashboard)/(home)/file-manager/downloads-delete-button'
import dynamic from 'next/dynamic'

const ExportAccounts = dynamic(
  () =>
    import('@/app/(dashboard)/(home)/accounts/export-requests/export-accounts'),
  { ssr: false },
)
const ExportEmployees = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts/(Personnel)/[id]/employees/export-employees'
    ),
  { ssr: false },
)

const DownloadsSheet = () => {
  const { file, setFile } = useDownloadsContext()
  return (
    <Sheet open={!!file} onOpenChange={() => setFile(null)}>
      <SheetContent className="xs:w-screen bg-card flex w-screen flex-col justify-between overflow-auto sm:max-w-none md:max-w-md">
        <div className="flex flex-col items-end px-7 py-5">
          <SheetClose asChild={true}>
            <Button variant={'ghost'} size={'icon'}>
              <X />
            </Button>
          </SheetClose>
        </div>
        <div className="space-y-8 p-12">
          <SheetHeader className="items-center justify-center">
            <SheetTitle className="sr-only">
              {file?.export_type === 'accounts'
                ? 'Accounts File'
                : 'Employees File'}
            </SheetTitle>
            <div className="bg-background flex h-[235px] w-[352px] items-center justify-center rounded-lg border p-8">
              <File className="h-24 w-24 text-[#94a3b8]" />
            </div>
          </SheetHeader>
          <div className="space-y-2">
            <span className="text-xl font-medium text-[#1e293b]">
              {file?.export_type === 'accounts'
                ? 'Accounts File'
                : 'Employees File'}
            </span>
            <div className="h-5 w-9 rounded-md bg-green-600 py-0.5 text-center text-xs font-semibold text-white">
              {' '}
              XLS{' '}
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-lg font-medium">Information</span>
            <Separator />
            {file?.export_type === 'employees' && (
              <>
                <div className="flex flex-row justify-between pt-1 pb-1">
                  <span className="text-sm font-medium text-[#64748b]">
                    Company name
                  </span>
                  <span className="text-sm text-[#1e293b]">
                    {' '}
                    {(file?.account_id as any)?.company_name}{' '}
                  </span>
                </div>
                <Separator />
              </>
            )}
            <div className="flex flex-row justify-between pt-1 pb-1">
              <span className="text-sm font-medium text-[#64748b]">
                Approved at
              </span>
              <span className="text-sm text-[#1e293b]">
                {file?.approved_at ? formatDate(file.approved_at, 'PPpp') : '-'}
              </span>
            </div>
            <Separator />
            <div className="flex flex-row justify-between pt-1 pb-1">
              <span className="text-sm font-medium text-[#64748b]">
                Approved by
              </span>
              <span className="text-sm text-[#1e293b]">
                {(file?.approved_by as any)?.first_name}{' '}
                {(file?.approved_by as any)?.last_name}
              </span>
            </div>
            <Separator />
          </div>
        </div>
        <SheetFooter className="mt-auto flex flex-row items-center justify-between gap-4 p-12">
          {file?.export_type === 'accounts' ? (
            <>
              <ExportAccounts id={file.id} />
            </>
          ) : (
            <>
              <ExportEmployees />
            </>
          )}
          <DownloadsDeleteButton />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default DownloadsSheet
