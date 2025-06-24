'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'

const AddAccountForm = dynamic(
  () => import('@/app/(dashboard)/(home)/accounts-corporate-sme/add-account-form'),
  { ssr: false },
)

const AddAccountButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="space-x-2">
          <Plus />
          <span>Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
          <DialogDescription>Add a new account to the system</DialogDescription>
        </DialogHeader>
        {isOpen && (
          <Suspense fallback={<div>Loading...</div>}>
            <AddAccountForm setIsOpen={setIsOpen} />
          </Suspense>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddAccountButton
