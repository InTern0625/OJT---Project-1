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
import { useEffect, useState, useCallback } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'
import getTypes from '@/queries/get-types'
import accountsSchema from '@/app/(dashboard)/(home)/accounts-corporate-sme/accounts-schema'
import { useFormContext, useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { useCompanyEditContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-edit-provider'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Form } from '@/components/ui/form'

const SelectCompanyActive = ({ accountId, role }: { accountId: string, role?: string | null }) => {
  const supabase = createBrowserClient()
  const { toast } = useToast()
  const { editMode, setEditMode, statusId, setStatusId } = useCompanyEditContext()

  const form = useForm<z.infer<typeof accountsSchema>>({
    defaultValues: { status_id: undefined },
  })

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

  const { mutateAsync: updateAccountStatus, isPending } = useUpdateMutation(
    supabase.from('accounts') as any,
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Account status updated!',
          description: 'Successfully updated account status',
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
  const handleStatusChange = useCallback(
    async (newStatusId: string) => {
      setStatusTypes(newStatusId)
      if (role === 'admin') {
        if (newStatusId !== ""){
          await updateAccountStatus({ id: accountId, status_id: newStatusId ?? undefined })
        }
      } else {
        setStatusId(newStatusId)
      }
    },
    [role, accountId, updateAccountStatus, setStatusId] 
  )


  return (
    <>
      {(role === 'admin' || editMode) && (
        <Form {...form}>
        <form>
        <FormField
          control={form.control}
          name="status_id"
          render={({ field }) => (
            <FormItem>
              <div className="w-48">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select
                        value={getStatusTypes}            
                        onValueChange={handleStatusChange}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-white/60 rounded-full focus:outline-none focus:ring-0 shadow-none">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {statusTypes?.map((type: { id: string; name: string }) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>

                    <TooltipContent>Select account status</TooltipContent>
                  </Tooltip>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        </form>
        </Form>
      )}
    </>
  )
}

export default SelectCompanyActive
