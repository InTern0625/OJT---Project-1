import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { FC, useState } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

interface ConfirmEmailProps {
  email?: string
}

const ConfirmEmail: FC<ConfirmEmailProps> = ({ email }) => {
  const supabase = createBrowserClient()

  const emailRedirectTo = `${process.env.NEXT_PUBLIC_DOMAIN}/confirm-account`
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleResendEmail = async () => {
    setIsLoading(true)

    if (!email) {
      toast({
        title: 'Error',
        description: 'Email is required',
        variant: 'destructive',
      })
      return
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo,
      },
    })

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend confirmation email',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    toast({
      title: 'Success',
      description: 'Confirmation email sent',
    })
  }

  return (
    <div>
      <Button variant={'link'} onClick={handleResendEmail} disabled={isLoading}>
        Resend Confirmation Email
      </Button>
    </div>
  )
}

export default ConfirmEmail
