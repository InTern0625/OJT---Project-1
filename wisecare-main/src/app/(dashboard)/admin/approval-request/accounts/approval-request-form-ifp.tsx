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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { formatDate } from 'date-fns'
import { Loader2 } from 'lucide-react'

import { useFeatureFlag } from '@/providers/FeatureFlagProvider'
import { createBrowserClient } from '@/utils/supabase-client'

const ApprovalFormIFP = () => {
    const isSpecialBenefitsFilesEnabled = useFeatureFlag('account-benefit-upload')
    const supabase = createBrowserClient()
    const { isModalOpen, setIsModalOpen, selectedData, isLoading } =
        useApprovalRequestContext()

    const { data: oldData } = useQuery(
        getAccountById(supabase, selectedData?.account_id ?? ''),
    )

    const computeAge = (birthdate: string | null | undefined): string => {
        if (!birthdate) return '-';
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const hasHadBirthdayThisYear =
            today.getMonth() > birth.getMonth() ||
            (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
        if (!hasHadBirthdayThisYear) age--;
        return `${age} years old`;
    };
    return (
        <div>
            <div className="grid grid-cols-3">
                <div className="col-span-2 flex flex-col gap-y-2">
                    {/* Personal Information */}
                    <span className="font-medium underline underline-offset-2">
                        Personal Information
                    </span>
                    <div className="grid grid-cols-2 gap-y-2">

                        <ApprovalInformationItem
                            label={'Complete Name'}
                            value={(selectedData as any)?.company_name}
                            oldValue={(oldData as any)?.company_name}
                        />
                        <ApprovalInformationItem
                            label={'Birthdate'}
                            value={
                                selectedData?.birthdate
                                ? formatDate(
                                    normalizeToUTC(new Date(selectedData.birthdate)),
                                    'PP',
                                    )
                                : '-'
                            }
                            oldValue={
                                oldData?.birthdate
                                ? formatDate(
                                    normalizeToUTC(new Date(oldData.birthdate)),
                                    'PP',
                                    )
                                : '-'
                            }
                        />
                        <ApprovalInformationItem
                            label="Age"
                            value={computeAge(selectedData?.birthdate)}
                            oldValue={computeAge(oldData?.birthdate)}
                        />
                        <ApprovalInformationItem
                            label={'Gender'}
                            value={(selectedData as any)?.gender_type?.name}
                            oldValue={(oldData as any)?.gender_type?.name}
                        />
                        <ApprovalInformationItem
                            label={'Civil Status'}
                            value={(selectedData as any)?.civil_status?.name}
                            oldValue={(oldData as any)?.civil_status?.name}
                        />
                        <ApprovalInformationItem
                            label={'Complete Address'}
                            value={(selectedData as any)?.company_address}
                            oldValue={(oldData as any)?.company_address}
                        />
                        <ApprovalInformationItem
                            label={'Complete Address'}
                            value={(selectedData as any)?.company_address}
                            oldValue={(oldData as any)?.company_address}
                        />
                        <ApprovalInformationItem
                            label={'Contact Number'}
                            value={(selectedData as any)?.contact_number}
                            oldValue={(oldData as any)?.contact_number}
                        />
                        <ApprovalInformationItem
                            label={'Email Address'}
                            value={(selectedData as any)?.email_address_of_contact_person}
                            oldValue={(oldData as any)?.email_address_of_contact_person}
                        />
                    </div>
                    {/* HMO Information */}
                    <span className="font-medium underline underline-offset-2">
                        HMO Information
                    </span>
                    <div className="grid grid-cols-2 gap-y-2">
                        <ApprovalInformationItem
                            label={'Card Number'}
                            value={(selectedData as any)?.card_number}
                            oldValue={(oldData as any)?.card_number}
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
                            label="Mode of Payment"
                            value={(selectedData as any)?.mode_of_payment?.name}
                            oldValue={(oldData as any)?.mode_of_payment?.name}
                        />
                        <ApprovalInformationItem
                            label={'HMO Provider'}
                            value={(selectedData as any)?.hmo_provider?.name}
                            oldValue={(oldData as any)?.hmo_provider?.name}
                        />
                        <ApprovalInformationItem
                            label={'Room Plans'}
                            value={(selectedData as any)?.room_plan?.name}
                            oldValue={(oldData as any)?.room_plan?.name}
                        />
                        <ApprovalInformationItem
                            label={'MBL'}
                            value={
                                selectedData?.mbl
                                ? formatCurrency(selectedData.mbl)
                                : '-'
                            }
                            oldValue={
                                oldData?.mbl
                                ? formatCurrency(oldData.mbl)
                                : '-'
                            }
                        />
                        <ApprovalInformationItem
                            label={'Program Types'}
                            value={(selectedData as any)?.program_type?.name}
                            oldValue={(oldData as any)?.program_type?.name}
                        />
                        <ApprovalInformationItem
                            label={'Premium'}
                            value={
                                selectedData?.premium
                                ? formatCurrency(selectedData.premium)
                                : '-'
                            }
                            oldValue={
                                oldData?.premium
                                ? formatCurrency(oldData.premium)
                                : '-'
                            }
                        />
                    </div>
                </div>
                <div className="col-span-1 flex flex-col gap-y-2">
                    {/* Account Information */}
                    <span className="font-medium underline underline-offset-2">
                        Account Information
                    </span>
                    <div className="grid grid-cols-1 gap-y-2">
                        <ApprovalInformationItem
                            label={'Agent'}
                            value={
                                (selectedData as any)?.agent
                                ? `${(selectedData as any).agent.first_name} ${(selectedData as any).agent.last_name}`
                                : '-'
                            }
                            oldValue={
                                oldData?.agent
                                ? `${oldData.agent?.[0].first_name} ${oldData.agent?.[0].last_name}`
                                : '-'
                            }
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
export default ApprovalFormIFP