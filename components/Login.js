import { signIn } from 'next-auth/client'

export default function Login() {
	signIn()

	// TODO: Return a custom login UI
	return <>
		<p>Login here!</p>
	</>
}