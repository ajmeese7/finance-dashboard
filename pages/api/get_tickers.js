import nextConnect from 'next-connect'
import fetch from 'isomorphic-unfetch'

const handler = nextConnect()

// TODO: Error handling and testing
handler.get(async (req, res) => {
	const name = req.query.name
	const result = await fetch(`http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=${name}&region=1&lang=en`)
	const json = await result.json()
	const tickers = json.ResultSet.Result
	const filtered_tickers = tickers.filter(ticker => ticker.type == 'S').slice(0, 3)
	res.json(filtered_tickers)
})

export default handler