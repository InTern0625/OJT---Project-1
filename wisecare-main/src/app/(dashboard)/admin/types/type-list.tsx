import { Skeleton } from '@/components/ui/skeleton'
import getTypes from '@/queries/get-types'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { FC } from 'react'
import DeleteType from './delete-type'
import { TypeTabs } from './type-card'
import EditType from '@/app/(dashboard)/admin/types/edit/edit-type'
import { format } from 'date-fns'
import { createBrowserClient } from '@/utils/supabase-client'

const TypeListItem = ({
  name,
  created_at,
  id,
  isLoading,
  page,
}: {
  name?: string
  created_at?: string
  id?: string
  isLoading?: boolean
  page: TypeTabs
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-left-96 flex flex-row items-center justify-between py-6 duration-500">
      <div className="flex flex-row items-center justify-center gap-4">
        <div>
          {id && <div className="bg-primary h-10 w-10 rounded-full" />}
          {isLoading && <Skeleton className="h-10 w-10 rounded-full" />}
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="text-sm font-medium text-wrap break-all">
            {name}
            {isLoading && <Skeleton className="h-4 w-20" />}
          </span>
          <span className="text-xs text-[#64748b]">
            Created at {created_at ? format(new Date(created_at), 'PPpp') : ''}
            {isLoading && <Skeleton className="mt-1 h-4 w-24" />}
          </span>
        </div>
      </div>
      <div className="flex flex-row">
        {id && <EditType id={id} name={name || ''} page={page} />}
        {id && <DeleteType id={id} name={name || ''} page={page} />}
      </div>
      {isLoading && <Skeleton className="h-10 w-10 rounded-full" />}
    </div>
  )
}

interface Props {
  page: TypeTabs
}

const TypeList: FC<Props> = ({ page }) => {
  const supabase = createBrowserClient()
  const { data, isPending } = useQuery(getTypes(supabase, page))
  console.log(data)
  console.log(page)
  return (
    <div className="divide-border border-border mt-9 flex w-full flex-col divide-y border-y px-6 lg:px-12">
      {isPending &&
        [...Array(5)].map((_, index) => (
          <TypeListItem page={page} isLoading={true} key={index} />
        ))}
      {data?.map((type) => (
        <TypeListItem
          key={type.id}
          name={type.name}
          created_at={type.created_at || ''}
          id={type.id}
          page={page}
        />
      ))}
    </div>
  )
}

export default TypeList
