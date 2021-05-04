import { useState } from 'react'
import Fade from 'react-reveal/Fade'

export default function TickerSearch({ backend_url }) {
	const [tickers, setTickers] = useState([])
	// TODO: Pull this from a DB
	const [trackedTickers, setTrackedTickers] = useState([])

	// TODO: Redux to globally handle tracked tickers, then go from there
	const displayTickers = async (event) => {
		event.preventDefault()

		const name = event.target.ticker.value
		const tickers = await getTickers(name, backend_url)
		setTickers(tickers)
	}

	const tickerAlreadyTracked = (tickerSymbol) =>
		trackedTickers.length > 0 &&
			trackedTickers.filter(trackedTicker => trackedTicker.symbol === tickerSymbol).length > 0

	const updateTrackedTickers = async (tickerSymbol) => {
		if (tickerAlreadyTracked(tickerSymbol)) {
			// Removes ticker from tracked list
			const newTickerList =
				trackedTickers.filter(trackedTicker => trackedTicker.symbol !== tickerSymbol)
			setTrackedTickers(newTickerList)
		} else {
			// Adds ticker data to tracked list
			const tickerData = await getTickerData(tickerSymbol, backend_url)
			setTrackedTickers([...trackedTickers, tickerData])
		}
	}

	return (
		<>
			<form onSubmit={displayTickers}>
				<input name="ticker" type="text" placeholder="Ticker or Company Name" autoComplete="off" required />
				<button type="submit">Search</button>
			</form>

			{/* TODO: Make the fade delay work after the first render */}
			<div id="tickerSearchResults">
				{tickers && tickers.map((ticker, index) => {
					let tickerTracked = tickerAlreadyTracked(ticker.symbol);
					return (
						<Fade bottom distance={"50px"} delay={index * 250} key={index}>
							<div className="ticker">
								<p>{ticker.symbol} - {ticker.name}</p>
								<button
									className={"trackTicker " + (tickerTracked ? 'trackTicker_selected' : '')}
									onClick={() => updateTrackedTickers(ticker.symbol)}
								>
									{tickerTracked ? "✔ Tracked" : "Track"}
								</button>
							</div>
						</Fade>
					)})
				}
			</div>
		</>
	)
}

/** Optional headers for every fetch request. */
const defaultGetHeaders = () => ({
	headers: {
		'Content-Type': 'application/json'
	},
	method: 'GET'
})

/** Check if a response contains an error code. */
function checkError(response) {
	if (response.ok) {
		return response.json()
	} else {
		throw Error(response.statusText)
	}
}

/** Returns JSON data if request succeeds or null if not. */
const getJSONDataSafely = async (url) => {
	return await fetch(url, defaultGetHeaders)
		.then(checkError)
		.catch((err) => console.error(err))
}

/** Searches API for user query and returns related stock tickers. */
const getTickers = async (name, backend_url) => {
	const url = `${backend_url}/get_tickers/${name}`
	const result = await getJSONDataSafely(url)
	if (!result) return console.warn("Unable to get tickers for specified query...")
	return result
}

// NOTE: In theory, could have a getData() with `endpoint` and `param` arguments...
const getTickerData = async (ticker, backend_url) => {
	const url = `${backend_url}/get_ticker_data/${ticker}`
	const result = await getJSONDataSafely(url)
	if (!result) return console.warn("Unable to get data for specified ticker...")
	return result
}