import { useSession } from 'next-auth/client'
import Login from '../components/Login'
import Loading from '../components/Loading'

export default function Profile() {
	// IDEA: Show option to edit profile if current user, show public profile if not
	const [session, loading] = useSession()
	if (loading) return <Loading />
	if (!loading && !session) return <Login />

	return (
		<div>
			<h1>Profile</h1>
			<p>Welcome {session.user.email}</p>
			<button onClick={signOut}>Sign out</button>
		</div>
	)
}