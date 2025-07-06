import React, { FC } from 'react'
import getEmployeeInputs from '@/queries/get-employee-inputs'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { Tables } from '@/types/database.types'
import { createBrowserClient } from '@/utils/supabase-client'

interface EmployeesInformationProps {
  data: Tables<'company_employees'>
}

const EmployeesInformation: FC<EmployeesInformationProps> = ({ data }) => {
  return (
    <>
      <div className="col-span-4 flex grid-cols-6 flex-col pt-4 lg:grid lg:p-2">
        <div className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-md font-semibold text-[#161a1d]">
            {data.card_number || 'N/A'}
          </span>
          <span className="text-sm font-medium text-[#64748b]">
            EMPLOYEE NUMBER
          </span>
          <span className="text-md font-semibold text-[#161a1d]">
            {data?.gender_types_id || 'N/A'}
          </span>
          <span className="text-sm font-medium text-[#64748b]">GENDER</span>
          <span className="text-md font-semibold text-[#161a1d]">
            {data.birth_date || 'N/A'}
          </span>
          <span className="text-sm font-medium text-[#64748b]">BIRTH DATE</span>
          <span className="text-md font-semibold text-[#161a1d]">
            {(() => {
              const birthDate = new Date(data.birth_date || '')
              const today = new Date()
              let age = today.getFullYear() - birthDate.getFullYear()
              const monthDifference = today.getMonth() - birthDate.getMonth()
              if (
                monthDifference < 0 ||
                (monthDifference === 0 && today.getDate() < birthDate.getDate())
              ) {
                age--
              }
              return age
            })()}
          </span>
          <span className="text-sm font-medium text-[#64748b]">AGE</span>
        </div>
        <div className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-md font-semibold text-[#161a1d]">
            {data.effective_date || 'N/A'}
          </span>
          <span className="text-sm font-medium text-[#64748b]">
            EFFECTIVE DATE
          </span>
          <span className="text-md font-semibold text-[#161a1d]">
            {data?.room_plan_id || 'N/A'}
          </span>
          <span className="text-sm font-medium text-[#64748b]">ROOM PLAN</span>
          <span className="text-md font-semibold text-[#161a1d]">
            {data.maximum_benefit_limit || 'N/A'}
          </span>
          <span className="text-sm font-medium text-[#64748b]">
            MAXIMUM BENEFIT LIMIT
          </span>
        </div>
      </div>
    </>
  )
}

export default EmployeesInformation
