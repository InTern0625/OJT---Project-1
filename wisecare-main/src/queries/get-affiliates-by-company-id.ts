import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getAffiliatesByCompanyId = (
  supabase: TypedSupabaseClient,
  companyId: string,
) => {
  return supabase
    .from('company_affiliates')
    .select(
      `
      id,
      parent_company_id,
      affiliate_name,
      affiliate_address,
      is_active,
      created_at
    `,
    )
    .eq('parent_company_id', companyId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
}

export default getAffiliatesByCompanyId
