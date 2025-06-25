'use client'
import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-provider'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import {
  useQuery,
  useUpdateMutation,
} from '@supabase-cache-helpers/postgrest-react-query'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

const ToggleCompanyActive = ({ accountId }: { accountId: string }) => {
  const supabase = createBrowserClient()
  const { toast } = useToast()
  const [isAccountActive, setIsAccountActive] = useState<boolean>(false)

  const { data: accountData } = useQuery(
    supabase.from('accounts').select('is_account_active').eq('id', accountId),
  )

  useEffect(() => {
    setIsAccountActive(accountData?.[0]?.is_account_active || false)
  }, [accountData])

  const { mutateAsync, isPending } = useUpdateMutation(
    supabase.from('accounts'),
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Company active status updated!',
          description: 'Successfully updated company active status',
        })
      },
      onError: (err: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err.message,
        })
      },
    },
  )

  const handleToggle = debounce(async () => {
    await mutateAsync({ id: accountId, is_account_active: !isAccountActive })
    setIsAccountActive(!isAccountActive)
  }, 300)

  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <div>
          <Switch
            checked={isAccountActive}
            onCheckedChange={handleToggle}
            disabled={isPending}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>Toggle company active</TooltipContent>
    </Tooltip>
  )
}

export default ToggleCompanyActive
