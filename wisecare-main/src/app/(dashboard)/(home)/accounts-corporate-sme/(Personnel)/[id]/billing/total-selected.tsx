import { formatCurrency } from '@/app/(dashboard)/(home)/accounts-corporate-sme/columns/accounts-columns'
import { Card, CardContent } from '@/components/ui/card'
import { Table } from '@tanstack/react-table'

const TotalSelected = ({ table }: { table: Table<any> }) => {
  const totals = table.getGroupedSelectedRowModel().rows.reduce(
    (acc, row) => {
      return {
        amount: acc.amount + row.original.amount_billed,
        commission: acc.commission + row.original.commission_earned,
      }
    },
    { amount: 0, commission: 0 },
  )

  // if no rows are selected, return null
  if (totals.amount === 0 && totals.commission === 0) {
    return null
  }

  return (
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-base font-semibold">Total Amount Billed</h2>
            <p className="mt-1 text-xl font-bold">
              {formatCurrency(totals.amount)}
            </p>
          </div>
          <div className="bg-primary-foreground/20 h-px w-full sm:h-12 sm:w-px" />
          <div className="flex flex-col items-center sm:items-end">
            <h2 className="text-base font-semibold">Total Commission Earned</h2>
            <p className="mt-1 text-xl font-bold">
              {formatCurrency(totals.commission)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TotalSelected
