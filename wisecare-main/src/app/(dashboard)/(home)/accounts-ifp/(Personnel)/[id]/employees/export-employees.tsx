import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'
import React from 'react'
import { useDownloadsContext } from '@/app/(dashboard)/(home)/file-manager/downloads-provider'
import { createBrowserClient } from '@/utils/supabase-client'

const ExportEmployees = () => {
  const supabase = createBrowserClient()
  const { file } = useDownloadsContext()

  const onExportEmployees = async () => {
    const { data: employeesData, error } = await supabase
      .from('pending_export_requests')
      .select('data')
      .eq('export_type', 'employees')
      .eq('id', file?.id)
      .eq('is_active', true)
      .eq('is_approved', true)

    if (!employeesData) return

    const fileName = `${(file?.account_id as any)?.company_name}-Employees_Sheet.xlsx`

    const worksheet = XLSX.utils.json_to_sheet(
      employeesData.flatMap((item) => item.data),
    )
    const workbook = XLSX.utils.book_new()

    if (worksheet['!ref']) {
      const range = XLSX.utils.decode_range(worksheet['!ref'])
      const numCols = range.e.c - range.s.c + 1
      worksheet['!cols'] = Array(numCols).fill({ wch: 30 })
    } else {
      console.error("worksheet['!ref'] is undefined")
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, fileName)
  }
  return (
    <Button className="w-full" onClick={onExportEmployees}>
      Export File
    </Button>
  )
}

export default ExportEmployees
