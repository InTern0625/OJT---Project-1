'use client'

import UserSchema from '@/app/(dashboard)/settings/account/user-schema'
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
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserMetadata } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createBrowserClient } from '@/utils/supabase-client'

const items: {
  label: string
  name: keyof z.infer<typeof UserSchema>
}[] = [
  {
    label: 'First Name',
    name: 'firstName',
  },
  {
    label: 'Last Name',
    name: 'lastName',
  },
]

interface Props {
  user?: UserMetadata
}

const AccountForm: FC<Props> = ({ user }) => {
  const { toast } = useToast()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      firstName: user?.first_name ?? '',
      lastName: user?.last_name ?? '',
    },
  })

  const handleSubmit: SubmitHandler<z.infer<typeof UserSchema>> = async (
    formData,
  ) => {
    setIsLoading(true)
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: formData.firstName,
        last_name: formData.lastName,
      },
    })

    if (error) {
      setIsLoading(false)
      setErrorMessage(error.message)
      return toast({
        title: 'Error',
        description: error.message,
      })
    }

    setIsLoading(false)
    toast({
      title: 'Success',
      description: 'Your account has been updated',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {errorMessage && <Message variant={'error'}>{errorMessage}</Message>}
        {items.map((item) => (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{item.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={item.label}
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Separator />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AccountForm
