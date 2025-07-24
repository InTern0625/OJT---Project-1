import DeleteAffiliate from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-information/delete-affiliate'
import AffiliateDetails from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-information/affiliate-details'
import AffiliateFormModal from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-information/affiliate-form-modal'
import TableHeader from '@/components/table-header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tables } from '@/types/database.types'
import { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

const affiliatesColumns: ColumnDef<Tables<'company_affiliates'>>[] = [
  // company name is not needed since we are already in the company page
  {
    accessorKey: 'affiliate_name',
    header: ({ column }) => <TableHeader column={column} title="Affiliate Name" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.affiliate_name}</span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.affiliate_name ?? '',
  },
  {
    accessorKey: 'affiliate_address',
    header: ({ column }) => <TableHeader column={column} title="Affiliate Address" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.affiliate_address}</span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.affiliate_address ?? '',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const affiliate = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Affiliate Details Start */}
            <AffiliateDetails
              button={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
              }
              affiliateData={affiliate}
            />
            {/* Affiliate Details End */}

            <DropdownMenuSeparator />

            {/* Edit affiliate Start */}
            <AffiliateFormModal
              oldAffiliateData={affiliate}
              button={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              }
            />
            {/* Edit affiliate End */}

            {/* Delete affiliate Start */}
            <DeleteAffiliate
              originalData={affiliate}
              button={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              }
            />
            {/* Delete affiliate End */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default affiliatesColumns
