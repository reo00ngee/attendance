<style>
  svg {
    width: 1000%;
  }
</style>
```mermaid

erDiagram
  companies ||--|{ users: ""
  hourly_wage_groups ||--o{ users: ""
  users ||--|{ user_role: ""
  users ||--o{ attendance: ""
  users ||--o{ breaks: ""
  users ||--o{ expenses_and_deductions: ""
  users ||--o{ commonly_used_expenses: ""
  users ||--o{ monthly_expenses_and_deductions: ""
  users ||--o{ user_created_information: ""
  users ||--o{ user_information: ""
  information ||--o{ user_information: ""
  attendance ||--o{ breaks: ""


  users{
    id INT PK
    first_name VARCHAR(30) 
    last_name VARCHAR(30) 

  }

```