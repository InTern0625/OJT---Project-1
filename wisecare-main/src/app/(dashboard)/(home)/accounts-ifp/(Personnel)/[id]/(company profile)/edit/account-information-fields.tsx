import companyEditsSchema from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edits-schema'
import percentageOptions from '@/components/maskito/percentage-options'
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
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import getAgents from '@/queries/get-agents'
import getTypes from '@/queries/get-types'
import { cn } from '@/utils/tailwind'
import { useMaskito } from '@maskito/react'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { createBrowserClient } from '@/utils/supabase-client'

const AccountInformationFields = () => {
  const form = useFormContext<z.infer<typeof companyEditsSchema>>()
  const supabase = createBrowserClient()
  const { data: programTypes } = useQuery(getTypes(supabase, 'program_types'))
  const { data: agents } = useQuery(getAgents(supabase))

  const maskedPercentageRef = useMaskito({ options: percentageOptions })

  return (
    <>
      <FormField
        control={form.control}
        name="program_types_id"
        render={({ field }) => (
          <FormItem>
            <div className="pt-4">
              <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                Program Type:
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {programTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="agent_id"
        render={({ field }) => (
          <FormItem className="text-md mt-4 grid text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
            <FormLabel className="text-md font-normal text-[#1e293b]">
              Agent
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="ghost"
                    role="combobox"
                    className={cn(
                      'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-12 w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm font-normal shadow-xs focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    {field.value
                      ? agents?.find((agent) => agent.user_id === field.value)
                          ?.first_name +
                        ' ' +
                        agents?.find((agent) => agent.user_id === field.value)
                          ?.last_name
                      : 'Select Agent'}
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command {...({} as React.ComponentProps<typeof Command>)}>
                  <CommandInput placeholder="Search agent..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No agent found.</CommandEmpty>
                    <CommandGroup>
                      {agents?.map((agent) => (
                        <CommandItem
                          className="cursor-pointer"
                          value={agent.first_name + ' ' + agent.last_name}
                          key={agent.user_id}
                          onSelect={() => {
                            form.setValue('agent_id', agent.user_id)
                          }}
                        >
                          {agent.first_name} {agent.last_name}
                          <Check
                            className={cn(
                              'ml-auto h-4 w-4',
                              agent.user_id === field.value
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
      <FormField
        control={form.control}
        name="commision_rate"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md w-full text-[#1e293b] md:grid md:grid-cols-2 lg:grid-cols-1">
                  Commission Rate:
                  <Input
                    className="w-full"
                    {...field}
                    ref={maskedPercentageRef}
                    onInput={field.onChange}
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export default AccountInformationFields
