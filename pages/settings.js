
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
import DeleteAccount from '../components/DeleteAccount'
const API_URL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api`

export default function Settings(props) {
	const [session, loading] = useSession()
	const [profileIsPublic, setProfileIsPublic] = useState(props.profileIsPublic)

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
					{email /* Can have `|| username` if that option is later implemented */}
				</p>
			</div>

			{/*
				A̶d̶d̶ o̶p̶t̶i̶o̶n̶ t̶o̶ m̶a̶k̶e̶ p̶r̶o̶f̶i̶l̶e̶ p̶u̶b̶l̶i̶c̶, then choose permanent URL extension w̶i̶t̶h̶
				t̶h̶e̶ u̶s̶e̶r̶n̶a̶m̶e̶ s̶u̶g̶g̶e̶s̶t̶e̶d̶ a̶s̶ b̶e̶f̶o̶r̶e̶ t̶h̶e̶ `̶@̶`̶ i̶n̶ t̶h̶e̶i̶r̶ e̶m̶a̶i̶l̶. Have a confirmation
				popup and indicate that it cannot be changed in the future, then once it's
				chosen disable the input box.
			*/}
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

			{/* Add a `Copy` button and make the input disabled after set */}
			<FormGroup>
				{/* TODO: Once this has been set once, make that the default value 
				and have this disabled regardless of checked status */}
				<Label for="profileURL">Profile URL</Label>
				<Input
					type="text"
					name="profileURL"
					id="profileURL"
					placeholder={defaultUsername}
					disabled={!profileIsPublic}
				/>
				{/* TODO: Use bootstrap validity classes for indicating if a username is available here */}

				{/* TODO: Display inline */}
				<Button id="setProfileUrl" /*outline*/ color="success" /*onClick={setProfileUrl}*/>Set URL</Button>
			</FormGroup>

			{/* Add granular controls to what information users choose to share */}

			{/* TODO: Display inline */}
			<Button id="signOut" onClick={signOut}>Sign out</Button>
			<DeleteAccount user={session.user} />
		</div>
	)
}

export async function getServerSideProps({ res, req }) {
	const session = await getSession({ req })
	if (!session) {
		res.setHeader("location", "/login")
		res.statusCode = 302
		res.end()
	}

	const userData = await fetch(`${API_URL}/account/profile_url?email=${session.user.email}`)
	const json = await userData.json()
  return {
    props: {
			profileIsPublic: json.profileIsPublic,
		},
  }
}