import { Badge } from '@/components/ui/badge'
import { Enums, Tables } from '@/types/database.types'

const OperationBadge = ({
  operationType,
}: {
  operationType?: Enums<'pending_operation'>
}) => {
  switch (operationType) {
    case 'insert':
      return (
        <Badge variant="outline" className="w-fit bg-green-100 text-green-500">
          Add
        </Badge>
      )
    case 'update':
      return (
        <Badge
          variant="outline"
          className="w-fit bg-yellow-100 text-yellow-500"
        >
          Edit
        </Badge>
      )
    case 'delete':
      return (
        <Badge variant="destructive" className="w-fit bg-red-100 text-red-500">
          Delete
        </Badge>
      )
    default:
      return null
  }
}

export default OperationBadge
