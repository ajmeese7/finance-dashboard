import nextConnect from 'next-connect'
import middleware from '../../middleware/database'

// TODO: See if I can abstract this to an API route creator function
// instead of having it across multiple files
const handler = nextConnect()
handler.use(middleware)

handler.get(async (req, res) => {
	const user = req.query.user;
	const result = await req.collection
		.find({ user: user }, { 'projection': { 'trackedTickers': 1 }})
		.next()
	
	// Returns an empty array if the user doesn't have a DB entry yet
	res.json({ trackedTickers: result ? result.trackedTickers : [] })
})

handler.post(async (req, res) => {
	const data = JSON.parse(req.body)
	const user = data.user, tickers = data.trackedTickers
	if (!tickers) res.status(400).json({ message: 'Invalid call to POST endpoint!' })
	
	let result = await req.collection.updateOne(
		{ user: user },
		{ $set: { trackedTickers: tickers }},
		{ upsert: true }
	)

	res.json({message: `${result.modifiedCount} document(s) was/were updated.`})
})

export default handler