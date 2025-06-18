create table accounts (
  id uuid primary key default uuid_generate_v4(),
  is_active boolean not null default true,
  agent_id uuid not null references user_profiles(user_id) on delete set null,
  company_name varchar(255) not null,
  company_address text not null,
  nature_of_business text not null,
  hmo_provider_id uuid not null references hmo_providers(id) on delete set null,
  previous_hmo_provider_id uuid not null references hmo_providers(id) on delete set null,
  current_hmo_provider_id uuid not null references hmo_providers(id) on delete set null,
  account_type_id uuid not null references account_types(id) on delete set null,
  total_utilization float not null,
  total_premium_paid float not null,
  signatory_designation text not null,
  contact_person text not null,
  contact_number text not null,
  principal_plan_type_id uuid not null references plan_types(id) on delete set null,
  dependent_plan_type_id uuid not null references plan_types(id) on delete set null,
  initial_head_count int not null,
  effectivity_date date not null,
  coc_issue_date date not null,
  effective_date date not null,
  renewal_date date not null,
  expiration_date date not null,
  delivery_date_of_membership_ids date not null,
  orientation_date date not null,
  initial_contract_value float not null,
  mode_of_payment_id uuid not null references mode_of_payments(id) on delete set null,
  wellness_lecture_date date not null,
  annual_physical_examination_date date not null,
  commision_rate float not null,
  additional_benefits text not null,
  special_benefits text not null,
  mode_of_premium_id uuid references mode_of_premium(id) on delete set null,
  due_date date,
  or_number text,
  or_date date,
  sa_number text,
  amount float,
  total_contract_value float,
  balance float,
  billing_period int check (billing_period >= 1 and billing_period <= 31),
  summary_of_benefits text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- enable rls
alter table accounts enable row level security;

create policy "allow authenticated users to read accounts"
  on accounts
  for select
  to authenticated
  using (true);

create policy "allow specific departments to insert accounts"
  on accounts
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id in (select id from departments where name in ('admin', 'marketing', 'finance'))
    )  
  );

create policy "allow specific departments to update accounts"
  on accounts
  for update
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id in (select id from departments where name in ('admin', 'marketing', 'finance'))
    )
  )
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id in (select id from departments where name in ('admin', 'marketing', 'finance'))
    )
  );


-- fts extension
CREATE EXTENSION pg_trgm SCHEMA public;

CREATE OR REPLACE FUNCTION public.search_accounts(account_term varchar, start_offset integer, end_offset integer)
RETURNS table(
  id uuid, is_active boolean, agent text, company_name text, company_address text, nature_of_business text, 
  hmo_provider text, previous_hmo_provider text, current_hmo_provider text, account_type text, total_utilization numeric, 
  total_premium_paid numeric, signatory_designation text, contact_person text, contact_number text, 
  principal_plan_type text, dependent_plan_type text, initial_head_count int, effectivity_date date, 
  coc_issue_date date, effective_date date, renewal_date date, expiration_date date, 
  delivery_date_of_membership_ids date, orientation_date date, initial_contract_value numeric, 
  mode_of_payment text, wellness_lecture_date date, annual_physical_examination_date date, 
  commision_rate numeric, additional_benefits text, special_benefits text, mode_of_premium text, 
  due_date date, or_number text, or_date date, sa_number text, amount numeric, 
  total_contract_value numeric, balance numeric, billing_period int, summary_of_benefits text, 
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
        a.initial_head_count, a.effectivity_date, a.coc_issue_date, a.effective_date, a.renewal_date, 
        a.expiration_date, a.delivery_date_of_membership_ids, a.orientation_date, a.initial_contract_value::numeric, 
        mp.name::text as mode_of_payment, a.wellness_lecture_date, a.annual_physical_examination_date, a.commision_rate::numeric, 
        a.additional_benefits::text, a.special_benefits::text, mp2.name::text as mode_of_premium, a.due_date, a.or_number::text, 
        a.or_date, a.sa_number::text, a.amount::numeric, a.total_contract_value::numeric, a.balance::numeric, 
        a.billing_period, a.summary_of_benefits::text, a.created_at, a.updated_at,
        COUNT(*) OVER() AS total_count
      FROM accounts a 
      LEFT JOIN user_profiles u ON a.agent_id = u.user_id -- Ensure this column exists in user_profiles
      LEFT JOIN hmo_providers h1 ON a.hmo_provider_id = h1.id
      LEFT JOIN hmo_providers h2 ON a.previous_hmo_provider_id = h2.id
      LEFT JOIN hmo_providers h3 ON a.current_hmo_provider_id = h3.id
      LEFT JOIN account_types at ON a.account_type_id = at.id
      LEFT JOIN plan_types pt1 ON a.principal_plan_type_id = pt1.id
      LEFT JOIN plan_types pt2 ON a.dependent_plan_type_id = pt2.id
      LEFT JOIN mode_of_payments mp ON a.mode_of_payment_id = mp.id
      LEFT JOIN mode_of_premium mp2 ON a.mode_of_premium_id = mp2.id
      WHERE account_term = '' OR account_term % ANY(STRING_TO_ARRAY(a.company_name, ' '))
      OR account_term % ANY(STRING_TO_ARRAY(a.company_address, ' '))
      OR account_term % ANY(STRING_TO_ARRAY(a.nature_of_business, ' '))
      OR account_term % ANY(STRING_TO_ARRAY(a.contact_person, ' '))
      OR account_term % ANY(STRING_TO_ARRAY(a.contact_number, ' '))
      OR account_term % ANY(STRING_TO_ARRAY(a.summary_of_benefits, ' '))
      OFFSET start_offset LIMIT end_offset - start_offset + 1;
  end;
$$;