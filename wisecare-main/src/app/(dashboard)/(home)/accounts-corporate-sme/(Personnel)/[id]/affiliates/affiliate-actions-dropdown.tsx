import DeleteDuplicateAffiliates from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/delete-duplicate-affiliates'

import EllipsisVertical from '@/assets/icons/ellipsis-vertical'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserServer } from '@/providers/UserProvider'
import { FileDown, Plus, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const AffiliatesFormModal = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-information/affiliate-form-modal'
    ),
  { ssr: false },
)
const DeleteAllAffiliates = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-information/delete-all-affiliates'
    ),
  { ssr: false },
)

const AffiliatesActionsDropdown = ({ companyId }: { companyId: string }) => {
  const { user } = useUserServer()

  const isAfterSalesAndUnderWriting = [
    'after-sales',
    'under-writing',
    'admin',
  ].includes(user?.user_metadata?.department)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {isAfterSalesAndUnderWriting && (
            <DropdownMenuItem asChild={true}>
              <AffiliatesFormModal
                button={
                  <div className="focus:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50">
                    <Plus className="h-4 w-4" />
                    <span>Add Affiliates</span>
                  </div>
                }
              />
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        {isAfterSalesAndUnderWriting && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DeleteAllAffiliates
                button={
                  <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete All Affiliates</span>
                  </DropdownMenuItem>
                }
              />
              <DeleteDuplicateAffiliates companyId={companyId} />
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AffiliatesActionsDropdown
