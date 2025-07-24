import {
  formatCurrency,
  formatPercentage,
} from '@/app/(dashboard)/(home)/accounts-corporate-sme/columns/accounts-columns'
import ActionRequestButton from '@/app/(dashboard)/admin/approval-request/accounts/action-request-button'
import { useApprovalRequestContext } from '@/app/(dashboard)/admin/approval-request/accounts/approval-request-provider'
import ApprovalInformationItem from '@/app/(dashboard)/admin/approval-request/components/approval-information-item'
import { Button } from '@/components/ui/button'
import getAccountById from '@/queries/get-account-by-id'
import normalizeToUTC from '@/utils/normalize-to-utc'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { formatDate } from 'date-fns'
import { Loader2 } from 'lucide-react'

import { useFeatureFlag } from '@/providers/FeatureFlagProvider'
import { createBrowserClient } from '@/utils/supabase-client'

const ApprovalFormSME = () => {
    const isSpecialBenefitsFilesEnabled = useFeatureFlag('account-benefit-upload')
    
    const supabase = createBrowserClient()
    const { isModalOpen, setIsModalOpen, selectedData, isLoading } =
        useApprovalRequestContext()
    
    const { data: oldData } = useQuery(
        getAccountById(supabase, selectedData?.account_id ?? ''),
    )
    return (
        <div>
            <div className="grid grid-cols-5">
                <div className="col-span-2 flex flex-col gap-y-6">
                    {/* Contract Information */}
                    <div className="grid grid-cols-1 gap-y-2">
                        <span className="font-medium underline underline-offset-2">
                            Contract Information
                        </span>
                        <ApprovalInformationItem
                            label="Initial Contract Value"
                                value={formatCurrency(selectedData?.initial_contract_value)}
                        oldValue={formatCurrency(oldData?.initial_contract_value)}
                        />
                        <ApprovalInformationItem
                            label="Initial Head Count"
                            value={selectedData?.initial_head_count?.toString()}
                            oldValue={oldData?.initial_head_count?.toString()}
                        />
                        <ApprovalInformationItem
                            label="Mode of Payment"
                            value={(selectedData as any)?.mode_of_payment?.name}
                            oldValue={(oldData as any)?.mode_of_payment?.name}
                        />
                        <ApprovalInformationItem
                            label={'Expiration Date'}
                            value={
                                selectedData?.expiration_date
                                ? formatDate(
                                    normalizeToUTC(new Date(selectedData.expiration_date)),
                                    'PP',
                                    )
                                : '-'
                            }
                            oldValue={
                                oldData?.expiration_date
                                ? formatDate(
                                    normalizeToUTC(new Date(oldData.expiration_date)),
                                    'PP',
                                    )
                                : '-'
                            }
                        />
                        <ApprovalInformationItem
                            label={'Effective Date'}
                            value={
                                selectedData?.effective_date
                                ? formatDate(
                                    normalizeToUTC(new Date(selectedData.effective_date)),
                                    'PP',
                                    )
                                : '-'
                            }
                            oldValue={
                                oldData?.effective_date
                                ? formatDate(
                                    normalizeToUTC(new Date(oldData.effective_date)),
                                    'PP',
                                    )
                                : '-'
                            }
                        />
                        <ApprovalInformationItem
                            label={'Original Effective Date'}
                            value={
                                selectedData?.original_effective_date
                                ? formatDate(
                                    normalizeToUTC(
                                        new Date(selectedData.original_effective_date),
                                    ),
                                    'PP',
                                    )
                                : '-'
                            }
                            oldValue={
                                oldData?.original_effective_date
                                ? formatDate(
                                    normalizeToUTC(
                                        new Date(oldData.original_effective_date),
                                    ),
                                    'PP',
                                    )
                                : '-'
                            }
                        />
                        <ApprovalInformationItem
                            label={'COC Issue Date'}
                            value={
                                selectedData?.coc_issue_date
                                ? formatDate(
                                    normalizeToUTC(new Date(selectedData.coc_issue_date)),
                                    'PP',
                                    )
                                : '-'
                            }
                            oldValue={
                                oldData?.coc_issue_date
                                ? formatDate(
                                    normalizeToUTC(new Date(oldData.coc_issue_date)),
                                    'PP',
                                    )
                                : '-'
                            }
                        />
                        <ApprovalInformationItem
                            label={'Delivery Date of Membership IDs'}
                            value={
                                selectedData?.delivery_date_of_membership_ids
                                ? formatDate(
                                    normalizeToUTC(
                                        new Date(
                                        selectedData.delivery_date_of_membership_ids,
                                        ),
                                    ),
                                    'PP',
                                    )
                                : '-'
                            }
                            oldValue={
                                oldData?.delivery_date_of_membership_ids
                                ? formatDate(
                                    normalizeToUTC(
                                        new Date(oldData.delivery_date_of_membership_ids),
                                    ),
                                    'PP',
                                    )
                                : '-'
                            }
                        />
                        <ApprovalInformationItem
                            label={'Orientation Date'}
                            value={
                                selectedData?.orientation_date
                                ? formatDate(
                                    normalizeToUTC(new Date(selectedData.orientation_date)),
                                    'PP',
                                    )
                                : '-'
                            }
                            oldValue={
                                oldData?.orientation_date
                                ? formatDate(
                                    normalizeToUTC(new Date(oldData.orientation_date)),
                                    'PP',
                                    )
                                : '-'
                            }
                        />
                        <ApprovalInformationItem
                            label={'Wellness Lecture Date'}
                            value={
                                selectedData?.wellness_lecture_date
                                ? formatDate(
                                    normalizeToUTC(
                                        new Date(selectedData.wellness_lecture_date),
                                    ),
                                    'PP',
                                    )
                                : '-'
                            }
                            oldValue={
                                oldData?.wellness_lecture_date
                                ? formatDate(
                                    normalizeToUTC(new Date(oldData.wellness_lecture_date)),
                                    'PP',
                                    )
                                : '-'
                            }
                        />
                        <ApprovalInformationItem
                            label={'Annual Physical Examination Date'}
                            value={
                                selectedData?.annual_physical_examination_date
                                ? formatDate(
                                    normalizeToUTC(
                                        new Date(
                                        selectedData.annual_physical_examination_date,
                                        ),
                                    ),
                                    'PP',
                                    )
                                : '-'
                            }
                            oldValue={
                                oldData?.annual_physical_examination_date
                                ? formatDate(
                                    normalizeToUTC(
                                        new Date(oldData.annual_physical_examination_date),
                                    ),
                                    'PP',
                                    )
                                : '-'
                            }
                        />
                    </div>

                    {/* Account Information */}
                    <div className="grid grid-cols-1 gap-y-2">
                        <span className="font-medium underline underline-offset-2">
                            Account Information
                        </span>
                        <ApprovalInformationItem
                            label={'Account Type'}
                            value={(selectedData as any)?.account_type?.name}
                            oldValue={(oldData as any)?.account_type?.name}
                        />
                        <ApprovalInformationItem
                            label={'Agent'}
                            value={`${(selectedData as any)?.agent?.first_name} ${
                                (selectedData as any)?.agent?.last_name
                            }`}
                            oldValue={`${(oldData as any)?.agent?.first_name} ${
                                (oldData as any)?.agent?.last_name
                            }`}
                        />
                        <ApprovalInformationItem
                            label={'Commission Rate'}
                            value={
                                selectedData?.commision_rate
                                ? formatPercentage(selectedData.commision_rate)
                                : '-'
                            }
                            oldValue={
                                oldData?.commision_rate
                                ? formatPercentage(oldData.commision_rate)
                                : '-'
                            }
                        />
                    </div>
                </div>
                <div className="col-span-3 flex flex-col gap-y-6">
                    {/* Company Information */}
                    <div className="grid grid-cols-2 gap-y-2">
                        <span className="col-span-2 font-medium underline underline-offset-2">
                            Company Information
                        </span>
                        <ApprovalInformationItem
                            label={'Company Name'}
                            value={(selectedData as any)?.company_name}
                            oldValue={(oldData as any)?.company_name}
                        />
                        <ApprovalInformationItem
                            label={'Account Status'}
                            value={(selectedData as any)?.status_type?.name}
                            oldValue={(oldData as any)?.status_type?.name}
                        />
                        <ApprovalInformationItem
                            label={'Company Address'}
                            value={(selectedData as any)?.company_address}
                            oldValue={(oldData as any)?.company_address}
                        />
                        <ApprovalInformationItem
                            label={'Nature of Business'}
                            value={(selectedData as any)?.nature_of_business}
                            oldValue={(oldData as any)?.nature_of_business}
                        />
                        <ApprovalInformationItem
                            label={'Contact Person'}
                            value={(selectedData as any)?.contact_person}
                            oldValue={(oldData as any)?.contact_person}
                        />
                        <ApprovalInformationItem
                            label={'Contact Number'}
                            value={(selectedData as any)?.contact_number}
                            oldValue={(oldData as any)?.contact_number}
                        />
                        <ApprovalInformationItem
                            label={'Signatory Designation'}
                            value={(selectedData as any)?.signatory_designation}
                            oldValue={(oldData as any)?.signatory_designation}
                        />
                        <ApprovalInformationItem
                            label={'Name of Signatory'}
                            value={(selectedData as any)?.name_of_signatory}
                            oldValue={(oldData as any)?.name_of_signatory}
                        />
                        <ApprovalInformationItem
                            label={'Designation of Contact Person'}
                            value={(selectedData as any)?.designation_of_contact_person}
                            oldValue={(oldData as any)?.designation_of_contact_person}
                        />
                        <ApprovalInformationItem
                            label={'Email Address of Contact Person'}
                            value={(selectedData as any)?.email_address_of_contact_person}
                            oldValue={(oldData as any)?.email_address_of_contact_person}
                        />
                    </div>

                    {/* HMO Information */}
                    <div className="grid grid-cols-2 gap-y-2">
                        <span className="col-span-2 font-medium underline underline-offset-2">
                            HMO Information
                        </span>

                        <ApprovalInformationItem
                            label={'HMO Provider'}
                            value={(selectedData as any)?.hmo_provider?.name}
                            oldValue={(oldData as any)?.hmo_provider?.name}
                        />
                        <ApprovalInformationItem
                            label={'Previous HMO Provider'}
                            value={(selectedData as any)?.previous_hmo_provider?.name}
                            oldValue={(oldData as any)?.previous_hmo_provider?.name}
                        />
                        <ApprovalInformationItem
                            label={'Old HMO Provider'}
                            value={(selectedData as any)?.old_hmo_provider?.name}
                            oldValue={(oldData as any)?.old_hmo_provider?.name}
                        />
                        <ApprovalInformationItem
                            label={'Principal Plan Type'}
                            value={(selectedData as any)?.principal_plan_type?.name}
                            oldValue={(oldData as any)?.principal_plan_type?.name}
                        />
                        <ApprovalInformationItem
                            label={'Dependent Plan Type'}
                            value={(selectedData as any)?.dependent_plan_type?.name}
                            oldValue={(oldData as any)?.dependent_plan_type?.name}
                        />
                        <ApprovalInformationItem
                            label={'Total Utilization'}
                            value={
                                selectedData?.total_utilization
                                ? formatCurrency(selectedData.total_utilization)
                                : '-'
                            }
                            oldValue={
                                oldData?.total_utilization
                                ? formatCurrency(oldData.total_utilization)
                                : '-'
                            }
                        />
                        <ApprovalInformationItem
                            label={'Total Premium Paid'}
                            value={
                                selectedData?.total_premium_paid
                                ? formatCurrency(selectedData.total_premium_paid)
                                : '-'
                            }
                            oldValue={
                                oldData?.total_premium_paid
                                ? formatCurrency(oldData.total_premium_paid)
                                : '-'
                            }
                        />
                        <ApprovalInformationItem
                            label={'Additional Benefits'}
                            value={(selectedData as any)?.additional_benefits}
                            oldValue={(oldData as any)?.additional_benefits}
                        />
                        {isSpecialBenefitsFilesEnabled ? (
                            <ApprovalInformationItem
                                label={'Special Benefits'}
                                value={selectedData?.special_benefits_files?.map(
                                (benefit) => (
                                    <span key={benefit}>{benefit}</span>
                                ),
                                )}
                                oldValue={(oldData as any)?.special_benefits_files}
                            />
                            ) : (
                            <ApprovalInformationItem
                                label={'Special Benefits'}
                                value={(selectedData as any)?.special_benefits}
                                oldValue={(oldData as any)?.special_benefits}
                            />
                        )}
                    </div>


                </div>

            </div>
            {/* Actions */}
            <div className="flex justify-end gap-x-2">
                <ActionRequestButton action="reject">
                <Button variant={'destructive'} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Reject'}
                </Button>
                </ActionRequestButton>
                <ActionRequestButton action="approve">
                <Button variant={'default'} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Approve'}
                </Button>
                </ActionRequestButton>
            </div>
        </div>
    )
}
export default ApprovalFormSME