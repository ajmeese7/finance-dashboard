import { getSession } from 'next-auth/client'
import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'
const handler = nextConnect()
handler.use(middleware)
const collectionName = 'users'

// Searches for user by email or username, depending on which
// URL parameter is passed
handler.get(async (req, res) => {
	// TODO: Verify session here?
	const email = req.query.email,
	      username = req.query.username
	const searchQuery = email ? { user: email } : { username: username }
	const result = await req.db.collection(collectionName)
		.findOne(searchQuery, {
			profileIsPublic: 1,
			username: 1,
		})

	// Returns good request with no data if username is available
	if (result === null) return res.json({})
	res.json({
		profileIsPublic: result.profileIsPublic,
		username: result.username,
	})
})

handler.post(async (req, res) => {
	const data = JSON.parse(req.body)
	const email = data.email,
	      profileIsPublic = data.profileIsPublic,
				username = data.username
	const session = await getSession({ req })

	if (!session || session.user.email != email)
		return res.status(403).json({
			message: 'You must be signed in to modify account data',
		})
	
	let result = await req.db.collection(collectionName).updateOne(
		{ user: email },
		{ $set: username ?
			// Sets username if available and profileIsPublic if not
			{ username: username } :
			{ profileIsPublic: profileIsPublic }
		},
	)

	res.json({message: `${result.modifiedCount} document(s) was/were updated.`})
})

export default handler