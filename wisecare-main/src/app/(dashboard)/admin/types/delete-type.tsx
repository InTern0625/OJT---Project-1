import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useUpdateMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { Trash2 } from 'lucide-react'
import { FC, useCallback } from 'react'
import { TypeTabs } from './type-card'
import { createBrowserClient } from '@/utils/supabase-client'

interface Props {
  id: string
  name: string
  page: TypeTabs
}

const DeleteType: FC<Props> = ({ id, name, page }) => {
  const supabase = createBrowserClient()
  const { mutateAsync } = useUpdateMutation(
    // @ts-ignore
    supabase.from(page),
    ['id'],
    'name, id, created_at',
  )

  const handleDelete = useCallback(() => {
    // update is_active to false
    mutateAsync({ id, is_active: false })
  }, [id, mutateAsync])

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={true}>
        <Button
          variant={'ghost'}
          size={'icon'}
          className="text-muted-foreground/50 hover:text-destructive"
        >
          {id && <Trash2 className="h-6 w-6" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-wrap break-all">
            Remove {name} type
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col">
            <span>Are you sure you want to remove this type permanently?</span>
            <span className="font-semibold">This action cannot be undone!</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteType
