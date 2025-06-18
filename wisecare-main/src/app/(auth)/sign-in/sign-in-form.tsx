'use client'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import signInSchema from './sign-in-schema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import WisecareLogo from '@/assets/images/wisecare-logo-2 1.png'
import Image from 'next/image'
import Message from '@/components/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { createBrowserClient } from '@/utils/supabase-client'

const SignInForm = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string>('')
  const captcha = useRef<HCaptcha>(null)

  const handleSignIn: SubmitHandler<z.infer<typeof signInSchema>> = async ({
    email,
    password,
  }) => {
    setIsLoading(true)
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken,
      },
    })

    if (error) {
      setIsLoading(false)
      captcha.current?.resetCaptcha()
      return setError(error.message.toString())
    }

    // if success, then redirect to home page
    router.push('/')
    captcha.current?.resetCaptcha()
  }
  return (
    <div className="mx-auto flex max-w-xs min-w-[300px] flex-col gap-8 md:max-w-md">
      <Image src={WisecareLogo} alt={'Wisecare'} width={300} height={300} />
      <h1 className="text-left text-3xl font-extrabold">Sign in</h1>
      {error && <Message variant={'error'}>{error}</Message>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignIn)} className="w-full">
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address*</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
            <HCaptcha
              ref={captcha}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ''}
              onVerify={(token) => {
                setCaptchaToken(token)
              }}
            />
          </div>
          <Button variant={'link'}>
            <Link href={'/forgot-password'}>Forgot password?</Link>
          </Button>
          <Button type="submit" className="mt-8 w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign in'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default SignInForm
