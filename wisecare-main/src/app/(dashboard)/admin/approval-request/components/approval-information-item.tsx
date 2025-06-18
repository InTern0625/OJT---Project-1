import { cn } from '@/utils/tailwind'
import { FC, ReactNode } from 'react'

interface ApprovalInformationItemProps {
  label: string
  value?: string | ReactNode
  oldValue?: string
}

const ApprovalInformationItem: FC<ApprovalInformationItemProps> = ({
  label,
  value,
  oldValue,
}) => {
  return (
    <div className="flex flex-col py-1">
      <div className="text-muted-foreground text-sm font-medium">{label}</div>
      <div
        className={cn(
          oldValue !== value ? '' : 'hidden',
          'text-muted-foreground text-base text-pretty break-words line-through',
        )}
      >
        {oldValue}
      </div>
      <div
        className={cn(
          oldValue !== value ? 'text-green-500' : 'text-black',
          'text-md font-semibold break-words',
        )}
      >
        {value ?? '-'}
      </div>
    </div>
  )
}

export default ApprovalInformationItem
