import agentSchema from '@/app/(dashboard)/admin/agents/agent-schema'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  setIsOpen: (isOpen: boolean) => void
}

const AddAgentForm = ({ setIsOpen }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const queryClient = useQueryClient()
  const form = useForm<z.infer<typeof agentSchema>>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  })

  const handleSubmit: SubmitHandler<z.infer<typeof agentSchema>> = async ({
    email,
    firstName,
    lastName,
  }) => {
    setIsLoading(true)

    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        department: 'agent',
      }),
    })

    const data = await res.json()

    if (data.error) {
      setError(data.error)
      setIsLoading(false)
      return
    }

    // clean up
    form.reset()
    queryClient.invalidateQueries()
    setIsLoading(false)
    setIsOpen(false)
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
        <div className="fixed bottom-0 flex w-full flex-row items-center justify-end gap-2 bg-[#f1f5f9] px-4 py-3 md:max-w-2xl">
          <div className="flex flex-row items-center justify-center">
            <SheetClose asChild={true}>
              <Button type="button" variant="ghost" disabled={isLoading}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Add User'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default AddAgentForm
