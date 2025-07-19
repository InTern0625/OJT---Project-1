import { z } from 'zod'

const BillingStatementSchema = z
  .object({
    mode_of_payment_id: z.string().uuid().optional(),
    due_date: z.date().optional(),
    or_number: z.string().optional(),
    or_date: z.date().optional(),
    billing_date: z.date().optional(),
    billing_start: z.date().optional(),
    billing_end: z.date().optional(),
    sa_number: z.string().optional(),
    total_contract_value: z.preprocess((val) => {
      if (val === '' || val === undefined) return undefined
      const parsedVal = parseFloat((val as string).replace(/[₱,\s]/g, ''))
      return isNaN(parsedVal) ? undefined : parsedVal
    }, z.number().positive().optional()),
    balance: z.preprocess((val) => {
      if (val === '' || val === undefined) return undefined
      const parsedVal = parseFloat((val as string).replace(/[₱,\s]/g, ''))
      return isNaN(parsedVal) ? undefined : parsedVal
    }, z.number().positive().optional()),
    billing_period: z.preprocess(
      (val) =>
        val === '' || val === undefined
          ? undefined
          : parseInt(val as string, 10),
      z.number().int().min(1).max(31).optional(),
    ),
    amount_billed: z.preprocess((val) => {
      if (val === '' || val === undefined) return undefined
      const parsedVal = parseFloat((val as string).replace(/[₱,\s]/g, ''))
      return isNaN(parsedVal) ? undefined : parsedVal
    }, z.number().positive().optional()),
    amount_paid: z.preprocess((val) => {
      if (val === '' || val === undefined) return undefined
      const parsedVal = parseFloat((val as string).replace(/[₱,\s]/g, ''))
      return isNaN(parsedVal) ? undefined : parsedVal
    }, z.number().positive().optional()),
    commission_rate: z.preprocess(
      (val) =>
        val === '' || val === undefined ? undefined : parseFloat(val as string),
      z.number().positive().optional(),
    ),
    commission_earned: z.preprocess((val) => {
      if (val === '' || val === undefined) return undefined
      const parsedVal = parseFloat((val as string).replace(/[₱,\s]/g, ''))
      return isNaN(parsedVal) ? undefined : parsedVal
    }, z.number().positive().optional()),
    account_id: z.string().uuid(),
  })
  .superRefine((data, ctx) => {
    if (
      Object.values(data).every(
        (value) => value === undefined || value === null || value === '',
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be provided',
      })
    }
  })

export default BillingStatementSchema
