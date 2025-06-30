import DeleteRequest from '@/app/(dashboard)/(home)/accounts-corporate-sme/request/delete-request'
import OperationTypeBadge from '@/app/(dashboard)/admin/approval-request/components/operation-badge'
import { Tables } from '@/types/database.types'
import { formatDistanceToNow } from 'date-fns'
import { FC } from 'react'

interface AccountRequestListItemProps {
  pendingAccount: Tables<'pending_accounts'>
}

const AccountRequestListItem: FC<AccountRequestListItemProps> = ({
  pendingAccount,
}) => {
  return (
    <div className="grid grid-cols-2 items-center gap-y-2 px-2 py-6">
      <OperationTypeBadge operationType={pendingAccount.operation_type} />
      <span className="text-muted-foreground ml-auto w-fit text-sm">
        {formatDistanceToNow(new Date(pendingAccount.created_at), {
          addSuffix: true,
        })}
      </span>

      <p className="text-sm font-medium">{pendingAccount.company_name}</p>
      <DeleteRequest pendingAccountId={pendingAccount.id} />
    </div>
  )
}

export default AccountRequestListItem
