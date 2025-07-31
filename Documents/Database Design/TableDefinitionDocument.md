# Table Definition Document<!-- omit in toc -->

- [Table Definition Document](#table-definition-document)
  - [users](#users)
    - [Indexes](#indexes)
  - [user\_role](#user_role)
    - [Indexes](#indexes-1)
  - [hourly\_wage\_groups](#hourly_wage_groups)
  - [administrators](#administrators)
    - [Indexes](#indexes-2)
  - [companies](#companies)
  - [holidays](#holidays)
  - [attendance](#attendance)
  - [attendance\_breaks](#attendance_breaks)
  - [expenses\_and\_deductions](#expenses_and_deductions)
  - [commonly\_used\_expenses\_and\_deductions](#commonly_used_expenses_and_deductions)
  - [commonly\_used\_expenses](#commonly_used_expenses)
  - [monthly\_expenses\_and\_deductions](#monthly_expenses_and_deductions)
  - [information](#information)
  - [user\_information](#user_information)
    - [Indexes](#indexes-3)
  - [user\_created\_information](#user_created_information)
  - [payslip\_contents](#payslip_contents)
- [Enums](#enums)
  - [Gender](#gender)
  - [Currency](#currency)
  - [ClosingDate](#closingdate)
  - [PayrollRoundingInterval](#payrollroundinginterval)
  - [PromptSubmissionReminderDays](#promptsubmissionreminderdays)
  - [Role](#role)
  - [SubmissionStatus](#submissionstatus)
  - [SubmissionType](#submissiontype)
  - [ExpenseOrDeduction](#expenseordeduction)
  - [InformationType](#informationtype)

## users

| Column               | Data Type    | PK  | FK                     | Not NULL | Unique | Default                     | Remarks                                        |
| -------------------- | ------------ | --- | ---------------------- | -------- | ------ | --------------------------- | ---------------------------------------------- |
| id                   | BIGINT       | ✔   |                        | ✔        |        |                             | Unique user identifier                         |
| first_name           | VARCHAR(30)  |     |                        | ✔        |        |                             | User's first name                              |
| last_name            | VARCHAR(30)  |     |                        | ✔        |        |                             | User's last name                               |
| email                | VARCHAR(255) |     |                        | ✔        | ✔      |                             | User's email address                           |
| password             | VARCHAR(255) |     |                        | ✔        |        |                             | User's password                                |
| phone_number         | VARCHAR(20)  |     |                        |          |        |                             | User's phone number                            |
| gender               | BIGINT       |     | Gender(Value)          |          |        |                             | User's gender                                  |
| birth_date           | DATE         |     |                        |          |        |                             | User's birth date                              |
| address              | VARCHAR(255) |     |                        |          |        |                             | User's address                                 |
| hire_date            | DATE         |     |                        |          |        |                             | User's hire date                               |
| retire_date          | DATE         |     |                        |          |        |                             | User's retire date                             |
| company_id           | BIGINT       |     | companies(id)          | ✔        |        |                             | Foreign key referencing Company's ID           |
| hourly_wage_group_id | BIGINT       |     | hourly_wage_groups(id) | ✔        |        |                             | Foreign key referencing Hourly wage group's ID |
| created_at           | TIMESTAMP    |     |                        |          |        | CURRENT_TIMESTAMP           | Time when the record was created               |
| created_by           | BIGINT       |     |                        |          |        |                             | User ID of the creator                         |
| updated_at           | TIMESTAMP    |     |                        |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated          |
| updated_by           | BIGINT       |     |                        |          |        |                             | User ID of the last updater                    |
| deleted_at           | TIMESTAMP    |     |                        |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted          |
| deleted_by           | BIGINT       |     |                        |          |        |                             | User ID of the deleter                         |

### Indexes
* `email`: Unique index on the email column.

## user_role

| Column     | Data Type | PK  | FK          | Not NULL | Unique                                | Default                     | Remarks                               |
| ---------- | --------- | --- | ----------- | -------- | ------------------------------------- | --------------------------- | ------------------------------------- |
| id         | BIGINT    | ✔   |             | ✔        |                                       |                             | Unique user role identifier           |
| user_id    | BIGINT    |     | users(id)   | ✔        | (Unique user_id and role combination) |                             | Foreign key to Users                  |
| role       | BIGINT    |     | Role(Value) | ✔        | (Unique user_id and role combination) |                             | Role (Enum)                           |
| created_at | TIMESTAMP |     |             |          |                                       | CURRENT_TIMESTAMP           | Time when the record was created      |
| created_by | BIGINT    |     | users(id)   |          |                                       |                             | User ID of the creator                |
| updated_at | TIMESTAMP |     |             |          |                                       | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated |
| updated_by | BIGINT    |     | users(id)   |          |                                       |                             | User ID of the last updater           |
| deleted_at | TIMESTAMP |     |             |          |                                       | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted |
| deleted_by | BIGINT    |     | users(id)   |          |                                       |                             | User ID of the deleter                |

### Indexes
* `user_id` and `role`: Unique index on the combination of user_id and role.

## hourly_wage_groups

| Column      | Data Type      | PK  | FK            | Not NULL | Unique | Default                     | Remarks                               |
| ----------- | -------------- | --- | ------------- | -------- | ------ | --------------------------- | ------------------------------------- |
| id          | BIGINT         | ✔   |               | ✔        |        |                             | Unique hourly wage group identifier   |
| company_id  | BIGINT         |     | companies(id) | ✔        |        |                             | Foreign key referencing Company's ID  |
| name        | VARCHAR(30)    |     |               | ✔        |        |                             | Name of the hourly wage group         |
| hourly_wage | DECIMAL(10, 2) |     |               | ✔        |        |                             | Hourly wage for the wage group        |
| comment     | TEXT           |     |               |          |        |                             | Comment                               |
| created_at  | TIMESTAMP      |     |               |          |        | CURRENT_TIMESTAMP           | Time when the record was created      |
| created_by  | BIGINT         |     | users(id)     |          |        |                             | User ID of the creator                |
| updated_at  | TIMESTAMP      |     |               |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated |
| updated_by  | BIGINT         |     | users(id)     |          |        |                             | User ID of the last updater           |
| deleted_at  | TIMESTAMP      |     |               |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted |
| deleted_by  | BIGINT         |     | users(id)     |          |        |                             | User ID of the deleter                |

## administrators

| Column     | Data Type    | PK  | FK                 | Not NULL | Unique | Default                     | Remarks                               |
| ---------- | ------------ | --- | ------------------ | -------- | ------ | --------------------------- | ------------------------------------- |
| id         | BIGINT       | ✔   |                    | ✔        |        |                             | Unique Administrator identifier       |
| email      | VARCHAR(255) |     |                    | ✔        | ✔      |                             | Administrators email address          |
| password   | VARCHAR(255) |     |                    | ✔        |        |                             | Administrators password               |
| name       | VARCHAR(30)  |     |                    | ✔        |        |                             | Administrators name                   |
| created_at | TIMESTAMP    |     |                    |          |        | CURRENT_TIMESTAMP           | Time when the record was created      |
| created_by | BIGINT       |     | administrators(id) |          |        |                             | Administrator ID of the creator       |
| updated_at | TIMESTAMP    |     |                    |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated |
| updated_by | BIGINT       |     | administrators(id) |          |        |                             | Administrator ID of the last updater  |
| deleted_at | TIMESTAMP    |     |                    |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted |
| deleted_by | BIGINT       |     | administrators(id) |          |        |                             | Administrator ID of the deleter       |

### Indexes
* `email`: Unique index on the email column.

## companies

| Column                          | Data Type    | PK  | FK                                  | Not NULL | Unique | Default                     | Remarks                                     |
| ------------------------------- | ------------ | --- | ----------------------------------- | -------- | ------ | --------------------------- | ------------------------------------------- |
| id                              | BIGINT       | ✔   |                                     | ✔        |        |                             | Unique company identifier                   |
| name                            | VARCHAR(30)  |     |                                     | ✔        |        |                             | Company's name                              |
| address                         | VARCHAR(255) |     |                                     | ✔        |        |                             | Company's address                           |
| phone_number                    | VARCHAR(20)  |     |                                     | ✔        |        |                             | Company's phone number                      |
| email                           | VARCHAR(255) |     |                                     | ✔        |        |                             | Company's email                             |
| currency                        | BIGINT       |     | Currency(Value)                     | ✔        |        |                             | Setting for currency                        |
| closing_date                    | BIGINT       |     | ClosingDate(Value)                  | ✔        |        |                             | Setting for closing date                    |
| last_closing_date               | DATE         |     |                                     | ✔        |        | CURRENT_DATE                | Last closing date                           |
| payroll_rounding_interval       | BIGINT       |     | PayrollRoundingInterval(Value)      | ✔        |        |                             | Setting for payroll rounding interval       |
| prompt_submission_reminder_days | BIGINT       |     | PromptSubmissionReminderDays(Value) | ✔        |        |                             | Setting for prompt submission reminder days |
| standard_working_hours          | BIGINT       |     |                                     | ✔        |        |                             | Setting for standard working hours          |
| overtime_pay_multiplier         | DECIMAL(5,2) |     |                                     |          |        |                             | Multiplier for overtime pay                 |
| night_shift_hours_from          | TIME         |     |                                     |          |        |                             | Night shift starting hour                   |
| night_shift_hours_to            | TIME         |     |                                     |          |        |                             | Night shift ending hour                     |
| night_shift_pay_multiplier      | DECIMAL(5,2) |     |                                     |          |        |                             | Multiplier for night shift pay              |
| holiday_pay_multiplier          | DECIMAL(5,2) |     |                                     |          |        |                             | Multiplier for holiday pay                  |
| attendance_ready                | BOOLEAN      |     |                                     |          |        | false                       | Flag indicating if attendance data is ready |
| expense_ready                   | BOOLEAN      |     |                                     |          |        | false                       | Flag indicating if expense data is ready    |
| created_at                      | TIMESTAMP    |     |                                     |          |        | CURRENT_TIMESTAMP           | Time when the record was created            |
| created_by                      | BIGINT       |     | administrators(id)                  |          |        |                             | Administrator ID of the creator             |
| updated_at                      | TIMESTAMP    |     |                                     |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated       |
| updated_by                      | BIGINT       |     | administrators(id)                  |          |        |                             | Administrator ID of the last updater        |
| deleted_at                      | TIMESTAMP    |     |                                     |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted       |
| deleted_by                      | BIGINT       |     | administrators(id)                  |          |        |                             | Administrator ID of the deleter             |

## holidays

| Column      | Data Type    | PK  | FK            | Not NULL | Unique | Default                     | Remarks                               |
| ----------- | ------------ | --- | ------------- | -------- | ------ | --------------------------- | ------------------------------------- |
| id          | BIGINT       | ✔   |               | ✔        |        |                             | Unique company identifier             |
| date        | DATE         |     |               | ✔        |        |                             | date                                  |
| company_id  | BIGINT       |     | companies(id) | ✔        |        |                             | Foreign key referencing Company's ID  |
| description | VARCHAR(255) |     |               |          |        |                             | Holiday's description                 |
| created_at  | TIMESTAMP    |     |               |          |        | CURRENT_TIMESTAMP           | Time when the record was created      |
| created_by  | BIGINT       |     | users(id)     |          |        |                             | User ID of the creator                |
| updated_at  | TIMESTAMP    |     |               |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated |
| updated_by  | BIGINT       |     | users(id)     |          |        |                             | User ID of the last updater           |
| deleted_at  | TIMESTAMP    |     |               |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted |
| deleted_by  | BIGINT       |     | users(id)     |          |        |                             | User ID of the deleter                |

## attendance

| Column            | Data Type | PK  | FK                      | Not NULL | Unique | Default                     | Remarks                               |
| ----------------- | --------- | --- | ----------------------- | -------- | ------ | --------------------------- | ------------------------------------- |
| id                | BIGINT    | ✔   |                         | ✔        |        |                             | Unique attendance identifier          |
| user_id           | BIGINT    |     | users(id)               | ✔        |        |                             | Foreign key referencing Users.id      |
| start_time        | DATETIME  |     |                         | ✔        |        |                             | Time when the user checks in          |
| end_time          | DATETIME  |     |                         | ✔        |        |                             | Time when the user checks out         |
| is_holiday        | BOOLEAN   |     |                         | ✔        |        | false                       | Flag indicating if holiday            |
| comment           | TEXT      |     |                         |          |        |                             | Comment                               |
| submission_status | BIGINT    |     | SubmissionStatus(Value) | ✔        |        |                             | Submission status                     |
| created_at        | TIMESTAMP |     |                         |          |        | CURRENT_TIMESTAMP           | Time when the record was created      |
| created_by        | BIGINT    |     | users(id)               |          |        |                             | User ID of the creator                |
| updated_at        | TIMESTAMP |     |                         |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated |
| updated_by        | BIGINT    |     | users(id)               |          |        |                             | User ID of the last updater           |
| deleted_at        | TIMESTAMP |     |                         |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted |
| deleted_by        | BIGINT    |     | users(id)               |          |        |                             | User ID of the deleter                |

## attendance_breaks

| Column        | Data Type | PK  | FK             | Not NULL | Unique | Default                     | Remarks                               |
| ------------- | --------- | --- | -------------- | -------- | ------ | --------------------------- | ------------------------------------- |
| id            | BIGINT    | ✔   |                | ✔        |        |                             | Unique break identifier               |
| user_id       | BIGINT    |     | users(id)      | ✔        |        |                             | Foreign key referencing Users.id      |
| attendance_id | BIGINT    |     | attendance(id) | ✔        |        |                             | Foreign key referencing Attendance.id |
| start_time    | DATETIME  |     |                | ✔        |        |                             | Time when the break starts            |
| end_time      | DATETIME  |     |                | ✔        |        |                             | Time when the break ends              |
| created_at    | TIMESTAMP |     |                |          |        | CURRENT_TIMESTAMP           | Time when the record was created      |
| created_by    | BIGINT    |     | users(id)      |          |        |                             | User ID of the creator                |
| updated_at    | TIMESTAMP |     |                |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated |
| updated_by    | BIGINT    |     | users(id)      |          |        |                             | User ID of the last updater           |
| deleted_at    | TIMESTAMP |     |                |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted |
| deleted_by    | BIGINT    |     | users(id)      |          |        |                             | User ID of the deleter                |

## expenses_and_deductions

| Column               | Data Type      | PK  | FK                        | Not NULL | Unique | Default                     | Remarks                               |
| -------------------- | -------------- | --- | ------------------------- | -------- | ------ | --------------------------- | ------------------------------------- |
| id                   | BIGINT         | ✔   |                           | ✔        |        |                             | Unique identifier                     |
| user_id              | BIGINT         |     | users(id)                 | ✔        |        |                             | Foreign key referencing Users.id      |
| expense_or_deduction | BIGINT         |     | ExpenseOrDeduction(Value) | ✔        |        |                             | Expense or deduction                  |
| name                 | VARCHAR(30)    |     |                           | ✔        |        |                             | Name of expense or deduction          |
| amount               | DECIMAL(10, 2) |     |                           | ✔        |        |                             | Amount of expense or deduction        |
| date                 | DATE           |     |                           | ✔        |        |                             | Date of the transaction               |
| submission_status    | BIGINT         |     | SubmissionStatus(Value)   | ✔        |        |                             | Submission status                     |
| comment              | TEXT           |     |                           |          |        |                             | Comment                               |
| created_at           | TIMESTAMP      |     |                           |          |        | CURRENT_TIMESTAMP           | Time when the record was created      |
| created_by           | BIGINT         |     | users(id)                 |          |        |                             | User ID of the creator                |
| updated_at           | TIMESTAMP      |     |                           |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated |
| updated_by           | BIGINT         |     | users(id)                 |          |        |                             | User ID of the last updater           |
| deleted_at           | TIMESTAMP      |     |                           |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted |
| deleted_by           | BIGINT         |     | users(id)                 |          |        |                             | User ID of the deleter                |

## commonly_used_expenses_and_deductions

| Column               | Data Type      | PK  | FK                        | Not NULL | Unique | Default                     | Remarks                               |
| -------------------- | -------------- | --- | ------------------------- | -------- | ------ | --------------------------- | ------------------------------------- |
| id                   | BIGINT         | ✔   |                           | ✔        |        |                             | Unique identifier                     |
| company_id           | BIGINT         |     | companies(id)             | ✔        |        |                             | Foreign key referencing Company's ID  |
| expense_or_deduction | BIGINT         |     | ExpenseOrDeduction(Value) | ✔        |        |                             | Expense or deduction                  |
| name                 | VARCHAR(30)    |     |                           | ✔        |        |                             | Name of expense or deduction          |
| amount               | DECIMAL(10, 2) |     |                           | ✔        |        |                             | Amount of expense or deduction        |
| comment              | TEXT           |     |                           |          |        |                             | Comment                               |
| created_at           | TIMESTAMP      |     |                           |          |        | CURRENT_TIMESTAMP           | Time when the record was created      |
| created_by           | BIGINT         |     | users(id)                 |          |        |                             | User ID of the creator                |
| updated_at           | TIMESTAMP      |     |                           |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated |
| updated_by           | BIGINT         |     | users(id)                 |          |        |                             | User ID of the last updater           |
| deleted_at           | TIMESTAMP      |     |                           |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted |
| deleted_by           | BIGINT         |     | users(id)                 |          |        |                             | User ID of the deleter                |

## commonly_used_expenses

| Column     | Data Type      | PK  | FK        | Not NULL | Unique | Default                     | Remarks                               |
| ---------- | -------------- | --- | --------- | -------- | ------ | --------------------------- | ------------------------------------- |
| id         | BIGINT         | ✔   |           | ✔        |        |                             | Unique identifier                     |
| user_id    | BIGINT         |     | users(id) | ✔        |        |                             | Foreign key referencing Users.id      |
| name       | VARCHAR(30)    |     |           | ✔        |        |                             | Name of expense or deduction          |
| amount     | DECIMAL(10, 2) |     |           | ✔        |        |                             | Amount of expense or deduction        |
| comment    | TEXT           |     |           |          |        |                             | Comment                               |
| created_at | TIMESTAMP      |     |           |          |        | CURRENT_TIMESTAMP           | Time when the record was created      |
| created_by | BIGINT         |     | users(id) |          |        |                             | User ID of the creator                |
| updated_at | TIMESTAMP      |     |           |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated |
| updated_by | BIGINT         |     | users(id) |          |        |                             | User ID of the last updater           |
| deleted_at | TIMESTAMP      |     |           |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted |
| deleted_by | BIGINT         |     | users(id) |          |        |                             | User ID of the deleter                |

## monthly_expenses_and_deductions

| Column               | Data Type      | PK  | FK                        | Not NULL | Unique | Default                     | Remarks                               |
| -------------------- | -------------- | --- | ------------------------- | -------- | ------ | --------------------------- | ------------------------------------- |
| id                   | BIGINT         | ✔   |                           | ✔        |        |                             | Unique identifier                     |
| user_id              | BIGINT         |     | users(id)                 | ✔        |        |                             | Foreign key referencing Users.id      |
| expense_or_deduction | BIGINT         |     | ExpenseOrDeduction(Value) | ✔        |        |                             | Expense or deduction                  |
| name                 | VARCHAR(30)    |     |                           | ✔        |        |                             | Name of expense or deduction          |
| amount               | DECIMAL(10, 2) |     |                           | ✔        |        |                             | Amount of expense or deduction        |
| comment              | TEXT           |     |                           |          |        |                             | Comment                               |
| created_at           | TIMESTAMP      |     |                           |          |        | CURRENT_TIMESTAMP           | Time when the record was created      |
| created_by           | BIGINT         |     | users(id)                 |          |        |                             | User ID of the creator                |
| updated_at           | TIMESTAMP      |     |                           |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated |
| updated_by           | BIGINT         |     | users(id)                 |          |        |                             | User ID of the last updater           |
| deleted_at           | TIMESTAMP      |     |                           |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted |
| deleted_by           | BIGINT         |     | users(id)                 |          |        |                             | User ID of the deleter                |

## information

| Column           | Data Type | PK  | FK                       | Not NULL | Unique | Default                     | Remarks                                        |
| ---------------- | --------- | --- | ------------------------ | -------- | ------ | --------------------------- | ---------------------------------------------- |
| id               | BIGINT    | ✔   |                          | ✔        |        |                             | Unique identifier                              |
| submission_type  | BIGINT    |     | SubmissionStatus(Value)  | ✔        |        |                             | Type of submission associated with information |
| information_type | BIGINT    |     | InformationStatus(Value) | ✔        |        |                             | Type of information                            |
| comment          | TEXT      |     |                          |          |        |                             | Comment                                        |
| created_at       | TIMESTAMP |     |                          |          |        | CURRENT_TIMESTAMP           | Time when the record was created               |
| created_by       | BIGINT    |     | users(id)                |          |        |                             | User ID of the creator                         |
| updated_at       | TIMESTAMP |     |                          |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated          |
| updated_by       | BIGINT    |     | users(id)                |          |        |                             | User ID of the last updater                    |
| deleted_at       | TIMESTAMP |     |                          |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted          |
| deleted_by       | BIGINT    |     | users(id)                |          |        |                             | User ID of the deleter                         |

## user_information

| Column         | Data Type | PK  | FK              | Not NULL | Unique                                          | Default                     | Remarks                               |
| -------------- | --------- | --- | --------------- | -------- | ----------------------------------------------- | --------------------------- | ------------------------------------- |
| id             | BIGINT    | ✔   |                 | ✔        |                                                 |                             | Unique user role identifier           |
| user_id        | BIGINT    |     | users(id)       | ✔        | (Unique user_id and information_id combination) |                             | Foreign key to Users                  |
| information_id | BIGINT    |     | information(id) | ✔        | (Unique user_id and information_id combination) |                             | Foreign key to Information            |
| created_at     | TIMESTAMP |     |                 |          |                                                 | CURRENT_TIMESTAMP           | Time when the record was created      |
| updated_at     | TIMESTAMP |     |                 |          |                                                 | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated |
| deleted_at     | TIMESTAMP |     |                 |          |                                                 | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted |

### Indexes
* `user_id` and `information_id`: Unique index on the combination of user_id and information_id.

## user_created_information

| Column          | Data Type    | PK  | FK                      | Not NULL | Unique | Default                     | Remarks                                               |
| --------------- | ------------ | --- | ----------------------- | -------- | ------ | --------------------------- | ----------------------------------------------------- |
| id              | BIGINT       | ✔   |                         | ✔        |        |                             | Unique identifier                                     |
| user_id         | BIGINT       |     | users(id)               | ✔        |        |                             | Foreign key referencing Users.id                      |
| title           | VARCHAR(255) |     |                         | ✔        |        |                             | Title of the information                              |
| content         | TEXT         |     |                         |          |        |                             | Content or details of the information                 |
| published_at    | DATETIME     |     |                         |          |        |                             | Date and time when the information was published      |
| expires_at      | DATETIME     |     |                         |          |        |                             | Date and time when the information expires            |
| is_active       | BOOLEAN      |     |                         | ✔        |        |                             | Indicates whether the information is currently active |
| submission_type | BIGINT       |     | SubmissionStatus(Value) |          |        |                             | Type of submission associated with information        |
| created_at      | TIMESTAMP    |     |                         |          |        | CURRENT_TIMESTAMP           | Time when the record was created                      |
| created_by      | BIGINT       |     | users(id)               |          |        |                             | User ID of the creator                                |
| updated_at      | TIMESTAMP    |     |                         |          |        | CURRENT_TIMESTAMP ON UPDATE | Time when the record was last updated                 |
| updated_by      | BIGINT       |     | users(id)               |          |        |                             | User ID of the last updater                           |
| deleted_at      | TIMESTAMP    |     |                         |          |        | CURRENT_TIMESTAMP ON DELETE | Time when the record was soft deleted                 |
| deleted_by      | BIGINT       |     | users(id)               |          |        |                             | User ID of the deleter                                |

## payslip_contents

| Column     | Data Type | PK  | FK        | Not NULL | Unique | Default                     | Remarks                                  |
| ---------- | --------- | --- | --------- | -------- | ------ | --------------------------- | ---------------------------------------- |
| id         | BIGINT    | ✔   |           | ✔        |        |                             | Unique identifier                        |
| user_id    | BIGINT    |     | users(id) | ✔        |        |                             | ID of the associated user                |
| month      | DATE      |     |           | ✔        |        |                             | Month for which the results are recorded |
| content    | JSON      |     |           | ✔        |        |                             | JSON format storing payslip contents     |
| created_at | TIMESTAMP |     |           |          |        | CURRENT_TIMESTAMP           | Time of creation                         |
| created_by | BIGINT    |     | users(id) |          |        |                             | User ID of the creator                   |
| updated_at | TIMESTAMP |     |           |          |        | CURRENT_TIMESTAMP ON UPDATE | Time of last update                      |
| updated_by | BIGINT    |     | users(id) |          |        |                             | User ID of the last updater              |
| deleted_at | TIMESTAMP |     |           |          |        | CURRENT_TIMESTAMP ON DELETE | Time of soft deletion                    |
| deleted_by | BIGINT    |     | users(id) |          |        |                             | User ID of the deleter                   |

# Enums

## Gender

| Element | Value | Description |
| ------- | ----- | ----------- |
| Male    | 1     | Male        |
| Female  | 2     | Female      |

## Currency

| Element | Value | Description |
| ------- | ----- | ----------- |
| $       | 1     | USD         |
| €       | 2     | EUR         |

## ClosingDate

| Element      | Value | Description  |
| ------------ | ----- | ------------ |
| 15th         | 15    | 15th         |
| 20th         | 20    | 20th         |
| 25th         | 25    | 25th         |
| end of month | 30    | end of month |

## PayrollRoundingInterval

| Element | Value | Description |
| ------- | ----- | ----------- |
| 1 min   | 1     | 1 min       |
| 5 mins  | 5     | 5 mins      |
| 15 mins | 15    | 15 mins     |

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
| Created    | 0     | A status that created in the registration process.   |
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

| Element   | Value | Description |
| --------- | ----- | ----------- |
| expense   | 0     | Expense     |
| deduction | 1     | Deduction   |

## InformationType

| Element                        | Value | Description                                  |
| ------------------------------ | ----- | -------------------------------------------- |
| Submit your attendance/expense | 0     | Information for propmting submission.        |
| Submission has submitted       | 1     | Information that submission has submitted.   |
| Submission has rejected        | 2     | Information that submission has rejected.    |
| Submission has approved        | 3     | Information that submission has approved.    |
| Payslips have been created     | 4     | Information that payslips have been created. |



