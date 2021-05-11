//import withAuth from '../middleware/auth'
import { useSession } from 'next-auth/client'
import Login from '../components/Login'
import Loading from '../components/Loading'

export default function Dashboard() {
	const [session, loading] = useSession()
	if (loading) return <Loading />
	if (!loading && !session) return <Login />

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session.user.email}</p>
		</div>
	)
}