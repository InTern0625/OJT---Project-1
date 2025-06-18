'use server'
import SettingsPageTitle from '@/app/(dashboard)/settings/(layout)/settings-page-title'
import AccountForm from '@/app/(dashboard)/settings/account/account-form'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

const AccountSettings = async () => {
  const supabase = createServerClient(await cookies())
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <SettingsPageTitle title="Account" />
      <div className="mt-9 flex w-full max-w-3xl flex-col px-5 lg:px-12">
        <AccountForm user={user?.user_metadata} />
      </div>
    </>
  )
}

export default AccountSettings
