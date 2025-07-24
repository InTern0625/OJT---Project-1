'use client'

import { useMemo } from 'react'


const mapToOptions = (data?: { id: string; name: string }[]) =>
  data?.map((item) => ({
    label: item.name,
    value: item.name.toLowerCase(), // or use item.id if needed
    alternateMatches: [
      item.name.toLowerCase(),
      item.name.toUpperCase(),
      item.name,
    ],
  })) ?? []

export const useImportFields = () => {
  const importFields = useMemo(() => [
    {
      label: 'Affiliate Name',
      key: 'affiliate_name',
      alternateMatches: ['name', 'Affiliate Name', 'Name', 'affiliate_name'],
      fieldType: {
        type: 'input',
      },
      example: 'WPI Agency',
      validations: [
        {
          rule: 'required',
          errorMessage: 'Affiliate name is required',
          level: 'error',
        },
      ],
    },
    {
      label: 'Affiliate Address',
      key: 'affiliate_address',
      alternateMatches: ['affiliate address', 'Affiliate Address', 'Address'],
      fieldType: {
        type: 'input',
      },
      example: 'Makati City',
    },
  ], [])
  return importFields
}
