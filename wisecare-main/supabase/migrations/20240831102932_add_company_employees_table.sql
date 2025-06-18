DROP TABLE IF EXISTS employees;

CREATE TABLE company_employees (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id uuid references accounts(id) ON DELETE SET NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    employee_number text NOT NULL,
    real_description text NOT NULL,
    gender text CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
    civil_status text CHECK (civil_status IN ('single', 'married', 'divorced', 'widowed')) NOT NULL,
    birth_date date NOT NULL,
    age integer NOT NULL,
    residential_address text NOT NULL,
    bill_care_of text NOT NULL,
    bill_address text NOT NULL,
    bill_city_municipal text NOT NULL,
    bill_province text NOT NULL,
    email text NOT NULL,
    telephone_number text NOT NULL,
    mobile_number text NOT NULL,
    agent_name text NOT NULL,
    philhealth text NOT NULL,
    payment_mode text NOT NULL,
    plan_type text NOT NULL,
    plan_description text NOT NULL,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

ALTER TABLE company_employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow read for authenticated users"
ON company_employees
    FOR SELECT
    TO AUTHENTICATED
    USING (true);

CREATE POLICY "allow insert for under-writing department"
ON company_employees
    FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM user_profiles
        WHERE user_profiles.user_id = auth.uid() AND user_profiles.department_id = (SELECT id FROM departments WHERE name = 'under-writing')
      )
    );