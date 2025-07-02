'use client'

import companyEditsSchema from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edits-schema'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext, useWatch } from 'react-hook-form'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select' // adjust path if needed
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/tailwind'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'


const CompanyInformationFields = () => {
  const form = useFormContext<z.infer<typeof companyEditsSchema>>()
  const computeAge = (birthdate: string | Date | null): number | '' => {
    if (!birthdate) return ''
    const birth = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age >= 0 ? age : ''
  }
  const birthdate = useWatch({
    control: form.control,
    name: 'birthdate',
  })

  const age = computeAge(birthdate ?? "")

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 text-[#1e293b]">
      {/* Group 1 */}
      <FormField
        control={form.control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div>
                <label className="text-sm font-semibold">Complete Name:</label>
                <Input className="w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company_address"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div>
                <label className="text-sm font-semibold">Complete Address:</label>
                <Input className="w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Group 2 */}
      <FormField
        control={form.control}
        name="birthdate"
        render={({ field }) => (
          <FormItem>
            <label className="text-sm font-semibold">Birthdate:</label>
            <FormControl>
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
                        >
                          {field.value ? (
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
                        selected={field.value ?? undefined}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date('1900-01-01')}
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Age is computed, not editable */}

      {/* Group 3 */}
      <FormField
        name="age"
        render={({ field }) => (
         <FormItem>
           <FormControl>
             <div>
               <label className="text-sm font-semibold">Age:</label>
               <Input className="w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300" 
                 value={age}
                 readOnly disabled
               />
             </div>
           </FormControl>
            <FormMessage />
         </FormItem>
      )}
      />

    <FormField
      control={form.control}
      name="gender"
      render={({ field }) => (
        <FormItem>
          <label className="text-sm font-semibold">Gender:</label>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {['Male', 'Female', 'Other', 'Prefer not to say'].map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />

      <FormField
        control={form.control}
        name="civil_status"
        render={({ field }) => (
          <FormItem>
            <label className="text-sm font-semibold">Civil Status:</label>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300">
                  <SelectValue placeholder="Select civil status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {['Single', 'Married', 'Widowed', 'Divorced', 'Separated'].map(
                  (status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Group 4 */}
      <FormField
        control={form.control}
        name="contact_number"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div>
                <label className="text-sm font-semibold">Contact Number:</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  className="w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                    field.onChange(numericValue);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={form.control}
        name="email_address_of_contact_person"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div>
                <label className="text-sm font-semibold">Email Address:</label>
                <Input className="w-full rounded border border-gray-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300" type="email" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default CompanyInformationFields
