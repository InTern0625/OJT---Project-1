import BillingStatementSchema from '@/app/(dashboard)/(home)/billing-statements-corporate-sme/billing-statement-schema'
import currencyOptions from '@/components/maskito/currency-options'
import percentageOptions from '@/components/maskito/percentage-options'
import { Tables } from '@/types/database.types'
import normalizeToUTC from '@/utils/normalize-to-utc'
import { maskitoTransform } from '@maskito/core'
import { z } from 'zod'

const formatOriginalData = (originalData: Tables<'billing_statements'>) => {
  return {
    ...Object.fromEntries(
      Object.entries(originalData).map(([key, value]) => [
        key,
        value === null ? '' : value,
      ]),
    ),
    account_id: (originalData as any).account?.id,
    mode_of_payment_id: (originalData as any).mode_of_payment?.id,
    billing_date: originalData.billing_date
      ? normalizeToUTC(new Date(originalData.billing_date))
      : undefined,
    due_date: originalData.due_date
      ? normalizeToUTC(new Date(originalData.due_date))
      : undefined,
    or_date: originalData.or_date
      ? normalizeToUTC(new Date(originalData.or_date))
      : undefined,
    billing_start: originalData.billing_start
      ? normalizeToUTC(new Date(originalData.billing_start))
      : undefined,
    billing_end: originalData.billing_end
      ? normalizeToUTC(new Date(originalData.billing_end))
      : undefined,
    total_contract_value: originalData.total_contract_value
      ? maskitoTransform(
          originalData.total_contract_value.toString(),
          currencyOptions,
        )
      : undefined,
    balance: originalData.balance
      ? maskitoTransform(originalData.balance.toString(), currencyOptions)
      : undefined,
    amount_billed: originalData.amount_billed
      ? maskitoTransform(originalData.amount_billed.toString(), currencyOptions)
      : undefined,
    amount_paid: originalData.amount_paid
      ? maskitoTransform(originalData.amount_paid.toString(), currencyOptions)
      : undefined,
    commission_rate: originalData.commission_rate
      ? maskitoTransform(
          originalData.commission_rate.toString(),
          percentageOptions,
        )
      : undefined,
    commission_earned: originalData.commission_earned
      ? maskitoTransform(
          originalData.commission_earned.toString(),
          currencyOptions,
        )
      : undefined,
  } as unknown as z.infer<typeof BillingStatementSchema>
}

export default formatOriginalData
