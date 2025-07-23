import DeleteAffiliate from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-information/delete-affiliate'
import AffiliateDetails from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-information/affiliate-details'
import AffiliateFormModal from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-information/affiliate-form-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Enums, Tables } from '@/types/database.types'
import { Table } from '@tanstack/react-table'
import { Edit, Eye, Trash2 } from 'lucide-react'

const AffiliateItem = ({ affiliate_member }: { affiliate_member: Tables<'company_affiliates'> }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              {affiliate_member.affiliate_name}
            </h3>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
        </div>
        <div className="flex justify-end space-x-2">
          <AffiliateDetails
            button={
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            }
            affiliateData={affiliate_member}
          />

          <AffiliateFormModal
            oldAffiliateData={affiliate_member}
            button={
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            }
          />

          <DeleteAffiliate
            originalData={affiliate_member}
            button={
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

const AffiliateMobileTable = ({ table }: { table: Table<any> }) => {
  return (
    <div className="space-y-4 lg:hidden">
      {table.getRowModel().rows?.length &&
        table
          .getRowModel()
          .rows.map((row) => (
            <AffiliateItem key={row.id} affiliate_member={row.original} />
          ))}
    </div>
  )
}

export default AffiliateMobileTable
