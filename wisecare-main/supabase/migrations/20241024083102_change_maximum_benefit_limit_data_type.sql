ALTER TABLE company_employees
ALTER COLUMN maximum_benefit_limit TYPE varchar(255) USING maximum_benefit_limit::varchar;