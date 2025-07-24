import { TypedSupabaseClient } from '@/types/typedSupabaseClient'
import { emitKeypressEvents } from 'readline'
interface AccountFilters {
  accountType?: string
}

const getAccountsCount = (supabase: TypedSupabaseClient, filters: AccountFilters = {}) => {
  let query = supabase
    .from('accounts')
    .select(
      `
  id,
  status_type: status_id(name, id)
  `,
      {
        count: 'exact',
        head: false,
      },
    )
    .eq('is_active', true)
  
  //Account type filter
  if (filters.accountType === "Business") {
    query = query.or(
      'and(account_type_id.not.is.null,program_types_id.is.null),and(account_type_id.is.null,program_types_id.is.null)'
    );
  } else if (filters.accountType === "IFP") {
    query = query.or(
      'and(account_type_id.is.null,program_types_id.not.is.null),and(account_type_id.is.null,program_types_id.is.null)'
    );
  }

  return query
}
export default getAccountsCount
