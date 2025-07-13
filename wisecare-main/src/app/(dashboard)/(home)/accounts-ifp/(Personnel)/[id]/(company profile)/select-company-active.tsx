'use client'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
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
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'
import getTypes from '@/queries/get-types'

const SelectCompanyActive = ({ accountId }: { accountId: string }) => {
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const { data: statusTypes } = useQuery(getTypes(supabase, 'status_types'))
  const [getStatusTypes, setStatusTypes] = useState<string>('')

  const { data: accountData } = useQuery(
    supabase.from('accounts').select('status_id').eq('id', accountId)
  )

  useEffect(() => {
    if (accountData?.[0]?.status_id) {
      setStatusTypes(accountData[0].status_id)
    } else if (statusTypes && statusTypes.length > 0) {
      setStatusTypes(statusTypes[0].id)
    }
  }, [accountData, statusTypes])

  const { mutateAsync, isPending } = useUpdateMutation(
    supabase.from('accounts') as any,
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Account status updated!',
          description: 'Successfully updated account  status',
        })
      },
      onError: (err: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err.message,
        })
      },
    }
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-48">
          <Select
            value={getStatusTypes}
            onValueChange={async (newStatusId) => {
              setStatusTypes(newStatusId)
              await mutateAsync({ id: accountId, status_id: newStatusId })
            }}
            disabled={isPending}
          >
            <SelectTrigger className="w-full bg-white/60 rounded-full focus:outline-none focus:ring-0 shadow-none">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusTypes?.map((type: { id: string; name: string }) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TooltipTrigger>
      <TooltipContent>Select account status</TooltipContent>
    </Tooltip>
  )
}

export default SelectCompanyActive
