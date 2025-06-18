import { TypedSupabaseClient } from '@/types/typedSupabaseClient'
import { format, toZonedTime } from 'date-fns-tz'

const getEmployeeCount = (supabase: TypedSupabaseClient, id: string) => {
  const dateInManila = toZonedTime(new Date(), 'Asia/Manila')
  const formattedDate = format(dateInManila, 'yyyy-MM-dd')

  return supabase
    .from('company_employees')
    .select('id', { count: 'exact', head: true })
    .eq('account_id', id)
    .eq('is_active', true)
    .or(`cancelation_date.is.null,cancelation_date.gte.${formattedDate}`)
    .throwOnError()
}

export default getEmployeeCount
