import nextConnect from 'next-connect'
import middleware from '../../middleware/database'
const handler = nextConnect()
handler.use(middleware)
const collectionName = 'users'

handler.get(async (req, res) => {
	const user = req.query.user
	const result = await req.db.collection(collectionName)
		.find({ user: user }, { 'projection': { 'trackedTickers': 1 }})
		.next()
	
	// Returns an empty array if the user doesn't have a DB entry yet
	res.json({ trackedTickers: result ? result.trackedTickers : [] })
})

handler.post(async (req, res) => {
	const data = JSON.parse(req.body)
	const user = data.user, tickers = data.trackedTickers
	if (!tickers) res.status(400).json({ message: 'Invalid call to POST endpoint!' })
	
	let result = await req.db.collection(collectionName).updateOne(
		{ user: user },
		{ $set: { trackedTickers: tickers }},
		{ upsert: true }
	)

	res.json({message: `${result.modifiedCount} document(s) was/were updated.`})
})

export default handler