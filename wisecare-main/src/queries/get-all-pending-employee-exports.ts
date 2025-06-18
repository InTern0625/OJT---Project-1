import { TypedSupabaseClient } from '@/types/typedSupabaseClient'
import { Enums } from '@/types/database.types'

const getAllPendingEmployeeExports = (
  supabase: TypedSupabaseClient,
  exportType: Enums<'export_type'>,
  sort: 'asc' | 'desc' = 'desc',
) => {
  return supabase
    .from('pending_export_requests')
    .select(
      `id, export_type, created_at, created_by(first_name, last_name, user_id), account_id(company_name)`,
      {
        count: 'exact',
      },
    )
    .eq('is_approved', false)
    .eq('is_active', true)
    .eq('export_type', exportType)
    .order('created_at', { ascending: sort === 'asc' })
    .throwOnError()
}

export default getAllPendingEmployeeExports
