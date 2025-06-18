import { flag } from 'flags/next'

const isProduction = process.env.VERCEL_ENV === 'production'

export const accountBenefitUpload = flag({
  key: 'account-benefit-upload',
  decide() {
    return true // enabled for prod
  },
})
