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

const FileInput = ({
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
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, ...field } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(e) => field.onChange(Array.from(e.target.files || []))}
              disabled={isLoading}
              multiple
              placeholder={placeholder}
              type="file"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FileInput
