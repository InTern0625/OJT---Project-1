'use client'

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
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  onOpenChange: (open: boolean) => void
}

const AddUserForm = ({ onOpenChange }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      department: undefined,
      // password: '',
    },
  })
  const queryClient = useQueryClient()

  const handleSubmit: SubmitHandler<z.infer<typeof userSchema>> = async ({
    email,
    firstName,
    lastName,
    department,
  }) => {
    setIsLoading(true)

    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        department,
      }),
    })

    const data = await res.json()

    if (data.error) {
      setError(data.error)
      setIsLoading(false)
      return
    }

    // clear cache
    await queryClient.invalidateQueries()

    // clear form
    form.reset()
    onOpenChange(false)
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={'flex flex-col'}
      >
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
          <FormField
            name={'department'}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger disabled={isLoading}>
                      <SelectValue placeholder={'Select department'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="marketing">
                      Sales and Marketing
                    </SelectItem>
                    <SelectItem value="after-sales">
                      Renewal and After Sales
                    </SelectItem>
                    <SelectItem value="under-writing">Underwriting</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
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

export default AddUserForm
