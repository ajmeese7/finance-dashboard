import { getSession } from 'next-auth/client'
import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'
const handler = nextConnect()
handler.use(middleware)
const collectionName = 'users'

// Initially create account
handler.put(async (req, res) => {
	const data = JSON.parse(req.body)
	const email = data.email

	/*const session = await getSession({ req })
	if (!session || session.user.email != email)
		return res.status(403).json({
			message: 'You must be signed in to create an account',
		})*/

	// Creates initial blank data schema for user
	const result = await req.db.collection(collectionName).updateOne(
		{ user: email },
		{ $setOnInsert: {
			// Will only run if the user hasn't been inserted yet
			profileIsPublic: false,
			username: null,
			trackedTickers: [],
		}},
		{ upsert: true }
	)

	const accountCreated = result.modifiedCount > 0
	return res.status(200).json({
		message: accountCreated ? 'User account created!' : 'User account already exists!',
	})
});

// Get all the admin data about an account
handler.get(async (req, res) => {
	const email = req.query.email
	const session = await getSession({ req })

	if (!session || session.user.email != email) {
		return res.status(403).json({
			message: 'You must be signed in to get account data',
		})
	}

	const accountData = await req.db.collection(collectionName)
		.findOne({ user: email }, {
			_id: 0,
			profileIsPublic: 1,
			username: 1,
		})
	
	res.json({
		profileIsPublic: accountData.profileIsPublic,
		username: accountData.username
	})
})

// Delete all account data
handler.delete(async (req, res) => {
	const email = req.query.email
	const session = await getSession({ req })

	if (!session || session.user.email != email)
		return res.status(403).json({
			message: 'You must be signed in to your account to delete it',
		})
	
	const result = await req.db.collection(collectionName).deleteOne(
		{ user: email },
	)

	const deleted = result.deletedCount > 0
	res.status(200).json({message: deleted ?
		'Your profile was successfully deleted' :
		'No matching accounts found on the server, signing user out...'
	})
})

export default handler
