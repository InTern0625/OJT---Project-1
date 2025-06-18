'use server'

import ClientAcquisitionCard from '@/app/(dashboard)/(home)/(dashboard)/client-acquisition/client-acquisition-card'
import RetentionRateCard from '@/app/(dashboard)/(home)/(dashboard)/retention-rate/retention-rate-card'
import TopAgentsCard from '@/app/(dashboard)/(home)/(dashboard)/top-agents/top-agents-card'
import getRole from '@/utils/get-role'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import PageTitle from './page-title'
import TopHmoCard from '@/app/(dashboard)/(home)/(dashboard)/top-hmo/top-hmo-card'

const RenewalCard = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/(dashboard)/upcoming-renewals/renewal-card'
    ),
  {
    loading: () => <div>Loading...</div>,
  },
)
const CommissionCard = dynamic(
  () =>
    import('@/app/(dashboard)/(home)/(dashboard)/commission/commission-card'),
  {
    loading: () => <div>Loading...</div>,
  },
)

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Dashboard',
  }
}

const Dashboard = async () => {
  const role = await getRole()

  return (
    <div className="p-6">
      <PageTitle title="Dashboard" description="Welcome to the dashboard" />
      <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-4">
        <ClientAcquisitionCard />
        <TopAgentsCard />
        <RetentionRateCard />
        <TopHmoCard />
        <RenewalCard />

        {(role === 'finance' || role === 'admin') && (
          <>
            <CommissionCard />
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
