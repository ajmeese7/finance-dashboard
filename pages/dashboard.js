import { getSession } from 'next-auth/client'

export default function Dashboard({ user }) {
	// TODO: See what it says in that slight flash, and how to prevent it from happening;
		// on /dashboard navigation when no session
	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {user.email}</p>
		</div>
	)
}

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx)
	if (!session) {
		// Automatically redirects user to main page if no session
		ctx.res.writeHead(302, { Location: '/' })
		ctx.res.end()
		return { props: {} }
	}

	return {
		props: {
			user: session.user,
		},
	}
}