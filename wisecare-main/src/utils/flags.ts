import { flag } from 'flags/next'
import { z } from 'zod'

const isProduction = process.env.VERCEL_ENV === 'production'

export const accountBenefitUpload = flag({
  key: 'account-benefit-upload',
  decide() {
    return true // enabled for prod
  },
})
