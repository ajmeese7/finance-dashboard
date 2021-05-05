import { signOut } from 'next-auth/client'

export default function Authenticated({ user }) {
	// NOTE: user.email is a unique selector that can be used across
	// various sign-in methods for data transfer
	return (
		<div>
			<p>You are authenticated {user.email}</p>
			<button onClick={signOut}>Sign Out</button>
		</div>
	)
}