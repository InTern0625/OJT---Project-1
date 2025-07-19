'use client'

import companyEditsSchema from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-edits-schema'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { useEffect } from 'react'
import { z } from 'zod'

const AffiliatesInformationFields = () => {
  const form = useFormContext<z.infer<typeof companyEditsSchema>>()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'affiliate_entries',
  })

  // Optional: Watch full form state for debugging
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('🧪 Live form watch:', value)
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Optional: Console log triggered manually to simulate database save
  const onSaveToDB = () => {
    const dataToSave = form.getValues('affiliate_entries')
    console.log('🗃️ Attempting to save to database → affiliate_entries:', dataToSave)
    // here you would use supabase.from('accounts').update(...).eq(...)
  }

  return (
    <div className="space-y-4">
      {/* Add button + input row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          className="w-full sm:max-w-xs"
          placeholder="Affiliate Name"
          value={form.watch('new_affiliate_name') || ''}
          onChange={(e) => form.setValue('new_affiliate_name', e.target.value)}
        />
        <Input
          className="w-full sm:max-w-xs"
          placeholder="Affiliate Address"
          value={form.watch('new_affiliate_address') || ''}
          onChange={(e) => form.setValue('new_affiliate_address', e.target.value)}
        />
        <Button
          type="button"
          variant="ghost"
          className="border border-gray-300 hover:bg-gray-100"
          onClick={() => {
            const name = form.watch('new_affiliate_name')?.trim()
            const address = form.watch('new_affiliate_address')?.trim()

            if (name && address) {
              append({
                affiliate_name: name,
                affiliate_address: address,
              })
              console.log('✅ Appended affiliate:', {
                affiliate_name: name,
                affiliate_address: address,
              })
              console.log('📦 Current affiliate_entries:', form.getValues('affiliate_entries'))

              // Clear inputs
              form.setValue('new_affiliate_name', '')
              form.setValue('new_affiliate_address', '')

              // Trigger DB save simulation (optional)
              onSaveToDB()
            } else {
              console.warn('⚠️ Missing name or address — not appended.')
            }
          }}
        >
          <Plus size={18} />
        </Button>
      </div>

      {/* List of existing affiliates */}
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md bg-gray-50 p-4 border"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name={`affiliate_entries.${index}.affiliate_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Affiliate Name" className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name={`affiliate_entries.${index}.affiliate_address`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Affiliate Address" className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-2 sm:mt-0 sm:ml-4">
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => {
                  remove(index)
                  console.log(`🗑️ Removed affiliate at index ${index}`)
                }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AffiliatesInformationFields
