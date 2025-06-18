'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Enums } from '@/types/database.types'
import { useInsertMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

interface AccountsExportProps {
  onClose: () => void
}

const AccountsExport = ({ onClose }: AccountsExportProps) => {
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const { mutateAsync, isPending } = useInsertMutation(
    // @ts-ignore
    supabase.from('pending_export_requests'),
    ['id'],
    null,
    {
      onSuccess: () => {
        onClose()
        toast({
          title: 'Export request sent',
          description:
            'Your export request has been submitted and is waiting for approval.',
        })
      },
      onError: (error) => {
        toast({
          title: 'Something went wrong',
          description: error.message,
          variant: 'destructive',
        })
      },
    },
  )

  return (
    <Button
      className="mt-4"
      disabled={isPending}
      onClick={() =>
        mutateAsync([
          {
            export_type: 'accounts' as Enums<'export_type'>,
          },
        ])
      }
    >
      {isPending ? <Loader2 className="animate-spin" /> : 'Export Accounts'}
    </Button>
  )
}

export default AccountsExport
