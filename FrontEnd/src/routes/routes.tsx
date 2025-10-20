import {
    createBrowserRouter,
    redirect,
} from 'react-router-dom'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import AuthLayout from '../components/AuthLayout'
import { UseAuthUser } from '../hooks/useAuth'
import AttendanceRegistrationForDaily from '../pages/AttendanceRegistrationForDaily'
import AttendanceRegistrationForMonthly from '../pages/AttendanceRegistrationForMonthly'
import AttendanceManagement from '../pages/AttendanceManagement'
import AttendanceApproval from '../pages/AttendanceApproval'
import ExpenseRegistration from '../pages/ExpenseRegistration'
import ExpenseAndDeductionManagement from '../pages/ExpenseAndDeductionManagement'
import ExpenseAndDeductionRegistration from '../pages/ExpenseAndDeductionRegistration'
import ExpenseApproval from '../pages/ExpenseApproval'
import UserRegistration from '../pages/UserRegistration'
import UserManagement from '../pages/UserManagement'
import HourlyWageGroupManagement from '../pages/HourlyWageGroupManagement'
import HourlyWageGroupRegistration from '../pages/HourlyWageGroupRegistration'
import SettingManagement from '../pages/SettingManagement'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import AdminLogin from '../pages/AdminLogin'
import AdminRegistration from '../pages/AdminRegistration'
import AdminDashboard from '../pages/AdminDashboard'
import AdminManagement from '../pages/AdminManagement'
import AdminUserRegistration from '../pages/AdminUserRegistration'
import AdminUserManagement from '../pages/AdminUserManagement'
import AdminCompanyRegistration from '../pages/AdminCompanyRegistration'
import AdminCompanyManagement from '../pages/AdminCompanyManagement'
import AdminLayout from '../components/AdminLayout'


/**
 * ログイン済みのみアクセス可能
 */
const guardLoader = async () => {
    const user = await UseAuthUser()
    return user ? true : redirect('/login')
}

/**
 * ログインしていない場合のみアクセス可能
 */
const guestLoader = async () => {
    const user = await UseAuthUser()
    return user ? redirect('/attendance_registration_for_daily') : true
}

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
        loader: guestLoader
    }, {
        path: '/forgot-password',
        element: <ForgotPassword />,
        loader: guestLoader
    }, {
        path: '/reset-password',
        element: <ResetPassword />,
        loader: guestLoader
    }, {
        path: '/admin/login',
        element: <AdminLogin />,
    }, {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                path: 'registration',
                element: <AdminRegistration />,
            },
            {
                path: 'dashboard',
                element: <AdminDashboard />,
            },
            {
                path: 'management',
                element: <AdminManagement />,
            },
            {
                path: 'user_registration',
                element: <AdminUserRegistration />,
            },
            {
                path: 'user_management',
                element: <AdminUserManagement />,
            },
            {
                path: 'company_registration',
                element: <AdminCompanyRegistration />,
            },
            {
                path: 'company_management',
                element: <AdminCompanyManagement />,
            },
        ],
    }, {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: 'attendance_registration_for_daily',
                element: <AttendanceRegistrationForDaily />,
                loader: guardLoader
            },
            {
                path: 'attendance_registration_for_monthly',
                element: <AttendanceRegistrationForMonthly />,
                loader: guardLoader
            }, {
                path: 'attendance_management',
                element: <AttendanceManagement />,
                loader: guardLoader
            }, {
                path: 'attendance_approval',
                element: <AttendanceApproval />,
                loader: guardLoader
            }, {
                path: 'expense_registration',
                element: <ExpenseRegistration />,
                loader: guardLoader
            }, {
                path: 'expense_and_deduction_management',
                element: <ExpenseAndDeductionManagement />,
                loader: guardLoader
            }, {
                path: 'expense_approval',
                element: <ExpenseApproval />,
                loader: guardLoader
            }, {
                path: 'expense_and_deduction_registration',
                element: <ExpenseAndDeductionRegistration />,
                loader: guardLoader
            }, {
                path: 'user_registration',
                element: <UserRegistration />,
                loader: guardLoader
            }, {
                path: 'user_management',
                element: <UserManagement />,
                loader: guardLoader
            }, {
                path: 'hourly_wage_group_management',
                element: <HourlyWageGroupManagement />,
                loader: guardLoader
            }, {
                path: 'hourly_wage_group_registration',
                element: <HourlyWageGroupRegistration />,
                loader: guardLoader
            }, {
                path: 'setting_management',
                element: <SettingManagement />,
                loader: guardLoader
            }, {
                path: '*',
                element: <NotFound />
            }
        ],

    }

])