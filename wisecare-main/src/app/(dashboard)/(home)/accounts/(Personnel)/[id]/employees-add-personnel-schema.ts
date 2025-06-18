'use client'

import { z } from 'zod'

// const gender = ['male', 'female', 'other'] as const
// const civilStatus = ['single', 'married', 'divorced', 'widowed'] as const

const employeesSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  birth_date: z.date(),
  gender: z.enum(['male', 'female', 'other']),
  civil_status: z.enum(['single', 'married', 'divorced', 'widowed']),
  card_number: z.string().optional(),
  effective_date: z.date().optional(),
  room_plan: z.string().optional(),
  maximum_benefit_limit: z
    .preprocess((val) => parseFloat(val as string), z.number())
    .optional(),
})

export default employeesSchema
