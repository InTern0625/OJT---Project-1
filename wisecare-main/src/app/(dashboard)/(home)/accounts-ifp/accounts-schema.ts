import { z } from 'zod'

const accountsSchema = z.object({
  is_active: z.boolean().nullable(),
  agent_id: z.string().uuid().optional(),
  company_name: z.string().min(1).max(255),
  company_address: z.string().max(500).optional(),
  nature_of_business: z.string().max(500).optional(),
  hmo_provider_id: z.string().uuid().optional(),
  previous_hmo_provider_id: z.string().uuid().optional(),
  old_hmo_provider_id: z.string().uuid().optional(),
  account_type_id: z.string().uuid().optional(),
  total_utilization: z.string().optional(),
  total_premium_paid: z.preprocess((val) => {
    if (val === null || val === '' || val === undefined) return null
    const parsedVal = parseFloat((val as string).replace(/[₱,\s]/g, ''))
    return isNaN(parsedVal) ? null : parsedVal
  }, z.number().nullable()),
  signatory_designation: z.string().max(255).optional(),
  contact_person: z.string().max(255).optional(),
  contact_number: z.string().max(255).optional(),
  principal_plan_type_id: z.string().uuid().optional(),
  dependent_plan_type_id: z.string().uuid().optional(),
  initial_head_count: z.string().optional(),
  effective_date: z.date().optional(),
  original_effective_date: z.date().optional(),
  coc_issue_date: z.date().optional(),
  expiration_date: z.date().optional(),
  delivery_date_of_membership_ids: z.date().optional(),
  orientation_date: z.date().optional(),
  initial_contract_value: z.preprocess((val) => {
    if (val === null || val === '' || val === undefined) return null
    const parsedVal = parseFloat((val as string).replace(/[₱,\s]/g, ''))
    return isNaN(parsedVal) ? null : parsedVal
  }, z.number().nullable()),
  mode_of_payment_id: z.string().uuid().optional(),
  wellness_lecture_date: z.date().optional(),
  annual_physical_examination_date: z.date().optional(),
  commision_rate: z.string().optional(),
  additional_benefits: z.string().max(1000).optional(),
  name_of_signatory: z.string().max(255).optional(),
  designation_of_contact_person: z.string().max(255).optional(),
  email_address_of_contact_person: z.string().optional(),
  special_benefits: z.string().max(1000).optional(),
  special_benefits_files: z.array(z.instanceof(File)).optional(),
  contract_proposal: z.string().max(1000).optional(),
  contract_proposal_files: z.array(z.instanceof(File)).optional(),
  additional_benefits_text: z.string().max(1000).optional(),
  additional_benefits_files: z.array(z.instanceof(File)).optional(),
  gender: z.string().optional(),
  civil_status: z.string().optional(),
  card_number: z.string().max(500).optional(),
  room_plan_id: z.string().uuid().optional(),
  mbl: z.preprocess((val) => {
    if (val === null || val === '' || val === undefined) return null
    const parsedVal = parseFloat((val as string).replace(/[₱,\s]/g, ''))
    return isNaN(parsedVal) ? null : parsedVal
  }, z.number().nullable()),
  program_types_id: z.string().uuid().optional(),
  premium: z.preprocess((val) => {
    if (val === null || val === '' || val === undefined) return null
    const parsedVal = parseFloat((val as string).replace(/[₱,\s]/g, ''))
    return isNaN(parsedVal) ? null : parsedVal
  }, z.number().nullable()),
})

export default accountsSchema
