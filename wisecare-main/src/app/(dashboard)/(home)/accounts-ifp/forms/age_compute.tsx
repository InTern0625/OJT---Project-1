'use client'

import {
  FormControl,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import accountsSchema from '../accounts-schema'

const calculateAge = (birthdate: Date | string | null | undefined): number | '' => {
  if (!birthdate) return ''
  const birth = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const ComputedAge = ({
  form,
  label = 'Age',
}: {
  form: UseFormReturn<z.infer<typeof accountsSchema>>
  label?: string
}) => {
  const birthdate = form.watch('birthdate')
  const age = calculateAge(birthdate)

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          value={age !== '' ? `${age} years old` : ''}
          readOnly
          disabled
        />
      </FormControl>
    </FormItem>
  )
}

export default ComputedAge
