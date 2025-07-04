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

const TextInput = ({
  form,
  isLoading,
  label,
  name,
  placeholder,
  validation,
}: {
  form: UseFormReturn<z.infer<typeof accountsSchema>>
  isLoading: boolean
  label: string
  name: keyof z.infer<typeof accountsSchema>
  placeholder?: string
  validation?: string
}) => {
  const handleInputChange = (
    field: ControllerRenderProps<z.infer<typeof accountsSchema>, any>,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = e.target.value === '' ? null : e.target.value
    if (value != null){
      switch (validation){
        case 'contactnumber':
          value = value?.replace(/[^0-9+]/g, '')
          break
        case 'alphaOnly':
          value = value?.replace(/[^a-zA-Z]/g, '')
          break
        case 'alphanumeric':
          value = value?.replace(/[^a-zA-Z0-9]/g, '')
          break
        default:
          break
      }
    }
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
              value={
                typeof field.value === 'string' ||
                typeof field.value === 'number'
                  ? field.value
                  : ''
              }
              onChange={(e) => handleInputChange(field, e)}
              disabled={isLoading}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default TextInput
