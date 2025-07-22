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
import { z } from 'zod'
import { useState } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

const AffiliatesInformationFields = ({ companyId }: { companyId: string }) => {
  const form = useFormContext<z.infer<typeof companyEditsSchema>>()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'affiliate_entries',
  })

  const [newAffiliateName, setNewAffiliateName] = useState('')
  const [newAffiliateAddress, setNewAffiliateAddress] = useState('')
  const supabase = createBrowserClient()

  const handleAddAffiliate = () => {
    const trimmedName = newAffiliateName.trim()
    const trimmedAddress = newAffiliateAddress.trim()
    if (!trimmedName || !trimmedAddress) return

    append({
      affiliate_name: trimmedName,
      affiliate_address: trimmedAddress,
    })

    setNewAffiliateName('')
    setNewAffiliateAddress('')
  }

  const handleRemoveAffiliate = (index: number) => {
    const currentEntries = form.getValues('affiliate_entries') || []

    const entry = currentEntries[index]

    if (entry?.id) {
      const deletedIds = form.getValues('deleted_affiliate_ids') || []
      if (!deletedIds.includes(entry.id)) {
        form.setValue('deleted_affiliate_ids', [...deletedIds, entry.id])
      }
    }

    remove(index)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Affiliates Information</h3>

      {/* Add Affiliate Form */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          className="w-full sm:max-w-xs"
          placeholder="Affiliate Name"
          value={newAffiliateName}
          onChange={(e) => setNewAffiliateName(e.target.value)}
        />
        <Input
          className="w-full sm:max-w-xs"
          placeholder="Affiliate Address"
          value={newAffiliateAddress}
          onChange={(e) => setNewAffiliateAddress(e.target.value)}
        />
        <Button
          type="button"
          variant="ghost"
          className="border border-gray-300 hover:bg-gray-100"
          onClick={handleAddAffiliate}
          disabled={!newAffiliateName.trim() || !newAffiliateAddress.trim()}
        >
          <Plus size={18} />
        </Button>
      </div>

      {/* Existing Affiliates */}
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col items-start justify-between rounded-md border bg-gray-50 p-4 sm:flex-row sm:items-center"
          >
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name={`affiliate_entries.${index}.affiliate_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Affiliate Name"
                          className="w-full"
                        />
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
                        <Input
                          {...field}
                          placeholder="Affiliate Address"
                          className="w-full"
                        />
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
                onClick={() => handleRemoveAffiliate(index)}
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
