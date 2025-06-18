import SettingsPageTitle from '@/app/(dashboard)/settings/(layout)/settings-page-title'
import SecurityForm from '@/app/(dashboard)/settings/security/security-form'

const SecuritySettings = () => {
  return (
    <>
      <SettingsPageTitle title="Security" />
      <div className="mt-9 flex w-full max-w-3xl flex-col px-5 lg:px-12">
        <SecurityForm />
      </div>
    </>
  )
}

export default SecuritySettings
