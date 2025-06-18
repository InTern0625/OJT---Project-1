'use client'

import { toast } from '@/components/ui/use-toast'
import { createBrowserClient } from '@/utils/supabase-client'
import { useUpsertMutation } from '@supabase-cache-helpers/postgrest-react-query'

export const useColumnStates = () => {
  const supabase = createBrowserClient()

  const { mutateAsync: upsertColumnVisibility } = useUpsertMutation(
    supabase.from('accounts_column_visibility'),
    ['user_id'],
    'user_id, columns',
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

  const { mutateAsync: upsertColumnSorting } = useUpsertMutation(
    supabase.from('accounts_column_sorting'),
    ['user_id'],
    'user_id, columns',
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

  return { upsertColumnVisibility, upsertColumnSorting }
}
