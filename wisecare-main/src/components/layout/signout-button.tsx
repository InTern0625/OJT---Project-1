'use client'
import { LogOut } from 'lucide-react'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

const SignOutButton = () => {
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const clickHandler = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Error signing out user',
      })
      setIsLoading(false)
    }

    router.push('/sign-in')
  }

  return (
    <DropdownMenuItem
      disabled={isLoading}
      onClick={() => clickHandler()}
      className="flex cursor-pointer flex-row items-center justify-start gap-4"
    >
      <LogOut className="h-4 w-4" />
      <span className="text-sm">Sign out</span>
    </DropdownMenuItem>
  )
}

export default SignOutButton
