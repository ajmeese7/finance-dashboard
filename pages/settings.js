
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { signOut, useSession, getSession } from 'next-auth/client'
import {
	Button,
	FormGroup,
	Input,
	Label,
} from 'reactstrap'
import Login from '../components/Login'
import Loading from '../components/Loading'
import SetUsername from '../components/SetUsername'
import DeleteAccount from '../components/DeleteAccount'
const API_URL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api`

export default function Settings(props) {
	const [session, loading] = useSession()
	const [profileIsPublic, setProfileIsPublic] = useState(props.profileIsPublic)
	const [username, setUsername] = useState(props.username)

	// Updates the server data when the user's profileIsPublic setting is modified
	useEffect(async () => {
		if (!session) return
		const res = await fetch(`${API_URL}/account/profile_url`, {
			method: 'post',
			body: JSON.stringify({
				email: session.user.email,
				profileIsPublic: profileIsPublic
			})
		})
	}, [profileIsPublic, session])

	// Prevents the page from rendering if no valid session present
	if (loading) return <Loading />
	if (!loading && !session) return <Login />

	// At this point the session is guaranteed valid
	const email = session.user.email
	const defaultUsername = email.split('@')[0]

	return (
		<div className="container">
			<Head>
				<title>Settings | Stocks Dashboard</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1>Settings</h1>
			<div>
				{/* Can also add the multiavatar PFP as an option for users with an existing PFP. */}
				<img
					className="profilePicture"
					alt={`${session.user.name || defaultUsername}'s profile picture`}
					title={`${session.user.name || defaultUsername}'s profile picture`}
					src={session.user.image || `https://api.multiavatar.com/${email}.png`}
				/>
				<p>
					{username || email}
				</p>
			</div>

			<FormGroup>
				<Input
					type="checkbox"
					name="publicProfile"
					id="publicProfile"
					checked={profileIsPublic}
					onChange={() => setProfileIsPublic(!profileIsPublic)}
				/>
				<Label for="publicProfile" className="ms-1 user-select-none">
					Make profile public
				</Label>
			</FormGroup>

			<FormGroup>
				<Label for="username">Username</Label>
				<Input
					type="text"
					name="username"
					id="username"
					placeholder={defaultUsername}
					defaultValue={username || undefined}
					disabled={!profileIsPublic || username}
				/>
				{/* TODO: Use bootstrap validity classes for indicating if a username is available here */}

				{/* TODO: Display inline */}
				{!username &&
					<SetUsername
						email={session.user.email}
						profileIsPublic={profileIsPublic}
						username={username}
						setUsername={setUsername}
					/>
				}
			</FormGroup>

			{/* Add granular controls to what information users choose to share */}

			{/* TODO: Display inline */}
			<Button id="signOut" onClick={signOut}>Sign out</Button>
			<DeleteAccount user={session.user} />
		</div>
	)
}

/** 
 * Check for whether a username is valid and if it already 
 * exists in the database.
 */
const validUsername = () => {

}

/** Generates props on the server before the page is served to the user. */
export async function getServerSideProps({ res, req }) {
	const session = await getSession({ req })
	if (!session) {
		res.setHeader("location", "/login")
		res.statusCode = 302
		res.end()
	}

	// TODO: Work on this file name
	const userData = await fetch(`${API_URL}/account/profile_url?email=${session.user.email}`)
	const json = await userData.json()
  return {
    props: {
			profileIsPublic: json.profileIsPublic,
			username: json.username,
		},
  }
}