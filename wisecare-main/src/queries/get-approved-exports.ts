import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getExports = (
  supabase: TypedSupabaseClient,
  sort: 'asc' | 'desc' = 'desc',
) => {
  return supabase
    .from('pending_export_requests')
    .select(
      `
      id,
      export_type,
      created_at,
      created_by(first_name, last_name, user_id),
      account_id(company_name),
      approved_by(first_name, last_name, user_id),
      approved_at,
      is_approved
      `,
      {
        count: 'exact',
      },
    )
    .eq('is_active', true)
    .order('created_at', { ascending: sort === 'asc' })
    .throwOnError()
}

export default getExports
