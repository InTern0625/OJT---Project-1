'use client'
import ForgotPasswordSchema from '@/app/(auth)/forgot-password/forgot-password-schema'
import WiseCareLogo from '@/assets/images/wisecare-logo-2 1.png'
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
import { toast } from '@/components/ui/use-toast'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createBrowserClient } from '@/utils/supabase-client'

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const supabase = createBrowserClient()

  const [captchaToken, setCaptchaToken] = useState<string>('')
  const captcha = useRef<HCaptcha>(null)

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleForgotPassword: SubmitHandler<
    z.infer<typeof ForgotPasswordSchema>
  > = async ({ email }) => {
    setIsLoading(true)

    const emailRedirectTo = `${process.env.NEXT_PUBLIC_DOMAIN}/confirm-account`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: emailRedirectTo,
      captchaToken,
    })

    if (error) {
      setIsLoading(false)
      captcha.current?.resetCaptcha()
      return setError(error.message)
    }

    // if success, then redirect to home page
    toast({
      title: 'Email sent',
      variant: 'default',
      description: 'Please check your email for a link to reset your password',
    })

    setIsLoading(false)
    captcha.current?.resetCaptcha()
  }

  return (
    <div className="border-border md:bg-card flex flex-col gap-8 pt-8 md:rounded-xl md:border md:p-12 md:shadow-xs">
      <Image src={WiseCareLogo} alt="WiseCare Logo" />
      <div className="flex flex-col gap-0.5">
        <h1 className="text-3xl font-extrabold">Forgot your password?</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Enter your email address and we will send you a link to reset your
          password
        </p>
      </div>
      {error && <Message variant="error">{error}</Message>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleForgotPassword)}>
          <FormField
            control={form.control}
            name="email"
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
          <div className="mt-4">
            <HCaptcha
              ref={captcha}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ''}
              onVerify={(token) => {
                setCaptchaToken(token)
              }}
            />
          </div>
          <Button className="mt-8 w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Reset password'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ForgotPasswordForm
