'use server'
import ForgotPasswordForm from '@/app/(auth)/forgot-password/forgot-password-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Forgot Password',
  }
}

const ForgotPasswordPage = async () => {
  return (
    <div className="flex h-screen w-full flex-col items-center py-8 md:justify-center md:px-24">
      <ForgotPasswordForm />
      <Button variant={'link'}>
        <Link href={'/sign-in'}>Back to sign in</Link>
      </Button>
    </div>
  )
}

export default ForgotPasswordPage
