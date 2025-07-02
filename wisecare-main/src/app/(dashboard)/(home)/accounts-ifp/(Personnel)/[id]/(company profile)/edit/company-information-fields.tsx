'use client'

import companyEditsSchema from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edits-schema'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select' // adjust path if needed

const CompanyInformationFields = () => {
  const form = useFormContext<z.infer<typeof companyEditsSchema>>()

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
                <Input className="w-full mt-1" {...field} />
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
                <Input className="w-full mt-1" {...field} />
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
              <input
                type="date"
                value={
                  field.value
                    ? new Date(field.value).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />



      {/* Age is computed, not editable */}

      {/* Group 3 */}
      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
         <FormItem>
           <FormControl>
             <div>
               <label className="text-sm font-semibold">Age:</label>
               <Input className="w-full mt-1" {...field} />
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
              <SelectTrigger className="w-full mt-1">
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
                <SelectTrigger className="w-full mt-1">
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
                <Input className="w-full mt-1" {...field} />
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
                <Input className="w-full mt-1" type="email" {...field} />
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
