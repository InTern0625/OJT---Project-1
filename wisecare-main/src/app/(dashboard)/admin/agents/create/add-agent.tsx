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
import { Plus, X } from 'lucide-react'
import config from 'next/config'
import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'

const Avatar = dynamic(() => import('react-nice-avatar'), {
  ssr: false,
})

const AddAgentForm = dynamic(() => import('./add-agent-form'), {
  ssr: false,
})

const AddAgent = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild={true}>
        <Button className="space-x-2">
          <Plus />
          <span>Add</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="xs:w-screen bg-card w-screen sm:max-w-none md:max-w-2xl">
        <SheetHeader className="sr-only">
          <SheetTitle>Add Agent</SheetTitle>
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
            <AddAgentForm setIsOpen={setIsOpen} />
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AddAgent
