import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})

export default signInSchema
