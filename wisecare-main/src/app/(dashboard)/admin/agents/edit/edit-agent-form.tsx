import agentSchema from '@/app/(dashboard)/admin/agents/agent-schema'
import DeleteAgent from '@/app/(dashboard)/admin/agents/create/delete-agent'
import Message from '@/components/message'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SheetClose } from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  onOpenChange: (open: boolean) => void
  userId?: string
  firstName?: string
  lastName?: string
  email?: string
}

const EditAgentForm: FC<Props> = ({
  onOpenChange,
  userId,
  firstName,
  lastName,
  email,
}) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof agentSchema>>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
    },
  })

  const handleSubmit: SubmitHandler<z.infer<typeof agentSchema>> = async ({
    firstName,
    lastName,
    email,
  }) => {
    setIsLoading(true)

    const res = await fetch('/api/users', {
      method: 'PUT',
      body: JSON.stringify({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        department: 'agent',
      }),
    })

    const data = await res.json()

    if (data.error) {
      setError(data.error)
      setIsLoading(false)
      return
    }

    toast({
      title: 'Agent updated',
      description: 'Agent has been updated',
    })

    // clear cache
    await queryClient.invalidateQueries()

    // clear form
    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-8 px-6 pb-10">
          {error && <Message variant={'error'}>{error}</Message>}
          <FormField
            name={'firstName'}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={'lastName'}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={'email'}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="fixed bottom-0 flex w-full flex-row items-center justify-between gap-2 bg-[#f1f5f9] px-4 py-3 md:max-w-2xl">
          <DeleteAgent
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setOpen={onOpenChange}
            firstName={firstName}
            lastName={lastName}
            agentId={userId}
          />
          <div className="flex flex-row items-center justify-center">
            <SheetClose asChild={true}>
              <Button type="button" variant="ghost" disabled={isLoading}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Update Agent'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default EditAgentForm
