import { Badge } from '@/components/ui/badge'

const ActiveBadge = ({ isActive }: { isActive: boolean }) => {
  switch (isActive) {
    case true:
      return (
        <Badge
          variant={'outline'}
          className="w-fit bg-green-100 text-green-500"
        >
          Active
        </Badge>
      )
    case false:
      return (
        <Badge variant={'outline'} className="w-fit bg-red-100 text-red-500">
          Inactive
        </Badge>
      )
  }
}

export default ActiveBadge
