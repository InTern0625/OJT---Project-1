import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utils/tailwind'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import accountsSchema from '../accounts-schema'
const DateInput = ({
  form,
  label,
  name,
  isLoading,
  validation,
}: {
  form: UseFormReturn<z.infer<typeof accountsSchema>>
  label: string
  name: keyof z.infer<typeof accountsSchema>
  isLoading: boolean
  validation?: string
}) => {
  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full min-w-[240px] rounded-lg border bg-white px-4 py-3 text-sm shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                      !field.value && 'text-muted-foreground',
                      'text-left font-normal',
                    )}
                    disabled={isLoading}
                  >
                    {field.value instanceof Date ? (
                      format(field.value, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    field.value instanceof Date ? field.value : undefined
                  }
                  onSelect={field.onChange}
                  disabled={
                    validation === "birthdate"
                    ? (date) => date < new Date('1900-01-01') || date > new Date(new Date().setHours(23, 59, 59, 999))
                    : (date) => date < new Date('1900-01-01')
                  } 
                  initialFocus
                  captionLayout="dropdown"
                  toYear={new Date().getFullYear() + 20}
                  fromYear={1900}
                  classNames={{
                    day_hidden: 'invisible',
                    dropdown:
                      'px-2 py-1.5 max-h-[100px] overflow-y-auto rounded-md bg-popover text-popover-foreground text-sm  focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
                    caption_dropdowns: 'flex gap-3',
                    vhidden: 'hidden',
                    caption_label: 'hidden',
                  }}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default DateInput
