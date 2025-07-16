'use client'
import { SecuritySchema } from '@/app/(dashboard)/settings/security/security-schema'
import Message from '@/components/message'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createBrowserClient } from '@/utils/supabase-client'

const formFields: {
  label: string
  name: keyof SecuritySchema
}[] = [
  {
    label: 'New Password',
    name: 'password',
  },
  {
    label: 'Confirm New Password',
    name: 'confirmPassword',
  },
]

const SecurityForm = () => {
  const { toast } = useToast()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const form = useForm<z.infer<typeof SecuritySchema>>({
    resolver: zodResolver(SecuritySchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const handleSubmit: SubmitHandler<z.infer<typeof SecuritySchema>> = async (
    formData,
  ) => {
    setIsLoading(true)
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.updateUser({
      password: formData.password,
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
      description: 'Your password has been updated',
    })
    // reset form
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {errorMessage && <Message variant={'error'}>{errorMessage}</Message>}
        {formFields.map((item) => (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{item.label}</FormLabel>
                <FormControl>
                  <Input placeholder={item.label} {...field} type="password" />
                </FormControl>
                <FormDescription>
                  {item.name === 'confirmPassword' && 'Minimum 8 characters.'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Separator />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SecurityForm
