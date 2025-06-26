import DeleteDuplicateEmployees from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/employees/delete-duplicate-employees'
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
import { Plus, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const EmployeeFormModal = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/employees/employee-information/employee-form-modal'
    ),
  { ssr: false },
)

const DeleteAllEmployees = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/employees/employee-information/delete-all-employees'
    ),
  { ssr: false },
)

const EmployeeActionsDropdown = ({ companyId }: { companyId: string }) => {
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
              <EmployeeFormModal
                button={
                  <div className="focus:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50">
                    <Plus className="h-4 w-4" />
                    <span>Add Members</span>
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
              <DeleteAllEmployees
                button={
                  <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete All Members</span>
                  </DropdownMenuItem>
                }
              />
              <DeleteDuplicateEmployees companyId={companyId} />
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default EmployeeActionsDropdown
