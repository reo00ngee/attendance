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
    id INT PK
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
    company_id INT FK
    hourly_wage_group_id INT FK
    created_at TIMESTAMP
    created_by INT
    updated_at TIMESTAMP
    updated_by INT
    deleted_at TIMESTAMP
    deleted_by INT 
  }

  user_role{
    id INT PK
    user_id INT FK
    role INT FK
  }

  attendance{
    id INT PK
    user_id INT FK
    start_time DATETIME
    end_time DATETIME
    date DATE
    day_of_week INT
    comment TEXT
    submission_status INT FK
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  breaks{
    id INT PK
    user_id INT FK
    attendance_id INT FK
    start_time DATETIME
    end_time DATETIME
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  information{
    id INT PK
    submission_type INT FK
    information_type INT FK
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  user_information{
    id INT PK
    user_id INT FK
    information_id INT FK
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
    id INT PK
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
    company_id INT FK
    hourly_wage_group_id INT FK
    created_at TIMESTAMP
    created_by INT
    updated_at TIMESTAMP
    updated_by INT
    deleted_at TIMESTAMP
    deleted_by INT 
  }

  user_role{
    id INT PK
    user_id INT FK
    role INT FK
  }

  companies{
    id INT PK
    name VARCHAR(30)
    address VARCHAR(255)
    phone_number VARCHAR(20)
    email VARCHAR(255)
    currency INT FK
    closing_date INT FK
    payroll_rounding_interval INT FK
    prompt_submission_reminder_days INT FK
    standard_working_hours INT
    overtime_pay_multiplier DECIMAL
    night_shift_hours_from TIME
    night_shift_hours_to TIME
    night_shift_pay_multiplier DECIMAL
    holiday JSON
    holiday_pay_multiplier DECIMAL
    attendance_ready BOOLEAN
    expense_ready BOOLEAN
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  expenses_and_deductions{
    id INT PK
    user_id INT FK
    expense_or_deduction INT FK
    name VARCHAR(30)
    amount DECIMAL
    date DATE
    comment TEXT
    submission_status INT FK
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  commonly_used_expenses_and_deductions{
    id INT PK
    company_id INT FK
    expense_or_deduction INT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  commonly_used_expenses{
    id INT PK
    user_id INT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  monthly_expenses_and_deductions{
    id INT PK
    user_id INT FK
    expense_or_deduction INT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  information{
    id INT PK
    submission_type INT FK
    information_type INT FK
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  user_information{
    id INT PK
    user_id INT FK
    information_id INT FK
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
    id INT PK
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
    company_id INT FK
    hourly_wage_group_id INT FK
    created_at TIMESTAMP
    created_by INT
    updated_at TIMESTAMP
    updated_by INT
    deleted_at TIMESTAMP
    deleted_by INT 
  }

  user_role{
    id INT PK
    user_id INT FK
    role INT FK
  }

  hourly_wage_groups{
    id INT PK
    company_id INT FK
    name VARCHAR(30)
    hourly_rate DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  companies{
    id INT PK
    name VARCHAR(30)
    address VARCHAR(255)
    phone_number VARCHAR(20)
    email VARCHAR(255)
    currency INT FK
    closing_date INT FK
    payroll_rounding_interval INT FK
    prompt_submission_reminder_days INT FK
    standard_working_hours INT
    overtime_pay_multiplier DECIMAL
    night_shift_hours_from TIME
    night_shift_hours_to TIME
    night_shift_pay_multiplier DECIMAL
    holiday JSON
    holiday_pay_multiplier DECIMAL
    attendance_ready BOOLEAN
    expense_ready BOOLEAN
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

```

## Payroll Calculation Relationship

```mermaid

erDiagram
  companies ||--|{ users: ""
  companies ||--o{ hourly_wage_groups: ""
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
    id INT PK
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
    company_id INT FK
    hourly_wage_group_id INT FK
    created_at TIMESTAMP
    created_by INT
    updated_at TIMESTAMP
    updated_by INT
    deleted_at TIMESTAMP
    deleted_by INT 
  }

  hourly_wage_groups{
    id INT PK
    company_id INT FK
    name VARCHAR(30)
    hourly_rate DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  companies{
    id INT PK
    name VARCHAR(30)
    address VARCHAR(255)
    phone_number VARCHAR(20)
    email VARCHAR(255)
    currency INT FK
    closing_date INT FK
    payroll_rounding_interval INT FK
    prompt_submission_reminder_days INT FK
    standard_working_hours INT
    overtime_pay_multiplier DECIMAL
    night_shift_hours_from TIME
    night_shift_hours_to TIME
    night_shift_pay_multiplier DECIMAL
    holiday JSON
    holiday_pay_multiplier DECIMAL
    attendance_ready BOOLEAN
    expense_ready BOOLEAN
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  attendance{
    id INT PK
    user_id INT FK
    start_time DATETIME
    end_time DATETIME
    date DATE
    day_of_week INT
    comment TEXT
    submission_status INT FK
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  breaks{
    id INT PK
    user_id INT FK
    attendance_id INT FK
    start_time DATETIME
    end_time DATETIME
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  expenses_and_deductions{
    id INT PK
    user_id INT FK
    expense_or_deduction INT FK
    name VARCHAR(30)
    amount DECIMAL
    date DATE
    comment TEXT
    submission_status INT FK
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  monthly_expenses_and_deductions{
    id INT PK
    user_id INT FK
    expense_or_deduction INT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  information{
    id INT PK
    submission_type INT FK
    information_type INT FK
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  user_information{
    id INT PK
    user_id INT FK
    information_id INT FK
  }

  payslip_contents{
    id INT PK
    user_id INT FK
    month DATE
    content JSON
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

```

## Summary Relationship

```mermaid

erDiagram
  companies ||--o{ commonly_used_expenses_and_deductions: ""
  companies ||--|{ users: ""
  companies ||--o{ hourly_wage_groups: ""
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
    id INT PK
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
    company_id INT FK
    hourly_wage_group_id INT FK
    created_at TIMESTAMP
    created_by INT
    updated_at TIMESTAMP
    updated_by INT
    deleted_at TIMESTAMP
    deleted_by INT 
  }

  user_role{
    id INT PK
    user_id INT FK
    role INT FK
  }

  hourly_wage_groups{
    id INT PK
    company_id INT FK
    name VARCHAR(30)
    hourly_rate DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  administrators{
    id INT PK
    email VARCHAR(255)
    password VARCHAR(255)
    name VARCHAR(30)
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  companies{
    id INT PK
    name VARCHAR(30)
    address VARCHAR(255)
    phone_number VARCHAR(20)
    email VARCHAR(255)
    currency INT FK
    closing_date INT FK
    payroll_rounding_interval INT FK
    prompt_submission_reminder_days INT FK
    standard_working_hours INT
    overtime_pay_multiplier DECIMAL
    night_shift_hours_from TIME
    night_shift_hours_to TIME
    night_shift_pay_multiplier DECIMAL
    holiday JSON
    holiday_pay_multiplier DECIMAL
    attendance_ready BOOLEAN
    expense_ready BOOLEAN
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  attendance{
    id INT PK
    user_id INT FK
    start_time DATETIME
    end_time DATETIME
    date DATE
    day_of_week INT
    comment TEXT
    submission_status INT FK
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  breaks{
    id INT PK
    user_id INT FK
    attendance_id INT FK
    start_time DATETIME
    end_time DATETIME
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  expenses_and_deductions{
    id INT PK
    user_id INT FK
    expense_or_deduction INT FK
    name VARCHAR(30)
    amount DECIMAL
    date DATE
    comment TEXT
    submission_status INT FK
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  commonly_used_expenses_and_deductions{
    id INT PK
    company_id INT FK
    expense_or_deduction INT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  commonly_used_expenses{
    id INT PK
    user_id INT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  monthly_expenses_and_deductions{
    id INT PK
    user_id INT FK
    expense_or_deduction INT FK
    name VARCHAR(30)
    amount DECIMAL
    comment TEXT
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  information{
    id INT PK
    submission_type INT FK
    information_type INT FK
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  user_information{
    id INT PK
    user_id INT FK
    information_id INT FK
  }

  user_created_information{
    id INT PK
    user_id INT FK
    title VARCHAR(255)
    content TEXT
    published_at DATETIME
    expires_at DATETIME
    is_active BOOLEAN
    submission_type INT FK
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

  payslip_contents{
    id INT PK
    user_id INT FK
    month DATE
    content JSON
    created_at TIMESTAMP
    created_by INT FK
    updated_at TIMESTAMP
    updated_by INT FK
    deleted_at TIMESTAMP
    deleted_by INT FK
  }

```