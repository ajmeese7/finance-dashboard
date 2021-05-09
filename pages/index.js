import Head from 'next/head'
import TickerSearch from '../components/TickerSearch'
import { signIn, signOut, useSession } from 'next-auth/client'

// TODO: Once this is done, try to break my own security with the
// session manager tool
export default function Page(props) {
	const [session, loading] = useSession()

	// TODO: Should this be replaced with the method in `profile.js`?
		// Also the same TODO, add a custom loader...
	if (loading) {
		return <p>Loading...</p>
	}

	return (
		<div className="container">
			<Head>
				<title>Stocks Dashboard</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{!session && signIn()}
			{session && (
				<>
					Signed in as {session.user.email} <br />
					<button onClick={signOut}>Sign out</button>

					<TickerSearch />
				</>
			)}
		</div>
	)
}