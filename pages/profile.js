import { useSession } from 'next-auth/client'
import dynamic from 'next/dynamic'

const UnauthenticatedComponent = dynamic(() =>
	import('../components/unauthenticated')
)
const AuthenticatedComponent = dynamic(() =>
	import('../components/authenticated')
)

export default function Profile() {
	const [session, loading] = useSession()

	// TODO: Custom loader
	if (typeof window !== 'undefined' && loading) return <p>Loading...</p>

	// TODO: Render into login screen here (with the `auto-created` option)
	// and have all this display after the regular landing site
	if (!session) return <UnauthenticatedComponent />

	return <AuthenticatedComponent user={session.user} />
}