'use client'
import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts/(Personnel)/[id]/(company profile)/company-provider'
import importFields from '@/app/(dashboard)/(home)/accounts/(Personnel)/[id]/employees/import/fields'
import parseDate from '@/app/(dashboard)/(home)/accounts/(Personnel)/[id]/employees/import/parseDate'
import parseRow from '@/app/(dashboard)/(home)/accounts/(Personnel)/[id]/employees/import/parseRow'
import themeOverrides from '@/app/(dashboard)/(home)/accounts/(Personnel)/[id]/employees/import/themeOverrides'
import { useToast } from '@/components/ui/use-toast'
import { useInsertMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { ReactSpreadsheetImport } from 'react-spreadsheet-import'
import { Result } from 'react-spreadsheet-import/types/types'
import { createBrowserClient } from '@/utils/supabase-client'

interface ImportEmployeesProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const ImportEmployees = ({ isOpen, setIsOpen }: ImportEmployeesProps) => {
  const supabase = createBrowserClient()
  const { toast } = useToast()
  const { accountId } = useCompanyContext()

  const { mutateAsync } = useInsertMutation(
    // @ts-ignore
    supabase.from('company_employees'),
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          title: 'Employees imported successfully',
          description: 'Employees are imported successfully',
        })
      },
      onError: () => {
        toast({
          title: 'Error importing employees',
          description: 'Please try again',
        })
      },
    },
  )

  const handleSubmit = async (data: Result<any>) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not found')

    const employees = data.validData.map((employee) => ({
      account_id: accountId,
      first_name: employee.first_name,
      last_name: employee.last_name,
      middle_name: employee.middle_name,
      suffix: employee.suffix,
      birth_date: employee.birth_date,
      gender: employee.gender,
      civil_status: employee.civil_status,
      card_number: employee.card_number,
      effective_date: employee.effective_date,
      room_plan: employee.room_plan,
      maximum_benefit_limit: employee.maximum_benefit_limit,
      member_type: employee.member_type,
      dependent_relation: employee.dependent_relation,
      expiration_date: employee.expiration_date,
      created_by: user.id,
    }))

    await mutateAsync(employees)
  }
  return (
    <ReactSpreadsheetImport
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={handleSubmit}
      fields={importFields}
      rowHook={parseRow}
      uploadStepHook={parseDate}
      customTheme={themeOverrides}
    />
  )
}

export default ImportEmployees
