import nextConnect from 'next-connect'
import middleware from '../../middleware/database'
const handler = nextConnect()
handler.use(middleware)
const collectionName = 'users'

handler.get(async (req, res) => {
	const email = req.query.email
	const result = await req.db.collection(collectionName)
		.find({ user: email }, { 'projection': { 'trackedTickers': 1 }})
		.next()
	
	res.json({ trackedTickers: result.trackedTickers })
})

handler.post(async (req, res) => {
	const data = JSON.parse(req.body)
	const email = data.email, tickers = data.trackedTickers
	if (!tickers)
		return res.status(400).json({ message: 'Invalid call to POST endpoint!' })
	
	const result = await req.db.collection(collectionName).updateOne(
		{ user: email },
		{ $set: { trackedTickers: tickers }},
	)

	res.json({message: `${result.modifiedCount} document(s) was/were updated.`})
})

export default handler