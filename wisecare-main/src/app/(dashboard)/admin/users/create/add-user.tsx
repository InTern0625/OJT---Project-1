'use client'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'
import { genConfig } from 'react-nice-avatar'

const Avatar = dynamic(() => import('react-nice-avatar'), {
  ssr: false,
})

const AddUserForm = dynamic(
  () => import('@/app/(dashboard)/admin/users/create/add-user-form'),
  { ssr: false },
)

const AddUser = () => {
  const config = genConfig({
    sex: 'man',
    faceColor: '#B0B0B0',
    earSize: 'small',
    hairColor: '#808080',
    hairStyle: 'normal',
    hatColor: '#808080',
    hatStyle: 'none',
    eyeBrowStyle: 'up',
    glassesStyle: 'none',
    noseStyle: 'short',
    mouthStyle: 'smile',
    shirtStyle: 'hoody',
    shirtColor: '#C0C0C0',
    bgColor: '#D3D3D3',
  })
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
      <SheetTrigger asChild={true}>
        <Button className="space-x-2">
          <Plus />
          <span>Add</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="xs:w-screen bg-card w-screen overflow-auto pb-20 sm:max-w-none md:max-w-2xl">
        <SheetHeader className="sr-only">
          <SheetTitle>Add User</SheetTitle>
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
            <AddUserForm onOpenChange={setIsFormOpen} />
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AddUser
