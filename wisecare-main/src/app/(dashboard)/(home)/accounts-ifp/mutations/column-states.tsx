'use client'

import { toast } from '@/components/ui/use-toast'
import { createBrowserClient } from '@/utils/supabase-client'
import { useUpsertMutation } from '@supabase-cache-helpers/postgrest-react-query'

export const useColumnStates = () => {
  const supabase = createBrowserClient()

  const { mutateAsync: upsertAccIFPColumnVisibility } = useUpsertMutation(
    supabase.from('accounts_column_visibility') as any,
    ['user_id'],
    'user_id, columns_ifp_accounts',
    {
      onError: () => {
        toast({
          title: 'Error',
          description: 'Error updating column visibility',
          variant: 'destructive',
        })
      },
    },
  )

  const { mutateAsync: upsertAccIFPColumnSorting } = useUpsertMutation(
    supabase.from('accounts_column_sorting') as any,
    ['user_id'],
    'user_id, columns_ifp_accounts, custom__sort_ifp_accounts',
    {
      onError: () => {
        toast({
          title: 'Error',
          description: 'Error updating column sorting',
          variant: 'destructive',
        })
      },
    },
  )
  const { mutateAsync: upsertRenewalIFPColumnVisibility } = useUpsertMutation(
    supabase.from('accounts_column_visibility') as any,
    ['user_id'],
    'user_id, columns_ifp_renewals',
    {
      onError: () => {
        toast({
          title: 'Error',
          description: 'Error updating column visibility',
          variant: 'destructive',
        })
      },
    },
  )

  const { mutateAsync: upsertRenewalIFPColumnSorting } = useUpsertMutation(
    supabase.from('accounts_column_sorting') as any,
    ['user_id'],
    'user_id, columns_ifp_renewals, custom__sort_ifp_renewals',
    {
      onError: () => {
        toast({
          title: 'Error',
          description: 'Error updating column sorting',
          variant: 'destructive',
        })
      },
    },
  )
  return { upsertAccIFPColumnVisibility, upsertAccIFPColumnSorting, upsertRenewalIFPColumnVisibility, upsertRenewalIFPColumnSorting }
}
