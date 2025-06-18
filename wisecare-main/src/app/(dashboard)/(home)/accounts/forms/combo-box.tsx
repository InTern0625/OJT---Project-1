import accountsSchema from '@/app/(dashboard)/(home)/accounts/accounts-schema'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
import { Check, ChevronsUpDown } from 'lucide-react'
import { FC } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

interface ComboBoxProps {
  form: UseFormReturn<z.infer<typeof accountsSchema>>
  name: keyof z.infer<typeof accountsSchema>
  label: string
  placeholder?: string
  isLoading: boolean
  options:
    | {
        label: string
        value: string
      }[]
    | undefined
}

const ComboBox: FC<ComboBoxProps> = ({
  form,
  name,
  label,
  placeholder,
  isLoading,
  options,
}) => {
  return (
    <div className="mb-2.5 space-y-2">
      <FormField
        control={form.control}
        name="agent_id"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Agent</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="ghost"
                    role="combobox"
                    className={cn(
                      'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-12 w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm shadow-xs focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    {field.value
                      ? options?.find((option) => option.value === field.value)
                          ?.label
                      : placeholder}
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0">
                <Command>
                  <CommandInput placeholder="Search agent..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No agent found.</CommandEmpty>
                    <CommandGroup>
                      {options?.map((option) => (
                        <CommandItem
                          className="cursor-pointer"
                          value={option.label}
                          key={option.value}
                          onSelect={() => {
                            form.setValue(name, option.value)
                          }}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              'ml-auto h-4 w-4',
                              option.value === field.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default ComboBox
