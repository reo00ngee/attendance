import React, { useState } from 'react'
import { UseLogin } from '../queryClient'
 
const Login: React.FC = () => {
	const login = UseLogin()
 
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
 
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
 
		login.mutate({
			email: email,
			password: password,
		})
	}
 
	return (
		<div>
			<h1>ログイン</h1>
			<form onSubmit={onSubmit}>
				<fieldset>
					<div>
						<label htmlFor="email">メールアドレス：</label>
						<input
							type="email"
							id="email"
							onChange={e => setEmail(e.target.value)}
							defaultValue={email}
						/>
					</div>
					<div>
						<label htmlFor="password">パスワード：</label>
						<input
							type="password"
							id="password"
							onChange={e => setPassword(e.target.value)}
							defaultValue={password}
						/>
					</div>
					<button type="submit">送信</button>
				</fieldset>
			</form>
		</div>
	)
}
 
export default Login