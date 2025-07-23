import { z } from 'zod'

const employeeSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  middle_name: z.string().optional(),
  suffix: z.string().optional(),
  birth_date: z.date().optional(),
  gender_types_id: z.string().optional(),
  civil_status_id: z.string().optional(),
  card_number: z.string().min(1, { message: 'Card number is required' }),
  effective_date: z.date().optional(),
  room_plan_id: z.string().optional(),
  maximum_benefit_limit: z.string().optional(),
  member_type: z.enum(['principal', 'dependent']).optional(),
  dependent_relation: z
    .enum(['spouse', 'child', 'parent', 'principal', 'sibling'])
    .optional(),
  expiration_date: z.date().optional(),
  cancelation_date: z.date().optional(),
  remarks: z.string().optional(),
  principal_member_name: z.string().optional(),
  company_affiliate_id: z.string().optional()
})

export default employeeSchema
