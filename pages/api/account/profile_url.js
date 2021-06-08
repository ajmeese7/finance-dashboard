import { getSession } from 'next-auth/client'
import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'
const handler = nextConnect()
handler.use(middleware)
const collectionName = 'users'

handler.get(async (req, res) => {
	const email = req.query.email
	const result = await req.db.collection(collectionName)
		.find({ user: email }, { 'projection': {
			'profileIsPublic': 1,
			'profileUrl': 1,
		}})
		.next()

	res.json({
		profileIsPublic: result.profileIsPublic,
		profileUrl: result.profileUrl,
	})
})

handler.post(async (req, res) => {
	const data = JSON.parse(req.body)
	const email = data.email,
	      profileIsPublic = data.profileIsPublic,
				profileUrl = data.profileUrl
	const session = await getSession({ req })

	if (!session || session.user.email != email)
		return res.status(403).json({
			message: 'You must be signed in to modify account data',
		})
	
	let result = await req.db.collection(collectionName).updateOne(
		{ user: email },
		{ $set: profileUrl ?
			// Sets profile URL if available and profileIsPublic if not
			{ profileUrl: profileUrl } :
			{ profileIsPublic: profileIsPublic }
		},
	)

	res.json({message: `${result.modifiedCount} document(s) was/were updated.`})
})

export default handler