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
import { useToast } from '@/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'

interface Props {
  isLoading: boolean
  userId?: string
  setIsLoading: (isLoading: boolean) => void
  setOpen: (open: boolean) => void
  firstName?: string
  lastName?: string
}

const DeleteUser: FC<Props> = ({
  isLoading,
  userId,
  setIsLoading,
  setOpen,
  firstName,
  lastName,
}) => {
  const { toast } = useToast()

  const queryClient = useQueryClient()
  const handleDelete = async () => {
    if (!userId) {
      return toast({
        title: 'User not found',
        description: 'Please try again',
        variant: 'destructive',
      })
    }

    setIsLoading(true)

    const res = await fetch('/api/users', {
      method: 'DELETE',
      body: JSON.stringify({ user_id: userId }),
    })

    const data = await res.json()

    if (data.error) {
      return toast({
        title: 'User deletion failed',
        description: data.error,
        variant: 'destructive',
      })
    }

    toast({
      title: 'User deleted',
      description: 'User has been deleted',
    })

    setIsLoading(false)
    setOpen(false)
    await queryClient.invalidateQueries()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={true}>
        <Button
          type="button"
          variant="ghost"
          className="text-destructive"
          disabled={isLoading}
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {firstName} {lastName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {firstName} {lastName} permanently?
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

export default DeleteUser
