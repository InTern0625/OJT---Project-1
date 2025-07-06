'use client'

import { z } from 'zod'

const employeesSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  birth_date: z.date(),
  gender_types_id: z.string().optional(),
  civil_status_id: z.string().optional(),
  card_number: z.string().optional(),
  effective_date: z.date().optional(),
  room_plan_id: z.string().optional(),
  maximum_benefit_limit: z
    .preprocess((val) => parseFloat(val as string), z.number())
    .optional(),
})

export default employeesSchema
