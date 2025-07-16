'use client'

import WiseCareLogo from '@/assets/images/wisecare-logo-2 1.png'
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
import Image from 'next/image'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import Message from '@/components/message'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import setPasswordSchema from '@/app/(auth)/confirm-account/set-password-schema'
import { createBrowserClient } from '@/utils/supabase-client'

const SetPasswordForm = () => {
  const supabase = createBrowserClient()

  // retreive session
  const urlParams = new URLSearchParams(window.location.hash.substring(1)) // Remove the leading #
  const refreshToken = urlParams.get('refresh_token') || ''

  useEffect(() => {
    const refreshSession = async () => {
      await supabase.auth.refreshSession({ refresh_token: refreshToken })
    }
    refreshSession()
  }, [refreshToken, supabase.auth])

  const form = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const handleSetPassword: SubmitHandler<
    z.infer<typeof setPasswordSchema>
  > = async ({ password }) => {
    setIsLoading(true)
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setIsLoading(false)
      return setError(error.message.toString())
    }

    // if success, then redirect to home page
    router.push('/')
  }

  // check if there is an error in the url
  const params = new URLSearchParams(window.location.hash.slice())

  if (params.get('error_code')?.startsWith('4')) {
    // show error message if error is a 4xx error
    return <Message variant="error">{params.get('error_description')}</Message>
  }

  // if (error_code && error_description) {
  //   return <Message variant="error">{error_description}</Message>
  // }

  return (
    <div className="border-border md:bg-card flex flex-col gap-8 pt-8 md:rounded-xl md:border md:p-12 md:shadow-xs">
      <Image src={WiseCareLogo} alt="WiseCare Logo" />
      <div className="flex flex-col gap-0.5">
        <h1 className="text-3xl font-extrabold">Set your password</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Create a password to access your account
        </p>
      </div>
      {error && <Message variant="error">{error}</Message>}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSetPassword)}
          className="space-y-5"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Set password'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default SetPasswordForm
