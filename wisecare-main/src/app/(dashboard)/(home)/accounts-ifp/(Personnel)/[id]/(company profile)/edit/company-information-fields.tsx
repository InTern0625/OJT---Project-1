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

const CompanyInformationFields = () => {
  const form = useFormContext<z.infer<typeof companyEditsSchema>>()
  return (
    <>
      <FormField
        control={form.control}
        name="company_name" // ✅ Correct
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                  Complete Name:
                  <Input className="w-full" {...field} />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="birthdate" // 🟢 updated from company_address
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                  Birthdate:
                  <Input className="w-full" type="date" {...field} />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* No input for Age since it's computed */}

      <FormField
        control={form.control}
        name="gender" // 🟢 updated from name_of_signatory
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                  Gender:
                  <Input className="w-full" {...field} />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="civil_status" // 🟢 updated from signatory_designation
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                  Civil Status:
                  <Input className="w-full" {...field} />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company_address" // 🟢 updated from contact_person
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                  Address:
                  <Input className="w-full" {...field} />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact_number" // 🟢 updated from designation_of_contact_person
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                  Contact Number:
                  <Input className="w-full" {...field} />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email_address_of_contact_person" // ✅ already correct
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="pt-4">
                <div className="text-md grid w-full text-[#1e293b] md:grid-cols-2 lg:grid-cols-1">
                  Email Address:
                  <Input className="w-full" {...field} />
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

export default CompanyInformationFields
