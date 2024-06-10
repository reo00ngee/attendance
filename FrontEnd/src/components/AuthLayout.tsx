import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Header from './Header'
 
const AuthLayout: React.FC = () => {
	return (
		<div>
			<Header />
			<Outlet />
		</div>
	)
}
 
export default AuthLayout