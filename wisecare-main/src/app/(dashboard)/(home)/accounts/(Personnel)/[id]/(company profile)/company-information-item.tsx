import { ReactNode } from 'react'

const CompanyInformationItem = ({
  label,
  value,
}: {
  label: string
  value?: string | undefined | ReactNode
}) => (
  <div className="flex flex-col py-1">
    <div className="text-muted-foreground text-sm font-medium">{label}</div>
    <div className="text-md font-semibold text-pretty break-words">
      {value || '-'}
    </div>
  </div>
)

export default CompanyInformationItem
