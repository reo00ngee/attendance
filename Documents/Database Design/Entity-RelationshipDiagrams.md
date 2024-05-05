<style>
  svg {
    width: 1000%;
  }
</style>

# Entity-Relationship Diagrams<!-- omit in toc -->
- [Attendance Relationship](#attendance-relationship)
- [Expense Relationship](#expense-relationship)
- [User Relationship](#user-relationship)
- [Payroll Calculation Relationship](#payroll-calculation-relationship)
- [Summary Relationship](#summary-relationship)


## Attendance Relationship
```mermaid

erDiagram
  users ||--|{ user_role: ""
  users ||--o{ attendance: ""
  users ||--o{ breaks: ""
  users ||--o{ user_information: ""
  information ||--o{ user_information: ""
  attendance ||--o{ breaks: ""

  users{
    id BIGINT PK
    first_name VARCHAR(30) 
    last_name VARCHAR(30) 
    email VARCHAR(255) 
    password VARCHAR(255) 
    phone_number VARCHAR(20) 
    gender VARCHAR(10) 
    birth_date DATE
    address VARCHAR(255)
    hire_date DATE
    retire_date DATE
    company_id BIGINT FK
    hourly_wage_group_id BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT
    updated_at TIMESTAMP
    updated_by BIGINT
    deleted_at TIMESTAMP
    deleted_by BIGINT 
  }

  user_role{
    id BIGINT PK
    user_id BIGINT FK
    role BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT
    updated_at TIMESTAMP
    updated_by BIGINT
    deleted_at TIMESTAMP
    deleted_by BIGINT 
  }

  attendance{
    id BIGINT PK
    user_id BIGINT FK
    start_time DATETIME
    end_time DATETIME
    is_holiday BOOLEAN
    comment TEXT
    submission_status BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  breaks{
    id BIGINT PK
    user_id BIGINT FK
    attendance_id BIGINT FK
    start_time DATETIME
    end_time DATETIME
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  information{
    id BIGINT PK
    submission_type BIGINT FK
    information_type BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  user_information{
    id BIGINT PK
    user_id BIGINT FK
    information_id BIGINT FK
    created_at TIMESTAMP
    updated_at TIMESTAMP
    deleted_at TIMESTAMP
  }

```
## Expense Relationship

```mermaid

erDiagram
  companies ||--o{ commonly_used_expenses_and_deductions: ""
  companies ||--|{ users: ""
  users ||--|{ user_role: ""
  users ||--o{ expenses_and_deductions: ""
  users ||--o{ commonly_used_expenses: ""
  users ||--o{ monthly_expenses_and_deductions: ""
  users ||--o{ user_information: ""
  information ||--o{ user_information: ""

  users{
    id BIGINT PK
    first_name VARCHAR(30) 
    last_name VARCHAR(30) 
    email VARCHAR(255) 
    password VARCHAR(255) 
    phone_number VARCHAR(20) 
    gender VARCHAR(10) 
    birth_date DATE
    address VARCHAR(255)
    hire_date DATE
    retire_date DATE
    company_id BIGINT FK
    hourly_wage_group_id BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT
    updated_at TIMESTAMP
    updated_by BIGINT
    deleted_at TIMESTAMP
    deleted_by BIGINT 
  }

  user_role{
    id BIGINT PK
    user_id BIGINT FK
    role BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT
    updated_at TIMESTAMP
    updated_by BIGINT
    deleted_at TIMESTAMP
    deleted_by BIGINT 
  }

  companies{
    id BIGINT PK
    name VARCHAR(30)
    address VARCHAR(255)
    phone_number VARCHAR(20)
    email VARCHAR(255)
    currency BIGINT FK
    closing_date BIGINT FK
    last_closing_date DATE
    payroll_rounding_interval BIGINT FK
    prompt_submission_reminder_days BIGINT FK
    standard_working_hours BIGINT
    overtime_pay_multiplier DECIMAL
    night_shift_hours_from TIME
    night_shift_hours_to TIME
    night_shift_pay_multiplier DECIMAL
    holiday_pay_multiplier DECIMAL
    attendance_ready BOOLEAN
    expense_ready BOOLEAN
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  expenses_and_deductions{
    id BIGINT PK
    user_id BIGINT FK
    expense_or_deduction BIGINT FK
    name VARCHAR(30)
    amount DECIMAL
    date DATE
    comment TEXT
    submission_status BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  commonly_used_expenses_and_deductions{
    id BIGINT PK
    company_id BIGINT FK
    expense_or_deduction BIGINT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  commonly_used_expenses{
    id BIGINT PK
    user_id BIGINT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  monthly_expenses_and_deductions{
    id BIGINT PK
    user_id BIGINT FK
    expense_or_deduction BIGINT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  information{
    id BIGINT PK
    submission_type BIGINT FK
    information_type BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  user_information{
    id BIGINT PK
    user_id BIGINT FK
    information_id BIGINT FK
    created_at TIMESTAMP
    updated_at TIMESTAMP
    deleted_at TIMESTAMP
  }

```

## User Relationship

```mermaid

erDiagram
  companies ||--|{ users: ""
  companies ||--o{ hourly_wage_groups: ""
  hourly_wage_groups ||--o{ users: ""
  users ||--|{ user_role: ""

  users{
    id BIGINT PK
    first_name VARCHAR(30) 
    last_name VARCHAR(30) 
    email VARCHAR(255) 
    password VARCHAR(255) 
    phone_number VARCHAR(20) 
    gender VARCHAR(10) 
    birth_date DATE
    address VARCHAR(255)
    hire_date DATE
    retire_date DATE
    company_id BIGINT FK
    hourly_wage_group_id BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT
    updated_at TIMESTAMP
    updated_by BIGINT
    deleted_at TIMESTAMP
    deleted_by BIGINT 
  }

  user_role{
    id BIGINT PK
    user_id BIGINT FK
    role BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT
    updated_at TIMESTAMP
    updated_by BIGINT
    deleted_at TIMESTAMP
    deleted_by BIGINT 
  }

  hourly_wage_groups{
    id BIGINT PK
    company_id BIGINT FK
    name VARCHAR(30)
    hourly_wage DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  companies{
    id BIGINT PK
    name VARCHAR(30)
    address VARCHAR(255)
    phone_number VARCHAR(20)
    email VARCHAR(255)
    currency BIGINT FK
    closing_date BIGINT FK
    last_closing_date DATE
    payroll_rounding_interval BIGINT FK
    prompt_submission_reminder_days BIGINT FK
    standard_working_hours BIGINT
    overtime_pay_multiplier DECIMAL
    night_shift_hours_from TIME
    night_shift_hours_to TIME
    night_shift_pay_multiplier DECIMAL
    holiday_pay_multiplier DECIMAL
    attendance_ready BOOLEAN
    expense_ready BOOLEAN
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

```

## Payroll Calculation Relationship

```mermaid

erDiagram
  companies ||--|{ users: ""
  companies ||--o{ hourly_wage_groups: ""
  companies ||--o{ holidays: ""
  hourly_wage_groups ||--o{ users: ""
  users ||--o{ attendance: ""
  users ||--o{ breaks: ""
  users ||--o{ expenses_and_deductions: ""
  users ||--o{ monthly_expenses_and_deductions: ""
  users ||--o{ payslip_contents: ""
  users ||--o{ user_information: ""
  information ||--o{ user_information: ""
  attendance ||--o{ breaks: ""

  users{
    id BIGINT PK
    first_name VARCHAR(30) 
    last_name VARCHAR(30) 
    email VARCHAR(255) 
    password VARCHAR(255) 
    phone_number VARCHAR(20) 
    gender VARCHAR(10) 
    birth_date DATE
    address VARCHAR(255)
    hire_date DATE
    retire_date DATE
    company_id BIGINT FK
    hourly_wage_group_id BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT
    updated_at TIMESTAMP
    updated_by BIGINT
    deleted_at TIMESTAMP
    deleted_by BIGINT 
  }

  hourly_wage_groups{
    id BIGINT PK
    company_id BIGINT FK
    name VARCHAR(30)
    hourly_wage DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  companies{
    id BIGINT PK
    name VARCHAR(30)
    address VARCHAR(255)
    phone_number VARCHAR(20)
    email VARCHAR(255)
    currency BIGINT FK
    closing_date BIGINT FK
    last_closing_date DATE
    payroll_rounding_interval BIGINT FK
    prompt_submission_reminder_days BIGINT FK
    standard_working_hours BIGINT
    overtime_pay_multiplier DECIMAL
    night_shift_hours_from TIME
    night_shift_hours_to TIME
    night_shift_pay_multiplier DECIMAL
    holiday_pay_multiplier DECIMAL
    attendance_ready BOOLEAN
    expense_ready BOOLEAN
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

    holidays{
    id BIGINT PK
    date DATE
    company_id BIGINT FK
    description VARCHAR(255)
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  attendance{
    id BIGINT PK
    user_id BIGINT FK
    start_time DATETIME
    end_time DATETIME
    is_holiday BOOLEAN
    comment TEXT
    submission_status BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  breaks{
    id BIGINT PK
    user_id BIGINT FK
    attendance_id BIGINT FK
    start_time DATETIME
    end_time DATETIME
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  expenses_and_deductions{
    id BIGINT PK
    user_id BIGINT FK
    expense_or_deduction BIGINT FK
    name VARCHAR(30)
    amount DECIMAL
    date DATE
    comment TEXT
    submission_status BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  monthly_expenses_and_deductions{
    id BIGINT PK
    user_id BIGINT FK
    expense_or_deduction BIGINT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  information{
    id BIGINT PK
    submission_type BIGINT FK
    information_type BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  user_information{
    id BIGINT PK
    user_id BIGINT FK
    information_id BIGINT FK
    created_at TIMESTAMP
    updated_at TIMESTAMP
    deleted_at TIMESTAMP
  }

  payslip_contents{
    id BIGINT PK
    user_id BIGINT FK
    month DATE
    content JSON
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

```

## Summary Relationship

```mermaid

erDiagram
  companies ||--o{ commonly_used_expenses_and_deductions: ""
  companies ||--|{ users: ""
  companies ||--o{ hourly_wage_groups: ""
  companies ||--o{ holidays: ""
  hourly_wage_groups ||--o{ users: ""
  users ||--|{ user_role: ""
  users ||--o{ attendance: ""
  users ||--o{ breaks: ""
  users ||--o{ expenses_and_deductions: ""
  users ||--o{ commonly_used_expenses: ""
  users ||--o{ monthly_expenses_and_deductions: ""
  users ||--o{ payslip_contents: ""
  users ||--o{ user_created_information: ""
  users ||--o{ user_information: ""
  information ||--o{ user_information: ""
  attendance ||--o{ breaks: ""

  users{
    id BIGINT PK
    first_name VARCHAR(30) 
    last_name VARCHAR(30) 
    email VARCHAR(255) 
    password VARCHAR(255) 
    phone_number VARCHAR(20) 
    gender VARCHAR(10) 
    birth_date DATE
    address VARCHAR(255)
    hire_date DATE
    retire_date DATE
    company_id BIGINT FK
    hourly_wage_group_id BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT
    updated_at TIMESTAMP
    updated_by BIGINT
    deleted_at TIMESTAMP
    deleted_by BIGINT 
  }

  user_role{
    id BIGINT PK
    user_id BIGINT FK
    role BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT
    updated_at TIMESTAMP
    updated_by BIGINT
    deleted_at TIMESTAMP
    deleted_by BIGINT 
  }

  hourly_wage_groups{
    id BIGINT PK
    company_id BIGINT FK
    name VARCHAR(30)
    hourly_wage DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  administrators{
    id BIGINT PK
    email VARCHAR(255)
    password VARCHAR(255)
    name VARCHAR(30)
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  companies{
    id BIGINT PK
    name VARCHAR(30)
    address VARCHAR(255)
    phone_number VARCHAR(20)
    email VARCHAR(255)
    currency BIGINT FK
    closing_date BIGINT FK
    last_closing_date DATE
    payroll_rounding_interval BIGINT FK
    prompt_submission_reminder_days BIGINT FK
    standard_working_hours BIGINT
    overtime_pay_multiplier DECIMAL
    night_shift_hours_from TIME
    night_shift_hours_to TIME
    night_shift_pay_multiplier DECIMAL
    holiday_pay_multiplier DECIMAL
    attendance_ready BOOLEAN
    expense_ready BOOLEAN
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

    holidays{
    id BIGINT PK
    date DATE
    company_id BIGINT FK
    description VARCHAR(255)
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  attendance{
    id BIGINT PK
    user_id BIGINT FK
    start_time DATETIME
    end_time DATETIME
    is_holiday BOOLEAN
    comment TEXT
    submission_status BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  breaks{
    id BIGINT PK
    user_id BIGINT FK
    attendance_id BIGINT FK
    start_time DATETIME
    end_time DATETIME
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  expenses_and_deductions{
    id BIGINT PK
    user_id BIGINT FK
    expense_or_deduction BIGINT FK
    name VARCHAR(30)
    amount DECIMAL
    date DATE
    comment TEXT
    submission_status BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  commonly_used_expenses_and_deductions{
    id BIGINT PK
    company_id BIGINT FK
    expense_or_deduction BIGINT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  commonly_used_expenses{
    id BIGINT PK
    user_id BIGINT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  monthly_expenses_and_deductions{
    id BIGINT PK
    user_id BIGINT FK
    expense_or_deduction BIGINT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  information{
    id BIGINT PK
    submission_type BIGINT FK
    information_type BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  user_information{
    id BIGINT PK
    user_id BIGINT FK
    information_id BIGINT FK
    created_at TIMESTAMP
    updated_at TIMESTAMP
    deleted_at TIMESTAMP
  }

  user_created_information{
    id BIGINT PK
    user_id BIGINT FK
    title VARCHAR(255)
    content TEXT
    published_at DATETIME
    expires_at DATETIME
    is_active BOOLEAN
    submission_type BIGINT FK
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

  payslip_contents{
    id BIGINT PK
    user_id BIGINT FK
    month DATE
    content JSON
    created_at TIMESTAMP
    created_by BIGINT FK
    updated_at TIMESTAMP
    updated_by BIGINT FK
    deleted_at TIMESTAMP
    deleted_by BIGINT FK
  }

```