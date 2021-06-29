
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { signOut, useSession, getSession } from 'next-auth/client'
import {
	Button,
	Form,
	FormGroup,
	Input,
	Label,
} from 'reactstrap'
import Login from '../components/Login'
import Loading from '../components/Loading'
import SetUsername from '../components/SetUsername'
import DeleteAccount from '../components/DeleteAccount'
const API_URL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api`

/** Codes to display username validity by the input box. */
const UsernameStates = Object.freeze({
	Null: 0,
	Available: 1,
	Taken: 2,
	TooShort: 3,
	TooLong: 4,
})

export default function Settings(props) {
	const [session, loading] = useSession()
	const [profileIsPublic, setProfileIsPublic] = useState(props.profileIsPublic)
	const [username, setUsername] = useState(props.username)
	const [usernameState, setUsernameState] = useState(UsernameStates.Null)

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

	/**
	 * Check for whether a username is valid and if it already 
	 * exists in the database.
	 */
	const validUsername = async (event) => {
		const username = event.target.value
		if (username.length == 0)
			return setUsernameState(UsernameStates.Null)
		if (username.length < 5)
			return setUsernameState(UsernameStates.TooShort)
		if (username.length > 15)
			return setUsernameState(UsernameStates.TooLong)

		const result = await fetch(`${API_URL}/account/profile_url?username=${username}`)
		const json = await result.json()
		return setUsernameState(Object.keys(json).length ?
			// https://stackoverflow.com/a/39565817/6456163
			UsernameStates.Taken : UsernameStates.Available
		)
	}

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
				<p className="d-inline-block">{username || email}</p>
			</div>

			<Form>
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

				<FormGroup className="m-0 d-inline-block p-0">
					<Label for="username">Username</Label>
					{/*<div style={{ display: "flex", flexDirection: "row" }}*/}
					<Input
						type="text"
						name="username"
						id="username"
						className={usernameState == UsernameStates.Available ?
							"is-valid" : usernameState !== UsernameStates.Null ? "is-invalid" : ""}
						placeholder={defaultUsername}
						defaultValue={username || undefined}
						onChange={validUsername}
						disabled={!profileIsPublic || username}
						required
					/>
					<UsernameFeedback usernameState={usernameState} />
				</FormGroup>

				{/* TODO: Make this display inline with the text input */}
				{!username &&
					<SetUsername
						email={session.user.email}
						profileIsPublic={profileIsPublic}
						username={username}
						setUsername={setUsername}
						usernameAvailable={usernameState == UsernameStates.Available}
					/>
				}
			</Form>

			{/* TODO: Add granular controls to what information users choose to share */}
			<div className="flex">
				<div className="m-1 d-inline-block">
					<Button id="signOut" onClick={signOut}>Sign out</Button>
				</div>
				<div className="m-1 d-inline-block">
					<DeleteAccount user={session.user} />
				</div>
			</div>
		</div>
	)
}

/** Tooltip explaining validity of username. */
const UsernameFeedback = ({ usernameState }) => {
	// Valid username that is available
	if (usernameState == UsernameStates.Available)
		return (
			<div className="valid-feedback">
				That username is available!
			</div>
		)
	
	return (
		<div className="invalid-feedback">
			{usernameState == UsernameStates.Taken &&
				"That username is taken!"}
			{usernameState == UsernameStates.TooShort &&
				"That username is too short!"}
			{usernameState == UsernameStates.TooLong &&
				"That username is too long!"}
		</div>
	)
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