import { Badge } from '@/components/ui/badge'

const ActiveBadge = ({ statusType }: { statusType: string | null | undefined }) => {
  switch (statusType?.toLowerCase()) {
    case 'active':
      return (
        <Badge
          variant={'outline'}
          className="w-fit bg-green-100 text-green-500"
        >
          Active
        </Badge>
      )
    case 'inactive':
      return (
        <Badge variant={'outline'} className="w-fit bg-red-100 text-red-500">
          Inactive
        </Badge>
      )
    default:
      return (
        <Badge variant={'outline'} className="w-fit bg-purple-100 text-purple-500">
          {statusType}
        </Badge>
      )
  }
}

export default ActiveBadge
