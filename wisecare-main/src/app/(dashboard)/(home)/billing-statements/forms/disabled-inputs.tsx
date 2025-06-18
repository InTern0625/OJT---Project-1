import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import getAccountById from '@/queries/get-account-by-id'
import { createBrowserClient } from '@/utils/supabase-client'
import { cn } from '@/utils/tailwind'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { FC } from 'react'

interface Props {
  isLoading: boolean
  id: string
}

const DisabledInputs: FC<Props> = ({ isLoading, id }) => {
  const supabase = createBrowserClient()

  const { data: account } = useQuery(getAccountById(supabase, id))

  return (
    <>
      <FormItem>
        <FormLabel>Agent</FormLabel>

        <FormMessage />
      </FormItem>

      <FormItem>
        <FormLabel>Company Name</FormLabel>
        <FormControl>
          <Input disabled={true} value={account?.company_name || ''} />
        </FormControl>
        <FormMessage />
      </FormItem>

      <FormItem>
        <FormLabel>Company Address</FormLabel>
        <FormControl>
          <Input disabled={true} value={account?.company_address || ''} />
        </FormControl>
        <FormMessage />
      </FormItem>

      <FormItem>
        <FormLabel>Nature of Business</FormLabel>
        <FormControl>
          <Input disabled={true} value={account?.nature_of_business || ''} />
        </FormControl>
        <FormMessage />
      </FormItem>
      <div className="grid grid-cols-2 gap-4">
        <FormItem>
          <FormLabel>HMO Provider</FormLabel>
          <Select
            value={
              account?.hmo_provider
                ? // @ts-ignore
                  account?.hmo_provider.name
                : 'hmoProvider'
            }
            disabled={true}
          >
            <FormControl>
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder="Select HMO Provider" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem
                value={
                  account?.hmo_provider
                    ? // @ts-ignore
                      account?.hmo_provider.name
                    : 'hmoProvider'
                }
              >
                {account?.hmo_provider
                  ? // @ts-ignore
                    account?.hmo_provider.name
                  : ''}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Previous HMO Provider</FormLabel>
          <Select
            value={
              account?.previous_hmo_provider
                ? // @ts-ignore
                  account?.previous_hmo_provider.name
                : 'previousHmoProvider'
            }
            disabled={true}
          >
            <FormControl>
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder="Select Previous HMO Provider" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem
                value={
                  account?.previous_hmo_provider
                    ? // @ts-ignore
                      account?.previous_hmo_provider.name
                    : 'prevHmoProvider'
                }
              >
                {account?.previous_hmo_provider
                  ? // @ts-ignore
                    account?.previous_hmo_provider.name
                  : ''}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormItem>
          <FormLabel>Old HMO Provider</FormLabel>
          <Select
            value={
              account?.hmo_provider
                ? // @ts-ignore
                  account?.hmo_provider.name
                : 'currentHmoProvider'
            }
            disabled={true}
          >
            <FormControl>
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder="Select Old HMO Provider" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem
                value={
                  account?.hmo_provider
                    ? // @ts-ignore
                      account?.hmo_provider.name
                    : 'currentHmoProvider'
                }
              >
                {account?.hmo_provider
                  ? // @ts-ignore
                    account?.hmo_provider.name
                  : ''}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Account Type</FormLabel>
          <Select
            value={
              account?.account_type
                ? // @ts-ignore
                  account?.account_type.name
                : 'accountType'
            }
            disabled={true}
          >
            <FormControl>
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder="Select Account Type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem
                value={
                  account?.account_type
                    ? // @ts-ignore
                      account?.account_type.name
                    : 'accountType'
                }
              >
                {account?.account_type
                  ? // @ts-ignore
                    account?.account_type.name
                  : ''}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FormItem>
          <FormLabel>Total Utilization</FormLabel>
          <FormControl>
            <Input
              type="number"
              disabled={true}
              value={account?.total_utilization || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Total Premium Paid</FormLabel>
          <FormControl>
            <Input
              type="number"
              disabled={true}
              value={account?.total_premium_paid || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Signatory Designation</FormLabel>
          <FormControl>
            <Input
              disabled={true}
              value={account?.signatory_designation || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormItem>
          <FormLabel>Contact Person</FormLabel>
          <FormControl>
            <Input disabled={true} value={account?.contact_person || ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Contact Number</FormLabel>
          <FormControl>
            <Input
              type="tel"
              disabled={true}
              value={account?.contact_number || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Principal Plan Type</FormLabel>
          <Select
            value={
              account?.principal_plan_type
                ? // @ts-ignore
                  account?.principal_plan_type.name
                : 'principalPlanType'
            }
            disabled={true}
          >
            <FormControl>
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder="Select Principal Plan Type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem
                value={
                  account?.principal_plan_type
                    ? // @ts-ignore
                      account?.principal_plan_type.name
                    : 'principalPlanType'
                }
              >
                {account?.principal_plan_type
                  ? // @ts-ignore
                    account?.principal_plan_type.name
                  : ''}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Dependent Plan Type</FormLabel>
          <Select
            value={
              account?.dependent_plan_type
                ? // @ts-ignore
                  account?.dependent_plan_type.name
                : 'dependentPlanType'
            }
            disabled={true}
          >
            <FormControl>
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder="Select Dependent Plan Type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem
                value={
                  account?.dependent_plan_type
                    ? // @ts-ignore
                      account?.dependent_plan_type.name
                    : 'dependentPlanType'
                }
              >
                {account?.dependent_plan_type
                  ? // @ts-ignore
                    account?.dependent_plan_type.name
                  : ''}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Initial Head Count</FormLabel>
          <FormControl>
            <Input
              type="number"
              disabled={true}
              value={account?.initial_head_count || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Effective Date</FormLabel>
          <FormControl>
            <Button
              variant={'outline'}
              className={cn(
                'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full min-w-[240px] rounded-lg border bg-white px-4 py-3 text-left text-sm font-normal shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
              )}
              disabled={true}
            >
              {account?.effective_date
                ? format(new Date(account.effective_date), 'MMM dd, yyyy')
                : ''}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Original Effective Date</FormLabel>
          <FormControl>
            <Button
              variant={'outline'}
              className={cn(
                'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full min-w-[240px] rounded-lg border bg-white px-4 py-3 text-left text-sm font-normal shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
              )}
              disabled={true}
            >
              {account?.original_effective_date
                ? format(
                    new Date(account.original_effective_date),
                    'MMM dd, yyyy',
                  )
                : ''}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>COC Issue Date</FormLabel>
          <FormControl>
            <Button
              variant={'outline'}
              className={cn(
                'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full min-w-[240px] rounded-lg border bg-white px-4 py-3 text-left text-sm font-normal shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
              )}
              disabled={true}
            >
              {account?.coc_issue_date
                ? format(new Date(account.coc_issue_date), 'MMM dd, yyyy')
                : ''}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Name of Signatory</FormLabel>
          <FormControl>
            <Input disabled={true} value={account?.name_of_signatory || ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Designation of Contact Person</FormLabel>
          <FormControl>
            <Input
              disabled={true}
              value={account?.designation_of_contact_person || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Email Address of Contact Person</FormLabel>
          <FormControl>
            <Input
              disabled={true}
              value={account?.email_address_of_contact_person || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FormItem>
          <FormLabel>Expiration Date</FormLabel>
          <FormControl>
            <Button
              variant={'outline'}
              className={cn(
                'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full min-w-[240px] rounded-lg border bg-white px-4 py-3 text-left text-sm font-normal shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
              )}
              disabled={true}
            >
              {account?.expiration_date
                ? format(new Date(account.expiration_date), 'MMM dd, yyyy')
                : ''}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Delivery Date of Membership IDs</FormLabel>
          <FormControl>
            <Button
              variant={'outline'}
              className={cn(
                'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full min-w-[240px] rounded-lg border bg-white px-4 py-3 text-left text-sm font-normal shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
              )}
              disabled={true}
            >
              {account?.delivery_date_of_membership_ids
                ? format(
                    new Date(account.delivery_date_of_membership_ids),
                    'MMM dd, yyyy',
                  )
                : ''}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Orientation Date</FormLabel>
          <FormControl>
            <Button
              variant={'outline'}
              className={cn(
                'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full min-w-[240px] rounded-lg border bg-white px-4 py-3 text-left text-sm font-normal shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
              )}
              disabled={true}
            >
              {account?.orientation_date
                ? format(new Date(account.orientation_date), 'MMM dd, yyyy')
                : ''}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
          <FormMessage />
        </FormItem>
      </div>
    </>
  )
}

export default DisabledInputs
