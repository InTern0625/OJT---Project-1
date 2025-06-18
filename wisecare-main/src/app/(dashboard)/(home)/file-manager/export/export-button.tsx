'use client'

import ExportModal from '@/app/(dashboard)/(home)/file-manager/export/export-modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

const ExportButton = () => {
  const [exportType, setExportType] = useState<'employees' | 'accounts' | null>(
    null,
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Export</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>New Export</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setExportType('accounts')}
            className="cursor-pointer"
          >
            Accounts
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setExportType('employees')}
            className="cursor-pointer"
          >
            Employees
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExportModal
        exportType={exportType}
        onClose={() => setExportType(null)}
      />
    </>
  )
}

export default ExportButton
