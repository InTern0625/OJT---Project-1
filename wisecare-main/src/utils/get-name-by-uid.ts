import { useEffect, useState } from 'react'
import getUsers from '@/queries/get-users'
import { createBrowserClient } from '@/utils/supabase-client'

export function getName(user_id: string | null){
  const supabase = createBrowserClient()
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: usersData, error } = await getUsers(supabase)
      if (!error && usersData) {
        setUsers(usersData)
      }
    }

    fetchUsers()
  }, [supabase])

  const user = users.find((u) => u.user_id === user_id)
  return user ? `${user.first_name} ${user.last_name}` : user_id
}