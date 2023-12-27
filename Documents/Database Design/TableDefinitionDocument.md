# Table Definition Document

TODO:workbench見て、すでにあるdatatypeに合わせる
- [Table Definition Document](#table-definition-document)
  - [users](#users)
    - [users index](#users-index)
  - [user\_role](#user_role)
  - [hourly\_wage\_groups](#hourly_wage_groups)
  - [administrators](#administrators)
    - [administrators index](#administrators-index)
  - [companies](#companies)
  - [attendance](#attendance)
  - [breaks](#breaks)
  - [expenses\_and\_deductions](#expenses_and_deductions)
  - [commonly\_used\_expenses\_and\_deductions](#commonly_used_expenses_and_deductions)
  - [commonly\_used\_expenses](#commonly_used_expenses)
  - [monthly\_expenses\_and\_deductions](#monthly_expenses_and_deductions)
  - [information](#information)
  - [user\_information](#user_information)
  - [user\_created\_information](#user_created_information)
- [Enums](#enums)
  - [ClosingDate](#closingdate)
  - [PayrollRoundingInterval](#payrollroundinginterval)
  - [PromptSubmissionReminderDays](#promptsubmissionreminderdays)
  - [Role](#role)
  - [SubmissionStatus](#submissionstatus)
  - [SubmissionType](#submissiontype)
  - [ExpenseOrDeduction](#expenseordeduction)
  - [InformationType](#informationtype)

## users

| Column               | Data Type    | PK  | FK                     | Not NULL | Default                                       | Remarks                                        |
| -------------------- | ------------ | --- | ---------------------- | -------- | --------------------------------------------- | ---------------------------------------------- |
| id                   | INT          | ✔  |                        | ✔       |                                               | unique user identifier                         |
| first_name           | VARCHAR(30)  |     |                        |          |                                               | User's first name                              |
| last_name            | VARCHAR(30)  |     |                        |          |                                               | User's last name                               |
| email                | VARCHAR(255) |     |                        | ✔       |                                               | User's email address                           |
| password             | VARCHAR(255) |     |                        | ✔       |                                               | User's password                                |
| phone_number         | VARCHAR(20)  |     |                        |          |                                               | User's phone number                            |
| gender               | VARCHAR(10)  |     |                        |          |                                               | User's gender                                  |
| birth_date           | DATE         |     |                        |          |                                               | User's birth date                              |
| address              | VARCHAR(255) |     |                        |          |                                               | User's address                                 |
| hire_date            | DATE         |     |                        |          |                                               | User's hire date                               |
| retire_date          | DATE         |     |                        |          |                                               | User's retire date                             |
| company_id           | INT          |     | companies(id)          | ✔       |                                               | Foreign key referencing Company's ID           |
| hourly_wage_group_id | INT          |     | hourly_wage_groups(id) | ✔       |                                               | Foreign key referencing Hourly wage group's ID |
| created_at           | TIMESTAMP    |     |                        |          | CURRENT_TIMESTAMP                             | Time when the record was created               |
| created_by           | INT          |     |                        |          |                                               | User ID of the creator                         |
| updated_at           | TIMESTAMP    |     |                        |          | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Time when the record was last updated          |
| updated_by           | INT          |     |                        |          |                                               | User ID of the last updater                    |
| deleted_at           | TIMESTAMP    |     |                        |          |                                               | Time when the record was soft deleted          |
| deleted_by           | INT          |     |                        |          |                                               | User ID of the deleter                         |

### users index
* email

## user_role

| Column  | Data Type | PK  | FK          | Not NULL | Default | Remarks                     |
| ------- | --------- | --- | ----------- | -------- | ------- | --------------------------- |
| id      | INT       | ✔  |             | ✔       |         | Unique user role identifier |
| user_id | INT       |     | users(id)   | ✔       |         | Foreign key to Users        |
| role    | INT       |     | Role(Value) | ✔       |         | Role (Enum)                 |

## hourly_wage_groups

| Column      | Data Type      | PK  | FK        | Not NULL | Default                                       | Remarks                               |
| ----------- | -------------- | --- | --------- | -------- | --------------------------------------------- | ------------------------------------- |
| id          | INT            | ✔  |           | ✔       |                                               | Unique identifier                     |
| name        | VARCHAR(255)   |     |           | ✔       |                                               | Name of the hourly wage group         |
| hourly_rate | DECIMAL(10, 2) |     |           | ✔       |                                               | Hourly rate for the wage group        |
| created_at  | TIMESTAMP      |     |           |          | CURRENT_TIMESTAMP                             | Time when the record was created      |
| created_by  | INT            |     | users(id) |          |                                               | User ID of the creator                |
| updated_at  | TIMESTAMP      |     |           |          | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Time when the record was last updated |
| updated_by  | INT            |     | users(id) |          |                                               | User ID of the last updater           |
| deleted_at  | TIMESTAMP      |     |           |          |                                               | Time when the record was soft deleted |
| deleted_by  | INT            |     | users(id) |          |                                               | User ID of the deleter                |

## administrators

| Column     | Data Type    | PK  | FK        | Not NULL | Default                                       | Remarks                               |
| ---------- | ------------ | --- | --------- | -------- | --------------------------------------------- | ------------------------------------- |
| id         | INT          | ✔  | users(id) | ✔       |                                               | Unique Administrator identifier      |
| email      | VARCHAR(255) |     |           | ✔       |                                               | Administrators email address          |
| password   | VARCHAR(255) |     |           | ✔       |                                               | Administrators password               |
| name       | VARCHAR(30) |     |           | ✔       |                                               | Administrators name                   |
| created_at | TIMESTAMP    |     |           |          | CURRENT_TIMESTAMP                             | Time when the record was created      |
| created_by | INT          |     | users(id) |          |                                               | User ID of the creator                |
| updated_at | TIMESTAMP    |     |           |          | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Time when the record was last updated |
| updated_by | INT          |     | users(id) |          |                                               | User ID of the last updater           |
| deleted_at | TIMESTAMP    |     |           |          |                                               | Time when the record was soft deleted |
| deleted_by | INT          |     | users(id) |          |                                               | User ID of the deleter                |

### administrators index
* email

## companies

| Column                          | Data Type    | PK  | FK                                  | Not NULL | Default                                       | Remarks                                     |
| ------------------------------- | ------------ | --- | ----------------------------------- | -------- | --------------------------------------------- | ------------------------------------------- |
| id                              | INT          | ✔  |                                     | ✔       |                                               | Unique company identifier                   |
| name                            | VARCHAR(30)  |     |                                     | ✔       |                                               | Company's name                              |
| address                         | VARCHAR(255) |     |                                     | ✔       |                                               | Company's address                           |
| phone_number                    | VARCHAR(20)  |     |                                     | ✔       |                                               | Company's phone number                      |
| email                           | VARCHAR(255) |     |                                     | ✔       |                                               | Company's email                             |
| currency                        | VARCHAR(20)  |     |                                     | ✔       |                                               | Setting for currency                        |
| closing_date                    | INT          |     | ClosingDate(Value)                  | ✔       |                                               | Setting for closing date                    |
| payroll_rounding_interval       | INT          |     | PayrollRoundingInterval(Value)      | ✔       |                                               | Setting for payroll rounding interval       |
| prompt_submission_reminder_days | INT          |     | PromptSubmissionReminderDays(Value) | ✔       |                                               | Setting for prompt submission reminder days |
| standard_working_hours          | INT          |     |                                     | ✔       |                                               | Setting for standard working hours          |
| attendance_ready                | BOOLEAN      |     |                                     |          | false                                         | Flag indicating if attendance data is ready |
| expense_ready                   | BOOLEAN      |     |                                     |          | false                                         | Flag indicating if expense data is ready    |
| created_at                      | TIMESTAMP    |     |                                     |          | CURRENT_TIMESTAMP                             | Time when the record was created            |
| created_by                      | INT          |     | users(id)                           |          |                                               | User ID of the creator                      |
| updated_at                      | TIMESTAMP    |     |                                     |          | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Time when the record was last updated       |
| updated_by                      | INT          |     | users(id)                           |          |                                               | User ID of the last updater                 |
| deleted_at                      | TIMESTAMP    |     |                                     |          |                                               | Time when the record was soft deleted       |
| deleted_by                      | INT          |     | users(id)                           |          |                                               | User ID of the deleter                      |


## attendance

| Column            | Data Type    | PK  | FK                      | Not NULL | Default                                       | Remarks                               |
| ----------------- | ------------ | --- | ----------------------- | -------- | --------------------------------------------- | ------------------------------------- |
| id                | INT          | ✔  |                         | ✔       |                                               | Unique attendance identifier          |
| user_id           | INT          |     | users(id)               | ✔       |                                               | Foreign key referencing Users.id      |
| start_time        | DATETIME     |     |                         | ✔       |                                               | Time when the user checks in          |
| end_time          | DATETIME     |     |                         | ✔       |                                               | Time when the user checks out         |
| date              | DATE         |     |                         | ✔       |                                               | Date of the attendance record         |
| comment           | VARCHAR(255) |     |                         |          |                                               | Comment                               |
| submission_status | INT          |     | SubmissionStatus(Value) | ✔       |                                               | Submission status                     |
| created_at        | TIMESTAMP    |     |                         |          | CURRENT_TIMESTAMP                             | Time when the record was created      |
| created_by        | INT          |     | users(id)               |          |                                               | User ID of the creator                |
| updated_at        | TIMESTAMP    |     |                         |          | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Time when the record was last updated |
| updated_by        | INT          |     | users(id)               |          |                                               | User ID of the last updater           |
| deleted_at        | TIMESTAMP    |     |                         |          |                                               | Time when the record was soft deleted |
| deleted_by        | INT          |     | users(id)               |          |                                               | User ID of the deleter                |


## breaks

| Column        | Data Type | PK  | FK             | Not NULL | Default                                       | Remarks                               |
| ------------- | --------- | --- | -------------- | -------- | --------------------------------------------- | ------------------------------------- |
| id            | INT       | ✔  |                | ✔       |                                               | Unique break identifier               |
| user_id       | INT       |     | users(id)      | ✔       |                                               | Foreign key referencing Users.id      |
| attendance_id | INT       |     | attendance(id) | ✔       |                                               | Foreign key referencing Attendance.id |
| start_time    | DATETIME  |     |                | ✔       |                                               | Time when the break starts            |
| end_time      | DATETIME  |     |                | ✔       |                                               | Time when the break ends              |
| created_at    | TIMESTAMP |     |                |          | CURRENT_TIMESTAMP                             | Time when the record was created      |
| created_by    | INT       |     | users(id)      |          |                                               | User ID of the creator                |
| updated_at    | TIMESTAMP |     |                |          | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Time when the record was last updated |
| updated_by    | INT       |     | users(id)      |          |                                               | User ID of the last updater           |
| deleted_at    | TIMESTAMP |     |                |          |                                               | Time when the record was soft deleted |
| deleted_by    | INT       |     | users(id)      |          |                                               | User ID of the deleter                |

## expenses_and_deductions

| Column               | Data Type      | PK  | FK                        | Not NULL | Default                                       | Remarks                               |
| -------------------- | -------------- | --- | ------------------------- | -------- | --------------------------------------------- | ------------------------------------- |
| id                   | INT            | ✔  |                           | ✔       |                                               | Unique identifier                     |
| user_id              | INT            |     | users(id)                 | ✔       |                                               | Foreign key referencing Users.id      |
| expense_or_deduction | INT            |     | ExpenseOrDeduction(Value) | ✔       |                                               | Expense or deduction                  |
| name                 | VARCHAR(255)   |     |                           | ✔       |                                               | Name of income or expense             |
| amount               | DECIMAL(10, 2) |     |                           | ✔       |                                               | Amount of income or expense           |
| date                 | DATE           |     |                           | ✔       |                                               | Date of the transaction               |
| comment              | VARCHAR(255)   |     |                           |          |                                               | Comment                               |
| submission_status    | INT            |     | SubmissionStatus(Value)   | ✔       |                                               | Submission status                     |
| created_at           | TIMESTAMP      |     |                           |          | CURRENT_TIMESTAMP                             | Time when the record was created      |
| created_by           | INT            |     | users(id)                 |          |                                               | User ID of the creator                |
| updated_at           | TIMESTAMP      |     |                           |          | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Time when the record was last updated |
| updated_by           | INT            |     | users(id)                 |          |                                               | User ID of the last updater           |
| deleted_at           | TIMESTAMP      |     |                           |          |                                               | Time when the record was soft deleted |
| deleted_by           | INT            |     | users(id)                 |          |                                               | User ID of the deleter                |

## commonly_used_expenses_and_deductions

| Column               | Data Type      | PK  | FK                        | Not NULL | Default                                       | Remarks                               |
| -------------------- | -------------- | --- | ------------------------- | -------- | --------------------------------------------- | ------------------------------------- |
| id                   | INT            | ✔  |                           | ✔       |                                               | Unique identifier                     |
| expense_or_deduction | INT            |     | ExpenseOrDeduction(Value) | ✔       |                                               | Expense or deduction                  |
| name                 | VARCHAR(255)   |     |                           | ✔       |                                               | Name of income or expense             |
| amount               | DECIMAL(10, 2) |     |                           | ✔       |                                               | Amount of income or expense           |
| created_at           | TIMESTAMP      |     |                           |          | CURRENT_TIMESTAMP                             | Time when the record was created      |
| created_by           | INT            |     | users(id)                 |          |                                               | User ID of the creator                |
| updated_at           | TIMESTAMP      |     |                           |          | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Time when the record was last updated |
| updated_by           | INT            |     | users(id)                 |          |                                               | User ID of the last updater           |
| deleted_at           | TIMESTAMP      |     |                           |          |                                               | Time when the record was soft deleted |
| deleted_by           | INT            |     | users(id)                 |          |                                               | User ID of the deleter                |

## commonly_used_expenses

| Column     | Data Type      | PK  | FK        | Not NULL | Default                                       | Remarks                               |
| ---------- | -------------- | --- | --------- | -------- | --------------------------------------------- | ------------------------------------- |
| id         | INT            | ✔  |           | ✔       |                                               | Unique identifier                     |
| user_id    | INT            |     | users(id) | ✔       |                                               | Foreign key referencing Users.id      |
| name       | VARCHAR(255)   |     |           | ✔       |                                               | Name of income or expense             |
| amount     | DECIMAL(10, 2) |     |           | ✔       |                                               | Amount of income or expense           |
| created_at | TIMESTAMP      |     |           |          | CURRENT_TIMESTAMP                             | Time when the record was created      |
| created_by | INT            |     | users(id) |          |                                               | User ID of the creator                |
| updated_at | TIMESTAMP      |     |           |          | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Time when the record was last updated |
| updated_by | INT            |     | users(id) |          |                                               | User ID of the last updater           |
| deleted_at | TIMESTAMP      |     |           |          |                                               | Time when the record was soft deleted |
| deleted_by | INT            |     | users(id) |          |                                               | User ID of the deleter                |

## monthly_expenses_and_deductions

| Column               | Data Type      | PK  | FK                        | Not NULL | Default                                       | Remarks                               |
| -------------------- | -------------- | --- | ------------------------- | -------- | --------------------------------------------- | ------------------------------------- |
| id                   | INT            | ✔  |                           | ✔       |                                               | Unique identifier                     |
| user_id              | INT            |     | users(id)                 | ✔       |                                               | Foreign key referencing Users.id      |
| expense_or_deduction | INT            |     | ExpenseOrDeduction(Value) | ✔       |                                               | Expense or deduction                  |
| name                 | VARCHAR(255)   |     |                           | ✔       |                                               | Name of income or expense             |
| amount               | DECIMAL(10, 2) |     |                           | ✔       |                                               | Amount of income or expense           |
| created_at           | TIMESTAMP      |     |                           |          | CURRENT_TIMESTAMP                             | Time when the record was created      |
| created_by           | INT            |     | users(id)                 |          |                                               | User ID of the creator                |
| updated_at           | TIMESTAMP      |     |                           |          | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Time when the record was last updated |
| updated_by           | INT            |     | users(id)                 |          |                                               | User ID of the last updater           |
| deleted_at           | TIMESTAMP      |     |                           |          |                                               | Time when the record was soft deleted |
| deleted_by           | INT            |     | users(id)                 |          |                                               | User ID of the deleter                |

## information

| Column           | Data Type | Not NULL | Default   | PK  | FK                                            | Remarks                                        |
| ---------------- | --------- | -------- | --------- | --- | --------------------------------------------- | ---------------------------------------------- |
| id               | INT       | ✔       |           | ✔  |                                               | Unique identifier                              |
| submission_type  | INT       | ✔       |           |     | SubmissionStatus(Value)                       | Type of submission associated with information |
| information_type | INT       | ✔       |           |     | InformationStatus(Value)                      | Type of information                            |
| created_at       | TIMESTAMP |          |           |     | CURRENT_TIMESTAMP                             | Time when the record was created               |
| created_by       | INT       |          | users(id) |     |                                               | User ID of the creator                         |
| updated_at       | TIMESTAMP |          |           |     | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Time when the record was last updated          |
| updated_by       | INT       |          | users(id) |     |                                               | User ID of the last updater                    |
| deleted_at       | TIMESTAMP |          |           |     |                                               | Time when the record was soft deleted          |
| deleted_by       | INT       |          | users(id) |     |                                               | User ID of the deleter                         |

## user_information

| Column         | Data Type | PK  | FK              | Not NULL | Default | Remarks                     |
| -------------- | --------- | --- | --------------- | -------- | ------- | --------------------------- |
| id             | INT       | ✔  |                 | ✔       |         | Unique user role identifier |
| user_id        | INT       |     | users(id)       | ✔       |         | Foreign key to Users        |
| information_id | INT       |     | information(id) | ✔       |         | Foreign key to Information  |

## user_created_information

| Column           | Data Type    | Not NULL | Default   | PK  | FK                                            | Remarks                                               |
| ---------------- | ------------ | -------- | --------- | --- | --------------------------------------------- | ----------------------------------------------------- |
| id               | INT          | ✔       |           | ✔  |                                               | Unique identifier                                     |
| user_id          | INT          | ✔       |           |     | users(id)                                     | Foreign key referencing Users.id                      |
| title            | VARCHAR(255) | ✔       |           |     |                                               | Title of the information                              |
| content          | TEXT         |          |           |     |                                               | Content or details of the information                 |
| published_at     | DATETIME     |          |           |     |                                               | Date and time when the information was published      |
| expires_at       | DATETIME     |          |           |     |                                               | Date and time when the information expires            |
| is_active        | BOOLEAN      | ✔       | true      |     |                                               | Indicates whether the information is currently active |
| submission_type  | INT          | ✔       |           |     | SubmissionStatus(Value)                       | Type of submission associated with information        |
| information_type | INT          | ✔       |           |     | InformationStatus(Value)                      | Type of information                                   |
| created_at       | TIMESTAMP    |          |           |     | CURRENT_TIMESTAMP                             | Time when the record was created                      |
| created_by       | INT          |          | users(id) |     |                                               | User ID of the creator                                |
| updated_at       | TIMESTAMP    |          |           |     | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Time when the record was last updated                 |
| updated_by       | INT          |          | users(id) |     |                                               | User ID of the last updater                           |
| deleted_at       | TIMESTAMP    |          |           |     |                                               | Time when the record was soft deleted                 |
| deleted_by       | INT          |          | users(id) |     |                                               | User ID of the deleter                                |

# Enums

## ClosingDate

| Element      | Value | Description  |
| ------------ | ----- | ------------ |
| 15th         | 15    | 15th day     |
| 20th         | 20    | 20th         |
| 25th         | 25    | 25th         |
| end of month | 30    | end of month |

## PayrollRoundingInterval

| Element | Value | Description                    |
| ------- | ----- | ------------------------------ |
| 1 min   | 1     | 1 min                          |
| 5 mins  | 5     | 5 mins                         |
| 15 mins | 15    | 15 mins                        |

## PromptSubmissionReminderDays

| Element | Value | Description |
| ------- | ----- | ----------- |
| 3 days  | 3     | 3 days      |
| 5 days  | 5     | 5 days      |
| 7 days  | 7     | 7 days      |

## Role

| Element                             | Value | Description                                                          |
| ----------------------------------- | ----- | -------------------------------------------------------------------- |
| Attendance and Expense Registration | 0     | A role that can register attendance. granted to employees.           |
| Attendance Management               | 1     | A role that can manage attendance. granted to managers.              |
| Finance Management                  | 2     | A role that can manage finance. granted to accounting department.    |
| User Management                     | 3     | A role that can manage users. granted to human resources department. |
| Setting Management                  | 4     | A role that can manage setting. granted to executives.               |

## SubmissionStatus

| Element    | Value | Description                                          |
| ---------- | ----- | ---------------------------------------------------- |
| Created    | 0     | A status that created in the registration process.    |
| Submitted  | 1     | A status that submitted in the registration process. |
| Rejected   | 2     | A status that rejected in the management process.    |
| Approved   | 3     | A status that approved in the management process.    |
| Calculated | 4     | A status that calculated in the payroll process.     |

## SubmissionType

| Element    | Value | Description |
| ---------- | ----- | ----------- |
| attendance | 0     | Attendance  |
| expense    | 1     | Expense     |

## ExpenseOrDeduction

| Element    | Value | Description |
| ---------- | ----- | ----------- |
| expense     | 0     |Expense     |
| deduction    | 1     | Deduction|

## InformationType

| Element    | Value | Description |
| ---------- | ----- | ----------- |
| Submit your attendance/expense| 0     | Information for propmting submission. |
| Submission has submitted      | 1     | Information that submission has submitted. |
| Submission has rejected       | 2     | Information that submission has rejected.    |
| Submission has approved       | 3     | Information that submission has approved.    |
| Normal Information            | 4     | Information created by user.    |