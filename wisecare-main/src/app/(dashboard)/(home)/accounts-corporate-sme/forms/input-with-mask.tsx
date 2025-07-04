import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RefObject, useMemo } from 'react'
import { RefCallBack, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import accountsSchema from '../accounts-schema'
import { useMaskito } from '@maskito/react'
import percentageOptions from '@/components/maskito/percentage-options'
import currencyOptions from '@/components/maskito/currency-options'

const InputWithMask = ({
  form,
  isLoading,
  label,
  name,
  maskType,
}: {
  form: UseFormReturn<z.infer<typeof accountsSchema>>
  isLoading: boolean
  label: string
  name: keyof z.infer<typeof accountsSchema>
  maskType: 'percentage' | 'currency'
}) => {
  const mask = useMemo(() => {
    switch (maskType) {
      case 'percentage':
        return percentageOptions
      case 'currency':
        return currencyOptions
    }
  }, [maskType])
  const ref = useMaskito({ options: mask })
  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                {...field}
                // @ts-ignore
                value={field.value ?? (maskType === "currency" ? "₱ " : "")}
                disabled={isLoading}
                onInput={field.onChange}
                ref={ref}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default InputWithMask
