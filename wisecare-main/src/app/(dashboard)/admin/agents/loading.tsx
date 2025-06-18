import { PageHeader, PageTitle } from '@/components/page-header'
import { Skeleton } from '@/components/ui/skeleton'

const AgentsLoading = () => {
  return (
    <div className="flex flex-col">
      <PageHeader>
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:justify-start">
          <div>
            <PageTitle>Agents</PageTitle>
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </PageHeader>
    </div>
  )
}

export default AgentsLoading
