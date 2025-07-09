import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

export const isPendAccExp = async (supabase: TypedSupabaseClient) => {
  const { count, error } = await supabase
    .from('pending_export_requests')
    .select('id', { count: 'exact', head: true })
    .eq('export_type', 'accounts')
    .eq('is_approved',false)
    .eq('is_active', true)

  if (error) {
    console.error('Exception Occurred:', error)
    return 0
  }

  return count ?? 0
}

export const isPendAcc = async (supabase: TypedSupabaseClient) => {
  const { count, error } = await supabase
    .from('pending_accounts')
    .select('id', { count: 'exact', head: true })
    .eq('is_approved',false)
    .eq('is_active', true)

  if (error) {
    console.error('Exception Occurred:', error)
    return 0
  }
  return count ?? 0
}

export const isPendEmpExp = async (supabase: TypedSupabaseClient) => {
  const { count, error } = await supabase
    .from('pending_export_requests')
    .select('id', { count: 'exact', head: true })
    .eq('export_type', 'employees')
    .eq('is_approved',false)
    .eq('is_active', true)

  if (error) {
    console.error('Exception Occurred:', error)
    return 0
  }

  return count ?? 0
}

export const getTotal = async (supabase: TypedSupabaseClient) => {
  const accExp = await isPendAccExp(supabase)
  const acc = await isPendAcc(supabase)
  const empExp = await isPendEmpExp(supabase)

  return accExp + acc + empExp
}
