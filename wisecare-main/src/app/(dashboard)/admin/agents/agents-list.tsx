'use client'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import getAgents from '@/queries/get-agents'
import { createBrowserClient } from '@/utils/supabase-client'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'
import Avatar, { genConfig } from 'react-nice-avatar'

const EditAgentForm = dynamic(() => import('./edit/edit-agent-form'), {
  ssr: false,
})

const AgentsListItem = ({
  userId,
  firstName,
  lastName,
  createdAt,
  email,
  isLoading,
}: {
  userId: string
  firstName: string
  lastName: string
  createdAt: string
  email: string
  isLoading?: boolean
}) => {
  const config = genConfig(userId || '')
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
      <SheetTrigger asChild={true}>
        <div className="bg-card hover:bg-muted flex cursor-pointer flex-row items-center gap-4 px-6 py-4">
          <div>
            {isLoading ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
              <Avatar className="h-10 w-10" {...config} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-card-foreground text-sm font-medium text-pretty break-all">
              {isLoading ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                `${firstName} ${lastName}`
              )}
            </span>
          </div>
          <span className="text-muted-foreground text-sm whitespace-pre capitalize">
            {isLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <>
                <span>Joined</span> {format(new Date(createdAt), 'PPP')}
              </>
            )}
          </span>
        </div>
      </SheetTrigger>
      <SheetContent className="xs:w-screen bg-card w-screen sm:max-w-none md:max-w-2xl">
        <SheetHeader className="sr-only">
          <SheetTitle>Edit Agent</SheetTitle>
        </SheetHeader>
        <div className="flex h-40 flex-col items-end bg-[#f1f5f9] px-7 py-5">
          <SheetClose asChild={true}>
            <Button variant={'ghost'} size={'icon'}>
              <X />
            </Button>
          </SheetClose>
        </div>
        <div>
          <Suspense
            fallback={<Skeleton className="mx-6 h-32 w-32 rounded-full" />}
          >
            <Avatar
              className="border-card mx-6 h-32 w-32 -translate-y-16 rounded-full border-4"
              {...config}
            />
            <EditAgentForm
              userId={userId}
              firstName={firstName}
              lastName={lastName}
              email={email}
              onOpenChange={setIsEditOpen}
            />
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const AgentsList = () => {
  const supabase = createBrowserClient()

  const { data, isPending } = useQuery(getAgents(supabase))

  return (
    <div className="divide-border border-border flex w-full flex-col divide-y border-y">
      {isPending &&
        [...Array(5)].map((_, i) => (
          <AgentsListItem
            isLoading
            key={i}
            userId={''}
            firstName={''}
            lastName={''}
            createdAt={''}
            email={''}
          />
        ))}
      {data &&
        data.map((agent) => (
          <AgentsListItem
            key={agent.user_id}
            userId={agent.user_id}
            firstName={agent.first_name || ''}
            lastName={agent.last_name || ''}
            createdAt={agent.created_at || ''}
            email={agent.email || ''}
          />
        ))}
    </div>
  )
}

export default AgentsList
