import {
    createBrowserRouter,
    redirect,
    RouterProvider,
    Route,
    Link,
} from 'react-router-dom'
import AuthLayout from './components/AuthLayout'
import { UseAuthUser } from './hooks/useAuth'
import AttendanceRegistration from './pages/AttendanceRegistration'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

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
    return user ? redirect('/attendance_registration') : true
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
                path: 'attendance_registration',
                element: <AttendanceRegistration />,
                loader: guardLoader
            }, {
                path: '*',
                element: <NotFound />
            }
        ],

    }

])