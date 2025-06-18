import { Tables } from '@/types/database.types'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { createBrowserClient } from '@/utils/supabase-client'

type UserProfileWithDepartment = Tables<'user_profiles'> & {
  departments: Tables<'departments'>
}

const useUser = (): UseQueryResult<UserProfileWithDepartment> => {
  const supabase = createBrowserClient()

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id, first_name, last_name, email, departments (id, name)')
        .eq('user_id', user.user?.id)
        .single()

      if (error) throw new Error(error.message)
      return data
    },
  })
}

export default useUser
