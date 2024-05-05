import { createBrowserRouter, redirect } from 'react-router-dom'
import { UseAuthUser } from './hooks/useAuth'
import AttendanceRegistration from './pages/AttendanceRegistration'
import Login from './pages/Login'
import Test from './pages/Test'
 
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
	return user ? redirect('/') : true
}

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
        loader: guestLoader
    }, {
        path: '/',
        element: <AttendanceRegistration />,
        loader: guardLoader
    }, {
      path: '/test',
      element: <Test />
  }
])