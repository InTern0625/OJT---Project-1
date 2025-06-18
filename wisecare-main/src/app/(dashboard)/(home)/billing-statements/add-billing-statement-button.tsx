'use client'

import BillingStatementModal from '@/components/billing-statement/billing-statement-modal'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

const AddBillingStatementButton = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <BillingStatementModal
      open={isAddModalOpen}
      setOpen={setIsAddModalOpen}
      button={
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Billing Statement
        </Button>
      }
    />
  )
}

export default AddBillingStatementButton
