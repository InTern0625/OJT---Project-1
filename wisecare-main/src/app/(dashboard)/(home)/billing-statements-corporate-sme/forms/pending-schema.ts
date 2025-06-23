import { z } from 'zod'

const pendingSchema = z.object({
  mode_of_payment_id: z.string().nullable(),
  due_date: z.date().nullable(),
  or_number: z.string().nullable(),
  or_date: z.date().nullable(),
  sa_number: z.string().nullable(),
  amount: z.preprocess(
    (val) => (val === null ? null : parseFloat(val as string)),
    z.number().nullable(),
  ),
  total_contract_value: z.preprocess(
    (val) => (val === null ? null : parseFloat(val as string)),
    z.number().nullable(),
  ),
  balance: z.preprocess(
    (val) => (val === null ? null : parseFloat(val as string)),
    z.number().nullable(),
  ),
  billing_period: z.preprocess(
    (val) => (val === null ? null : parseInt(val as string)),
    z.number().min(1).max(31).nullable(),
  ),
})

export default pendingSchema
