import { z } from 'zod'
const companyEditsSchema = z.object({
  // marketing
  is_active: z.union([z.boolean(), z.string()]).optional(),
  status_id: z.string().optional(),
  agent_id: z.string().optional(),
  company_name: z.string().optional(),
  company_address: z.string().optional(),
  nature_of_business: z.string().optional(),
  hmo_provider_id: z.string().optional(),
  previous_hmo_provider_id: z.string().optional(),
  old_hmo_provider_id: z.string().optional(),

  affiliate_entries: z
    .array(
      z.object({
        id: z.string().optional(), // ✅ Include this
        affiliate_name: z.string(),
        affiliate_address: z.string(),
      }),
    )
    .optional(),

  deleted_affiliate_ids: z.array(z.string()).optional(), // ✅ <-- ADD THIS

  new_affiliate_name: z.string().optional(),
  new_affiliate_address: z.string().optional(),

  account_type_id: z.string().optional(),
  total_utilization: z.preprocess(
    (val) => (val === null ? null : parseFloat(val as string)),
    z.number().optional(),
  ),
  total_premium_paid: z.preprocess(
    (val) => (val === null ? null : parseFloat(val as string)),
    z.number().optional().nullable(),
  ),
  signatory_designation: z.string().optional(),
  contact_person: z.string().optional(),
  contact_number: z.string().optional(),
  principal_plan_type_id: z.string().optional(),
  dependent_plan_type_id: z.string().optional(),
  initial_head_count: z.preprocess(
    (val) => (val === null ? null : parseInt(val as string)),
    z.number().optional().nullable(),
  ),
  effective_date: z.date().optional(),
  original_effective_date: z.date().optional(),
  coc_issue_date: z.date().optional(),
  expiration_date: z.date().optional(),
  delivery_date_of_membership_ids: z.date().optional(),
  orientation_date: z.date().optional(),
  initial_contract_value: z.preprocess(
    (val) => (val === null ? null : parseFloat(val as string)),
    z.number().optional().nullable(),
  ),
  mode_of_payment_id: z.string().optional(),
  wellness_lecture_date: z.date().optional(),
  annual_physical_examination_date: z.date().optional(),
  commision_rate: z.preprocess(
    (val) => (val === null ? null : parseFloat(val as string)),
    z.number().nonnegative().optional(),
  ),
  additional_benefits: z.string().optional(),
  special_benefits: z.string().optional(),
  special_benefits_files: z.array(z.instanceof(File)).optional(),
  contract_proposal: z.string().max(1000).optional(),
  contract_proposal_files: z.array(z.instanceof(File)).optional(),
  additional_benefits_text: z.string().max(1000).optional(),
  additional_benefits_files: z.array(z.instanceof(File)).optional(),
  name_of_signatory: z.string().optional(),
  designation_of_contact_person: z.string().optional(),
  email_address_of_contact_person: z.string().optional(),
})

export default companyEditsSchema
