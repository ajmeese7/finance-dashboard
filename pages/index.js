import Head from 'next/head'
import TickerSearch from '../components/TickerSearch'
import Login from '../components/Login'
import Loading from '../components/Loading'
import { signOut, useSession } from 'next-auth/client'

export default function Page(props) {
	const [session, loading] = useSession()
	if (loading) return <Loading />
	if (!loading && !session) return <Login />

	return (
		<div className="container">
			<Head>
				<title>Stocks Dashboard</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1>Dashboard</h1>
			<p>Welcome {session.user.email}</p>

			<TickerSearch />
		</div>
	)
}