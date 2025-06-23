import { z } from 'zod'

export const DeleteCompanySchema = z.object({
  companyName: z.string().min(1, { message: 'Company name is required' }),
})
