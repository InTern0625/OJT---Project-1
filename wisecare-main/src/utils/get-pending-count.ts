import { TypedSupabaseClient } from '@/types/typedSupabaseClient'
import { Enums } from '@/types/database.types'
import { createBrowserClient } from '@/utils/supabase-client'

const supabase = createBrowserClient()

export const isPendAccExp = async () => {
  const { count, error } = await supabase
    .from('pending_export_requests')
    .select('id', {count: 'exact', head: true})
    .eq('is_approved', false)
    .eq('is_active', true) 
    .eq('export_type', 'accounts')

  if (error) {
    console.error('Exception Occured:', error)
    return 0
  }

  return count ?? 0
}

export const isPendAcc = async () => {
  const { count, error } = await supabase
    .from('pending_accounts')
    .select('id', {count: 'exact', head: true})
    .eq('is_approved', false)
    .eq('is_active', true) 

  if (error) {
    console.error('Exception Occured:', error)
    return 0
  }

  return count ?? 0
}

export const isPendEmpExp = async ()=> {
  const { count, error } = await supabase
    .from('pending_export_requests')
    .select('id', {count: 'exact', head: true})
    .eq('is_approved', false)
    .eq('is_active', true)
    .eq('export_type', 'employees')

  if (error) {
    console.error('Exception Occured:', error)
    return 0
  }

  return count ?? 0
}

export const getTotal = async() => {
  const accExp = await isPendAccExp()
  const acc = await isPendAcc()
  const empExp = await isPendEmpExp()

  const total = accExp + acc + empExp
  return total
}