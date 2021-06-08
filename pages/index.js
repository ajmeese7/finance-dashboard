import Head from 'next/head'
import TickerSearch from '../components/TickerSearch'
import Login from '../components/Login'
import Loading from '../components/Loading'
import { useSession, getSession } from 'next-auth/client'
const API_URL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api`

export default function Page(props) {
	const [session, loading] = useSession() // await getSession()
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

			<TickerSearch trackedTickers={props.trackedTickers} />
		</div>
	)
}

export async function getServerSideProps(context) {
	const session = await getSession(context)
	if (!session) {
		res.setHeader("location", "/login")
		res.statusCode = 302
		res.end()
	}

	// Run a put request to ensure the user account data is created if it
	// doesn't already exist
	const res = await fetch(`${API_URL}/account/info`, {
		method: 'put',
		body: JSON.stringify({
			email: session.user.email,
		})
	})

	const tickerData = await fetch(`${API_URL}/tracked_tickers?email=${session.user.email}`)
	const json = await tickerData.json()
  return {
    props: {
			trackedTickers: json.trackedTickers,
		},
  }
}