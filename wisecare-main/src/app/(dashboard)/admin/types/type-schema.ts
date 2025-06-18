import { z } from 'zod'

const typeSchema = z.object({
  name: z.string().min(1).max(255),
})

export default typeSchema
