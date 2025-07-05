import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'
import React from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

const ExportAccounts = ({ id }: { id: string }) => {
  const supabase = createBrowserClient()
  console.log("a")

  const exportAccounts = async () => {
    const { data: accountsData } = await supabase
      .from('pending_export_requests')
      .select('data')
      .eq('export_type', 'accounts')
      .eq('id', id)
      .eq('is_active', true)
      .eq('is_approved', true)

    if (!accountsData) return

    const fileName = `${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}-Accounts_Sheet.xlsx`

    const worksheet = XLSX.utils.json_to_sheet(
      accountsData.flatMap((item) => item.data),
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
    <Button className="w-full" onClick={exportAccounts}>
      Export File
    </Button>
  )
}

export default ExportAccounts
