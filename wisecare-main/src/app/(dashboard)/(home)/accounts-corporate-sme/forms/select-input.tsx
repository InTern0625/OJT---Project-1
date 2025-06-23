import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import accountsSchema from '../accounts-schema'

const SelectInput = ({
  form,
  isLoading,
  label,
  name,
  placeholder,
  options,
}: {
  form: UseFormReturn<z.infer<typeof accountsSchema>>
  isLoading: boolean
  label: string
  name: keyof z.infer<typeof accountsSchema>
  placeholder?: string
  options:
    | {
        label: string
        value: string
      }[]
    | undefined
}) => {
  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger disabled={isLoading}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default SelectInput
