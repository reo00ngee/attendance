import {
    createBrowserRouter,
    redirect,
    RouterProvider,
    Route,
    Link,
} from 'react-router-dom'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import AuthLayout from '../components/AuthLayout'
import { UseAuthUser } from '../hooks/useAuth'
import AttendanceRegistrationForDaily from '../pages/AttendanceRegistrationForDaily'
import AttendanceRegistrationForMonthly from '../pages/AttendanceRegistrationForMonthly'
import AttendanceManagement from '../pages/AttendanceManagement'
import UserRegistration from '../pages/UserRegistration'
import UserManagement from '../pages/UserManagement'
import HourlyWageGroupManagement from '../pages/HourlyWageGroupManagement'
import HourlyWageGroupRegistration from '../pages/HourlyWageGroupRegistration'

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
                path: '*',
                element: <NotFound />
            }
        ],

    }

])