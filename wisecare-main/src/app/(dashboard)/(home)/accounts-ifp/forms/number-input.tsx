import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import accountsSchema from '../accounts-schema'

const NumberInput = ({
  form,
  isLoading,
  label,
  name,
  placeholder,
}: {
  form: UseFormReturn<z.infer<typeof accountsSchema>>
  isLoading: boolean
  label: string
  name: keyof z.infer<typeof accountsSchema>
  placeholder?: string
}) => {
  const handleInputChange = (
    field: ControllerRenderProps<z.infer<typeof accountsSchema>, any>,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value === '' ? null : e.target.value
    field.onChange(value)
  }
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="number"
              value={
                typeof field.value === 'string' ||
                typeof field.value === 'number'
                  ? field.value
                  : ''
              }
              onChange={(e) => handleInputChange(field, e)}
              disabled={isLoading}
              placeholder={placeholder}
              min={0}
              max={5}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default NumberInput
