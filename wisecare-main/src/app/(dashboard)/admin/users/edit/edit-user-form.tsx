import DeleteUser from '@/app/(dashboard)/admin/users/edit/delete-user'
import userSchema from '@/app/(dashboard)/admin/users/user-schema'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  department?: string
  email?: string
}

const EditUserForm: FC<Props> = ({
  onOpenChange,
  userId,
  firstName,
  lastName,
  email,
  department,
}) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      department: department as
        | 'marketing'
        | 'after-sales'
        | 'under-writing'
        | 'finance'
        | 'admin'
        | undefined,
    },
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const handleSubmit: SubmitHandler<z.infer<typeof userSchema>> = async ({
    email,
    firstName,
    lastName,
    department,
  }) => {
    setIsLoading(true)

    const res = await fetch('/api/users', {
      method: 'PUT',
      body: JSON.stringify({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        department: department,
      }),
    })

    let data
    try {
      data = await res.json()
    } catch (err) {
      // server returned no JSON
      data = {}
    }

    if (!res.ok) {
      setError(data?.error || 'Something went wrong')
      setIsLoading(false)
      return
    }

    if (data.error) {
      setError(data.error)
      setIsLoading(false)
      return
    }

    toast({
      title: 'User updated',
      description: 'User has been updated',
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
                  <Input {...field} disabled={true} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={'department'}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={department}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger disabled={isLoading}>
                        <SelectValue placeholder={'Select department'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="after-sales">After Sales</SelectItem>
                      <SelectItem value="under-writing">
                        Under Writing
                      </SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <ConfirmEmail email={email} /> */}
        </div>
        <div className="fixed bottom-0 flex w-full flex-row items-center justify-between gap-2 bg-[#f1f5f9] px-4 py-3 md:max-w-2xl">
          <DeleteUser
            isLoading={isLoading}
            userId={userId}
            setIsLoading={setIsLoading}
            setOpen={onOpenChange}
            firstName={firstName}
            lastName={lastName}
          />
          <div className="flex flex-row items-center justify-center">
            <SheetClose asChild={true}>
              <Button type="button" variant="ghost" disabled={isLoading}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Update User'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default EditUserForm
