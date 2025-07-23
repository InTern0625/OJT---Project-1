import { z } from 'zod'

const affiliateSchema = z.object({
  affiliate_name: z.string().min(1, { message: 'Affiliate Name is required' }),
  affiliate_address: z.string().optional(),
})

export default affiliateSchema
