# Use Case Description<!-- omit in toc -->

- [Administrator Login](#administrator-login)
- [Administrator Logout](#administrator-logout)
- [Password Recovery](#password-recovery)
- [Company Registration](#company-registration)
- [Company Management](#company-management)
- [User Login](#user-login)
- [User Logout](#user-logout)
- [Hourly Wage Group Management](#hourly-wage-group-management)
- [User Registration](#user-registration)
- [User Management](#user-management)
- [Attendance Registration](#attendance-registration)
- [Attendance Management](#attendance-management)
- [Commonly Used Expense Management](#commonly-used-expense-management)
- [Expense Registration](#expense-registration)
- [Expense Management](#expense-management)
- [Commonly Used Expense/Deduction Management](#commonly-used-expensededuction-management)
- [Expense/Deduction Management](#expensededuction-management)
- [Monthly Expense/Deduction Management](#monthly-expensededuction-management)
- [Information Management](#information-management)
- [Information Confirmation](#information-confirmation)
- [Setting Management](#setting-management)
- [Holiday Management](#holiday-management)
- [Attendance Closure](#attendance-closure)
- [Expense Closure](#expense-closure)
- [Payroll Data Management](#payroll-data-management)
- [Information Creation to Prompt Submission](#information-creation-to-prompt-submission)
- [User Created Information Status Toggle](#user-created-information-status-toggle)
- [Payroll Calculation](#payroll-calculation)



##  Administrator Login

| Element          | Content                                                                   |
| :--------------- | :------------------------------------------------------------------------ |
| Use Case Name    | Administrator Login                                                       |
| Actors           | Administrators                                                            |
| Trigger          | Administrator navigates to the login page.                                |
| Preconditions    | Administrator account is registered in the system.                        |
| Basic Flow       | 1. Administrator enters their credentials and presses "Log in" button.    |
|                  | 2. System validates the credentials.                                      |
|                  | 3. If valid credentials are entered, system grants access.                |
| Alternative Flow | 3a. If invalid credentials are entered, system displays an error message. |
| Postconditions   | Administrator is successfully logged into the system.                     |
| Remarks          |                                                                           |

## Administrator Logout

| Element          | Content                                           |
| :--------------- | :------------------------------------------------ |
| Use Case Name    | Administrator Logout                              |
| Actors           | Administrators                                    |
| Trigger          | Administrator presses "Log out" button.           |
| Preconditions    | Administrator is logged into the system.          |
| Basic Flow       | 1. System terminates the administrator session.   |
|                  | 2. Administrator is redirected to the login page. |
| Alternative Flow | - None                                            |
| Postconditions   | Administrator is successfully logged out.         |
| Remarks          |                                                   |

## Password Recovery

| Element          | Content                                                                                     |
| :--------------- | :------------------------------------------------------------------------------------------ |
| Use Case Name    | Password Recovery                                                                           |
| Actors           | Administrators and all users                                                                |
| Trigger          | They click on the "Forgot Password?" link on the login page.                                |
| Preconditions    | Their account is registered in the system.                                                  |
| Basic Flow       | 1. System prompts them to enter the email address associated with the account.              |
|                  | 2. They enter the email address and submit the form.                                        |
|                  | 3. System verifies the email address and sends a password reset link to the provided email. |
|                  | 4. They check their email and click on the password reset link.                             |
|                  | 5. System validates the link and allows them to reset their password.                       |
| Alternative Flow | 2a. If the entered email address is not registered, the system displays an error message.   |
|                  | 5a. If the password reset link is invalid or expired, the system prompts for re-submission. |
| Postconditions   | They successfully reset their password and can log in with the new credentials.             |
| Remarks          |                                                                                             |


## Company Registration

| Element          | Content                                                                          |
| :--------------- | :------------------------------------------------------------------------------- |
| Use Case Name    | Company Registration                                                             |
| Actors           | Administrators                                                                   |
| Trigger          | Administrator navigates to "Company Registration" option.                        |
| Preconditions    | Administrator is logged into the system.                                         |
| Basic Flow       | 1. System presents a form for company registration.                              |
|                  | 2. Administrator enters company details and first user granted all roles.        |
|                  | 3. Administrator presses "Save" button.                                          |
|                  | 4. If valid data are entered, system displays an success message.                |
| Alternative Flow | 4a. If invalid data are entered, system displays an error message.               |
| Postconditions   | Company data is created, and an email is sent to the user for the initial login. |
| Remarks          |                                                                                  |

## Company Management

| Element          | Content                                                                    |
| :--------------- | :------------------------------------------------------------------------- |
| Use Case Name    | Company Management                                                         |
| Actors           | Administrators                                                             |
| Trigger          | Administrator navigates to "Company Management" option.                    |
| Preconditions    | Administrator is logged into the system.                                   |
| Basic Flow       | 1. System presents the list of companies.                                  |
|                  | 2. Administrator selects a company.                                        |
|                  | 3. System displays the details of the selected company.                    |
|                  | 4. Administrator modifies the company details and presses "Save" button.   |
|                  | 5. If valid data are entered, system displays an success message.          |
|                  | 6. Administrator presses "Delete" button.                                  |
|                  | 7. System presets confirm dialog and after system presents confirm dialog. |
| Alternative Flow | 5a. If invalid data are entered, system displays an error message.         |
| Postconditions   | Company data is updated or deleted.                                        |
| Remarks          |                                                                            |

## User Login

| Element          | Content                                                                       |
| :--------------- | :---------------------------------------------------------------------------- |
| Use Case Name    | User Login                                                                    |
| Actors           | All Users                                                                     |
| Trigger          | User navigates to the login page.                                             |
| Preconditions    | User account is registered in the system.                                     |
| Basic Flow       | 1. User enters their credentials and presses "Log in" button.                 |
|                  | 2. System validates the credentials.                                          |
|                  | 3. If valid credentials are entered, system grants access.                    |
| Alternative Flow | 3a. If invalid credentials are entered, system displays an error message.     |
| Postconditions   | User is successfully logged into the system.                                  |
| Remarks          | User roles determine the level of access and functionality within the system. |

## User Logout

| Element          | Content                                  |
| :--------------- | :--------------------------------------- |
| Use Case Name    | User Logout                              |
| Actors           | All Users                                |
| Trigger          | User presses "Log out" button.           |
| Preconditions    | User is logged into the system.          |
| Basic Flow       | 1. System terminates the user session.   |
|                  | 2. User is redirected to the login page. |
| Alternative Flow | - None                                   |
| Postconditions   | User is successfully logged out.         |
| Remarks          |                                          |

## Hourly Wage Group Management

| Element          | Content                                                                       |
| :--------------- | :---------------------------------------------------------------------------- |
| Use Case Name    | Hourly Wage Group Management                                                  |
| Actors           | User Management(UM)                                                           |
| Trigger          | UM navigates to "Hourly Wage Group Management" option.                        |
| Preconditions    | UM is logged into the system.                                                 |
| Basic Flow       | 1. System presents the list of existing wage groups.                          |
|                  | 2. UM selects the wage group for modification or press "Create" button.       |
|                  | 3. System presents a form for hourly wage group modification or registration. |
|                  | 4. UM enter hourly wage group details and presses "Save" button.              |
|                  | 5. If valid data are entered, system displays an success message.             |
| Alternative Flow | 5a. If invalid data are entered, system displays an error message.            |
| Postconditions   | Hourly wage group data is created or updated.                                 |
| Remarks          | registered data uses for User Registration.                                   |

## User Registration

| Element          | Content                                                                       |
| :--------------- | :---------------------------------------------------------------------------- |
| Use Case Name    | User Registration                                                             |
| Actors           | User Management(UM)                                                           |
| Trigger          | UM navigates to "User Registration" option.                                   |
| Preconditions    | UM is logged in the system.                                                   |
| Basic Flow       | 1. System presents a form for user registration.                              |
|                  | 2. UM enters user details and presses "Save" button.                          |
|                  | 3. If valid data are entered, system displays an success message.             |
| Alternative Flow | 3a. If invalid data are entered, system displays an error message.            |
| Postconditions   | User data is created, and an email is sent to the user for the initial login. |
| Remarks          |                                                                               |

## User Management

| Element          | Content                                                                    |
| :--------------- | :------------------------------------------------------------------------- |
| Use Case Name    | User Management                                                            |
| Actors           | User Management(UM)                                                        |
| Trigger          | UM navigates to "User Management" option.                                  |
| Preconditions    | UM is logged into the system.                                              |
| Basic Flow       | 1. System presents the list of users.                                      |
|                  | 2. UM selects a User.                                                      |
|                  | 3. System displays the details of the selected User.                       |
|                  | 4. UM modifies the User details and presses "Save" button.                 |
|                  | 5. If valid data are entered, system displays an success message.          |
|                  | 6. UM presses "Delete" button.                                             |
|                  | 7. System presets confirm dialog and after system presents confirm dialog. |
| Alternative Flow | 5a. If invalid data are entered, system displays an error message.         |
| Postconditions   | User data is updated or deleted.                                           |
| Remarks          |                                                                            |

## Attendance Registration

| Element          | Content                                                                                         |
| :--------------- | :---------------------------------------------------------------------------------------------- |
| Use Case Name    | Attendance Registration                                                                         |
| Actors           | Attendance and Expense Registration(AER), Attendance Management(AM)                             |
| Trigger          | AER logs in to the system.                                                                      |
| Preconditions    | AER is registered in the system                                                                 |
| Basic Flow       | 1. AER presses the "Start Work" button.                                                         |
|                  | 2. system records the work start time and displays the AER's attendance time for today.         |
|                  | 3. AER presses the "Start Break" button.                                                        |
|                  | 4. System records the break start time and displays the AER's attendance time for today.        |
|                  | 5. AER presses the "End Break" button.                                                          |
|                  | 6. System records the break end time and displays the AER's attendance time for today.          |
|                  | 7. AER presses the "End Work" button.                                                           |
|                  | 8. System records the work end time and displays the AER's attendance time for today.           |
|                  | 9. AER switches "Modify" to ON.                                                                 |
|                  | 10. AER modifies or manually enters time entries as needed.                                     |
|                  | 11. AER presses the "Save" button.                                                              |
|                  | 12. System records time entries AER enters.                                                     |
|                  | 13. AER navigates to "All Attendance Registration" option.                                      |
|                  | 14. System presents the list of the login user's attendance for this month.                     |
|                  | 15. AER makes sure they have registered all attendance and press "Submit" button.               |
| Alternative Flow | 15a. AER forgets to submit their attendance, system prompts the AER to submit their attendance. |
| Postconditions   | 1. Attendance request is stored in the system.                                                  |
|                  | 2. Information with the 'Submitted' InformationType is created for AM.                                           |
| Remarks          | The "Modify Switch" allows both editing and manual entry of time entries.                       |

## Attendance Management

| Element          | Content                                                                                                 |
| :--------------- | :------------------------------------------------------------------------------------------------------ |
| Use Case Name    | Attendance Management                                                                                   |
| Actors           | Attendance Management(AM), Attendance and Expense Registration(AER)                                     |
| Trigger          | AM navigates to "Attendance Management" option.                                                         |
| Preconditions    | 1. AM is is logged into the system.                                                                     |
|                  | 2. AER has submitted an attendance request.                                                             |
| Basic Flow       | 1. System presents the list of users.                                                                   |
|                  | 2. AM selects a user .                                                                                  |
|                  | 3. System presents the selected user's Attendance request.                                              |
|                  | 4. AM reviews and approves/rejects the request.                                                         |
| Alternative Flow | - None                                                                                                  |
| Postconditions   | 1. If approved, SubmissionStatus of the Attendance data is updated to 'Approved'.                       |
|                  | 2. If approved, Information with the 'Approved' InformationType is created for AER.                     |
|                  | 1a. If rejected, SubmissionStatus of the Attendance data is updated to 'Rejected'.                      |
|                  | 2a. If rejected, Information with the 'Rejected' InformationType is created for AER.                    |
| Remarks          | Attendance Closure cannot be performed unless all AER's attendance stats for that month are "Approved". |

## Commonly Used Expense Management

| Element          | Content                                                                             |
| :--------------- | :---------------------------------------------------------------------------------- |
| Use Case Name    | Commonly Used Expenses Management                                                   |
| Actors           | Attendance and Expense Registration(AER)                                            |
| Trigger          | AER navigates to "Commonly Used Expense Management" option.                         |
| Preconditions    | Employee is logged into the system.                                                 |
| Basic Flow       | 1. System presents the list of commonly used expense.                               |
|                  | 2. AER selects the commonly used expense for modification or press "Create" button. |
|                  | 3. System presents a form for commonly used expense modification or registration.   |
|                  | 4. AER enter hourly commonly used expense details and presses "Save" button.        |
|                  | 5. If valid data are entered, system displays an success message.                   |
| Alternative Flow | 5a. If invalid data are entered, system displays an error message.                  |
| Postconditions   | Commonly used expense data is created or updated.                                   |
| Remarks          | registered data uses for Expense Registration.                                      |

## Expense Registration

| Element          | Content                                                                                                                                   |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| Use Case Name    | Expense Registration                                                                                                                      |
| Actors           | Attendance and Expense Registration(AER), Finance Management(FM)                                                                          |
| Trigger          | AER navigates to "Expense Registration" option.                                                                                           |
| Preconditions    | 1. AER is logged in the system                                                                                                            |
|                  | 2. AER has incurred eligible work-related expenses.                                                                                       |
| Basic Flow       | 1. System presents a form for expense entry.                                                                                              |
|                  | 2. AER registers their expenses in a lump or if they want to register more detailed data, registers the expenses from the details screen. |
|                  | 3. AER makes sure they have registered all expenses and press "Submit" button.                                                            |
| Alternative Flow | 2a. If invalid data are entered, system displays an error message.                                                                        |
|                  | 3a. AER recognizes that there was a omission in the expense registration, after submitting the expense registration.                      |
|                  | - AER press "Modify Expense" button, they can return to the state before pressing "Submit" button.                                        |
|                  | 3b. AER forgets to submit an expense request, system prompts them to submit an expense request.                                           |
| Postconditions   | 1. Expense request is stored in the system.                                                                                               |
|                  | 2. Information with the 'Submitted' InformationType is created for FM.                                                                    |
| Remarks          |                                                                                                                                           |

## Expense Management

| Element          | Content                                                                                           |
| :--------------- | :------------------------------------------------------------------------------------------------ |
| Use Case Name    | Expense Management                                                                                |
| Actors           | Finance Management(FM), Attendance and Expense Registration(AER)                                  |
| Trigger          | FM navigates to "Expense Management" option.                                                      |
| Preconditions    | 1. FM is logged in the system.                                                                    |
|                  | 2. AER has submitted an expenses request.                                                         |
| Basic Flow       | 1. System presents the list of AERs that has submitted the expense request.                       |
|                  | 2. FM selects a AER.                                                                              |
|                  | 3. System presents the selected AER's expense request.                                            |
|                  | 4. FM reviews and approves/rejects the request.                                                   |
| Alternative Flow | - None                                                                                            |
| Postconditions   | 1. If approved, SubmissionStatus of the Expense data is updated to 'Approved'.                    |
|                  | 2. If approved, Information with the 'Approved' InformationType is created for AER.               |
|                  | 1a. If rejected, SubmissionStatus of the Expense data is updated to 'Rejected'.                   |
|                  | 2a. If rejected, Information with the 'Rejected' InformationType is created for AER.              |
| Remarks          | Expense Closure cannot be performed unless all AER's expense stats for that month are "Approved". |

## Commonly Used Expense/Deduction Management

| Element          | Content                                                                                      |
| :--------------- | :------------------------------------------------------------------------------------------- |
| Use Case Name    | Commonly Used Expense/Deduction Management                                                   |
| Actors           | Finance Management(FM)                                                                       |
| Trigger          | FM navigates to "Commonly Used Expense/Deduction Management" option.                         |
| Preconditions    | FM is logged into the system.                                                                |
| Basic Flow       | 1. System presents the list of commonly used expense/deduction.                              |
|                  | 2. FM selects the commonly used expense/deduction for modification or press "Create" button. |
|                  | 3. System presents a form for commonly used expense/deduction modification or registration.  |
|                  | 4. FM enter hourly commonly used expense/deduction details and presses "Save" button.        |
|                  | 5. If valid data are entered, system displays an success message.                            |
| Alternative Flow | 5a. If invalid data are entered, system displays an error message.                           |
| Postconditions   | Commonly used expense/deduction data is created or updated.                                  |
| Remarks          | registered data uses for Expense/Deduction Management.                                       |

## Expense/Deduction Management

| Element          | Content                                                                  |
| :--------------- | :----------------------------------------------------------------------- |
| Use Case Name    | Expense/Deduction Management                                             |
| Actors           | Finance Management(FM)                                                   |
| Trigger          | FM navigates to "Expense/Deduction Management" option.                   |
| Preconditions    | FM is logged into the system.                                            |
| Basic Flow       | 1. System presents the list of users.                                    |
|                  | 2. FM selects the user.                                                  |
|                  | 3. System presents a form for expense or deduction for the user.         |
|                  | 4. FM enter expense or deduction for the user and presses "Save" button. |
|                  | 5. If valid data are entered, system displays an success message.        |
| Alternative Flow | 5a. If invalid data are entered, system displays an error message.       |
| Postconditions   | Expense or deduction is created or updated.                              |
| Remarks          |                                                                          |

## Monthly Expense/Deduction Management

| Element          | Content                                                                            |
| :--------------- | :--------------------------------------------------------------------------------- |
| Use Case Name    | Monthly Expense/Deduction Management                                               |
| Actors           | Finance Management(FM)                                                             |
| Trigger          | FM navigates to "Monthly Expense/Deduction Management" option.                     |
| Preconditions    | FM is logged into the system.                                                      |
| Basic Flow       | 1. System presents the list of users.                                              |
|                  | 2. FM selects the user.                                                            |
|                  | 3. System presents a form for monthly expense or deduction for the user.           |
|                  | 4. FM enter monthly expense or deduction for the user and presses "Save" button.   |
|                  | 5. If valid data are entered, system displays an success message.                  |
| Alternative Flow | 5a. If invalid data are entered, system displays an error message.                 |
| Postconditions   | Monthly expense or deduction is created or updated.                                |
| Remarks          | Registered data will be automatically recorded on the closing date of every month. |

## Information Management

| Element          | Content                                                                                        |
| :--------------- | :--------------------------------------------------------------------------------------------- |
| Use Case Name    | Information Management                                                                         |
| Actors           | Attendance Management(AM), Finance Management(FM), User Management(UM), Setting Management(SM) |
| Trigger          | They navigate to "Information Management" option.                                              |
| Preconditions    | They are logged into the system.                                                               |
| Basic Flow       | 1. System presents the list of user created information.                                       |
|                  | 2. They select the user created information for modification or press "Create" button.         |
|                  | 3. System presents a form for user created information modification or registration.           |
|                  | 4. They enter user created information details and presses "Save" button.                      |
|                  | 5. If valid data are entered, system displays an success message.                              |
| Alternative Flow | 5a. If invalid data are entered, system displays an error message.                             |
| Postconditions   | User created information data is created or updated.                                           |
| Remarks          |                                                                                                |

## Information Confirmation

| Element          | Content                                                   |
| ---------------- | --------------------------------------------------------- |
| Use Case Name    | Information Confirmation                                  |
| Actors           | All Users                                                 |
| Trigger          | User selects the "Check Information" option.              |
| Preconditions    | User is logged into the system.                           |
| Basic Flow       | 1. System presents the list of information user recieved. |
|                  | 2. User selects a information.                            |
|                  | 3. System presents the information details.               |
| Alternative Flow | - None                                                    |
| Postconditions   | User confirms information.                                |
| Remarks          |                                                           |

## Setting Management

| Element          | Content                                                            |
| :--------------- | :----------------------------------------------------------------- |
| Use Case Name    | Setting Management                                                 |
| Actors           | Setting Management (SM)                                            |
| Trigger          | SM navigates to "Setting Management" option.                 |
| Preconditions    | 1. SM is logged in the system.                                     |
|                  | 2. System settings are in need of update.                          |
| Basic Flow       | 1. System presents a form for setting management.            |
|                  | 3. SM edit setting and press "Save" button.                        |
|                  | 4. If valid data are entered, system displays an success message.  |
| Alternative Flow | 4a. If Invalid data are entered, system displays an error message. |
| Postconditions   | Company data is updated.                                              |
| Remarks          |                                                                    |

## Holiday Management

| Element          | Content                                                            |
| :--------------- | :----------------------------------------------------------------- |
| Use Case Name    | Holiday Management                                                 |
| Actors           | Setting Management (SM)                                            |
| Trigger          | SM navigates to "Holiday Management" option.                       |
| Preconditions    | 1. SM is logged in the system.                                     |
| Basic Flow       | 1. System presents a form for holiday management.                  |
|                  | 3. SM edit holiday and press "Save" button.                        |
|                  | 4. If valid data are entered, system displays an success message.  |
| Alternative Flow | 4a. If Invalid data are entered, system displays an error message. |
| Postconditions   | Holiday data is updated.                                           |
| Remarks          |                                                                    |

## Attendance Closure

| Element          | Content                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| Use Case Name    | Attendance Closure                                                                               |
| Actors           | Attendance Management (AM)                                                                       |
| Trigger          | AM navigates to "Attendance Management" option.                                                  |
| Preconditions    | 1. AM is logged in the system.                                                                   |
|                  | 2. Attendance data requires closure.                                                             |
| Basic Flow       | 1. System presents Attendance Management page.                                                   |
|                  | 3. AM presses "Attendance Closure" button.                                                       |
|                  | 4. If there is no problem, system updates attendance_ready to true.                              |
| Alternative Flow | 4a. If there is data submission_status is rejected or created, system displays an error message. |
| Postconditions   | attendance_ready is true.                                                                        |
| Remarks          | attendance_ready and expense_ready is true, system execute Payroll Calculation at night.         |

## Expense Closure

| Element          | Content                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| Use Case Name    | Expense Closure                                                                                  |
| Actors           | Finance Management (FM)                                                                          |
| Trigger          | FM navigates to "Expense Management" option.                                                     |
| Preconditions    | 1. FM is logged in the system.                                                                   |
|                  | 2. Expense data requires closure.                                                                |
| Basic Flow       | 1. System presents Expense Management page.                                                      |
|                  | 3. FM presses "Expense Closure" button.                                                          |
|                  | 4. If there is no problem, system updates expense_ready to true.                                 |
| Alternative Flow | 4a. If there is data submission_status is rejected or created, system displays an error message. |
| Postconditions   | expense_ready is true.                                                                           |
| Remarks          | expense_ready and expense_ready is true, system execute Payroll Calculation at night.            |

## Payroll Data Management

| Element          | Content                                                                                         |
| :--------------- | :---------------------------------------------------------------------------------------------- |
| Use Case Name    | Payroll Data Management                                                                         |
| Actors           | Finance Management (FM)                                                                         |
| Trigger          | FM navigates to "Payroll Data Management" option.                                               |
| Preconditions    | FM is logged into the system.                                                                   |
| Basic Flow       | 1. System presents the list of the user's payroll data for this month.                          |
|                  | 2. FM makes sure user's payrolls are correct and presses "Send Payslips" button.                |
|                  | 3. System sends an email with payslips attached to all users.                                   |
| Alternative Flow | 4a. If there are incorrect user's payrolls, modify data and presses "Calculate Payroll" button. |
| Postconditions   | Email with payslips attached is sent.                                                           |
| Remarks          |                                                                                                 |

## Information Creation to Prompt Submission

| Element          | Content                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| Use Case Name    | Information Creation to Prompt Submission                                                                             |
| Actors           | System, Attendance and Expense Registration(AER)                                                                      |
| Trigger          | Scheduled to run daily at 2:00 AM.                                                                                    |
| Preconditions    | - None                                                                                                                |
| Basic Flow       | 1. System generates information to prompt AERs with pending submissions.                                              |
| Alternative Flow | 1a. If an error occurs during processing:                                                                             |
|                  | 1. The system logs detailed error information.                                                                        |
|                  | 2. The system sends notifications to relevant personnel about the failure.                                            |
|                  | 3. The system attempts a predetermined number of retries.                                                             |
|                  | 4. If retries are successful, The system sends notifications to relevant personnel about the success.                 |
| Postconditions   | Information with the 'Propmting Submission' InformationType is created for AER.                                       |
| Remarks          | If the system developer receives a notification about the failure, they should resolve the error as soon as possible. |

## User Created Information Status Toggle

| Element          | Content                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| Use Case Name    | User Created Information Status Toggle                                                                                |
| Actors           | System                                                                                                                |
| Trigger          | Scheduled to run every minute.                                                                                        |
| Preconditions    | User created information is registered in the system                                                                  |
| Basic Flow       | 1. System toggles the is_active of the Information between true and false.                                            |
| Alternative Flow | 1a. If an error occurs during processing:                                                                             |
|                  | 1. The system logs detailed error information.                                                                        |
|                  | 2. The system sends notifications to relevant personnel about the failure.                                            |
|                  | 3. The system attempts a predetermined number of retries.                                                             |
|                  | 4. If retries are successful, The system sends notifications to relevant personnel about the success.                 |
| Postconditions   | Information's is_active toggles between true and false.                                                               |
| Remarks          | If the system developer receives a notification about the failure, they should resolve the error as soon as possible. |

## Payroll Calculation

| Element          | Content                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Use Case Name    | Payroll Calculation                                                                                                      |
| Actors           | System                                                                                                                   |
| Trigger          | Scheduled to run every day.                                                                                              |
| Preconditions    | Companies with both attendance_ready and expense_ready columns set to true is exists.                                    |
| Basic Flow       | 1. System obtains the data necessary for payroll calculation and calculates it.                                          |
| Alternative Flow | 1a. If an error occurs during processing:                                                                                |
|                  | 1. The system logs detailed error information.                                                                           |
|                  | 2. The system sends notifications to relevant personnel about the failure.                                               |
|                  | 3. The system attempts a predetermined number of retries.                                                                |
|                  | 4. If retries are successful, The system sends notifications to relevant personnel about the success.                    |
| Postconditions   | 1. payslip_contents data is created.                                                                                     |
| Postconditions   | 2. Information with the 'Payslips have been created' InformationType is created for FM.                                  |
| Remarks          | 1. If the system developer receives a notification about the failure, they should resolve the error as soon as possible. |
|                  | 2. After this process succeeds, the results of the calculation are reflected in the Payroll Data Management.             |