DROP FUNCTION IF EXISTS public.search_accounts;

CREATE OR REPLACE FUNCTION public.search_accounts(account_term varchar, start_offset integer, end_offset integer)
RETURNS table(
  id uuid, is_active boolean, agent text, company_name text, company_address text, nature_of_business text, 
  hmo_provider text, previous_hmo_provider text, current_hmo_provider text, account_type text, total_utilization numeric, 
  total_premium_paid numeric, signatory_designation text, contact_person text, contact_number text, 
  principal_plan_type text, dependent_plan_type text, initial_head_count int, effectivity_date date, 
  coc_issue_date date, expiration_date date, delivery_date_of_membership_ids date, orientation_date date, 
  initial_contract_value numeric, mode_of_payment text, wellness_lecture_date date, 
  annual_physical_examination_date date, commision_rate numeric, additional_benefits text, special_benefits text, 
  summary_of_benefits text, name_of_signatory text, designation_of_contact_person text, email_address_of_contact_person text, 
  created_at timestamptz, updated_at timestamptz, total_count bigint
)
LANGUAGE plpgsql
AS $$
  begin
    return query
      SELECT 
        a.id, a.is_active, u.first_name::text as agent, a.company_name::text, a.company_address::text, a.nature_of_business::text, 
        h1.name::text as hmo_provider, h2.name::text as previous_hmo_provider, h3.name::text as current_hmo_provider, at.name::text as account_type, 
        a.total_utilization::numeric, a.total_premium_paid::numeric, a.signatory_designation::text, 
        a.contact_person::text, a.contact_number::text, pt1.name::text as principal_plan_type, pt2.name::text as dependent_plan_type, 
        a.initial_head_count, a.effectivity_date, a.coc_issue_date, a.expiration_date, a.delivery_date_of_membership_ids, 
        a.orientation_date, a.initial_contract_value::numeric, mp.name::text as mode_of_payment, a.wellness_lecture_date, 
        a.annual_physical_examination_date, a.commision_rate::numeric, a.additional_benefits::text, a.special_benefits::text, 
        a.summary_of_benefits::text, a.name_of_signatory::text, a.designation_of_contact_person::text, a.email_address_of_contact_person::text, 
        a.created_at, a.updated_at, COUNT(*) OVER() AS total_count
      FROM accounts a 
      LEFT JOIN user_profiles u ON a.agent_id = u.user_id -- Ensure this column exists in user_profiles
      LEFT JOIN hmo_providers h1 ON a.hmo_provider_id = h1.id
      LEFT JOIN hmo_providers h2 ON a.previous_hmo_provider_id = h2.id
      LEFT JOIN hmo_providers h3 ON a.current_hmo_provider_id = h3.id
      LEFT JOIN account_types at ON a.account_type_id = at.id
      LEFT JOIN plan_types pt1 ON a.principal_plan_type_id = pt1.id
      LEFT JOIN plan_types pt2 ON a.dependent_plan_type_id = pt2.id
      LEFT JOIN mode_of_payments mp ON a.mode_of_payment_id = mp.id
      WHERE account_term = '' OR account_term % ANY(STRING_TO_ARRAY(a.company_name, ' '))
      OR account_term % ANY(STRING_TO_ARRAY(a.company_address, ' '))
      OR account_term % ANY(STRING_TO_ARRAY(a.nature_of_business, ' '))
      OR account_term % ANY(STRING_TO_ARRAY(a.contact_person, ' '))
      OR account_term % ANY(STRING_TO_ARRAY(a.contact_number, ' '))
      OR account_term % ANY(STRING_TO_ARRAY(a.summary_of_benefits, ' '))
      OFFSET start_offset LIMIT end_offset - start_offset + 1;
  end;
$$;