'use client'

import RenewalItem from '@/app/(dashboard)/(home)/(dashboard)/upcoming-renewals/renewal-item'
import { Tables } from '@/types/database.types'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { addMonths } from 'date-fns'
import { createBrowserClient } from '@/utils/supabase-client'

const RenewalList = () => {
  const supabase = createBrowserClient()
  const { data } = useQuery(
    supabase
      .from('accounts')
      .select('company_name, expiration_date, initial_contract_value, id')
      .eq('is_account_active', true)
      .eq('is_active', true)
      .lte(
        'expiration_date',
        addMonths(new Date(), 3).toLocaleString('en-US', {
          timeZone: 'Asia/Manila',
        }),
      )
      .order('expiration_date', { ascending: true }),
  )
  return (
    <div className="max-h-[370px] space-y-4 overflow-y-auto">
      {data?.map((item) => (
        <RenewalItem key={item.id} data={item as Tables<'accounts'>} />
      ))}
    </div>
  )
}

export default RenewalList
