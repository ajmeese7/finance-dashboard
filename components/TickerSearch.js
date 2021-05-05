import { useState } from 'react'
import Fade from 'react-reveal/Fade'

export default function TickerSearch(props) {
	const [tickers, setTickers] = useState([])
	// TODO: Pull this from a DB
	const [trackedTickers, setTrackedTickers] = useState([])

	// TODO: Redux to globally handle tracked tickers, then go from there
	const displayTickers = async (event) => {
		event.preventDefault()

		const name = event.target.ticker.value
		const tickers = await getTickers(name)
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
			const tickerData = await getTickerData(tickerSymbol)
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
					// IDEA: 'Roll up' button to close the search when user is done;
					// can initially 'roll down' to results maybe as they load in, moving
					// the rest of the page rather than covering content, or intentionally cover
					let tickerTracked = tickerAlreadyTracked(ticker.symbol)
					return (
						<Fade bottom distance={"50px"} delay={index * 250} key={index}>
							<div className="ticker">
								<p>{ticker.symbol} - {ticker.name}</p>
								<button
									className={"trackTicker " + (tickerTracked ? 'trackTicker_selected' : '')}
									onClick={() => updateTrackedTickers(ticker.symbol)}
								>
									{/* IDEA: Animate text change with a poof or something */}
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
const getTickers = async (name) => {
	const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/get_tickers/${name}`
	const result = await getJSONDataSafely(url)

	// TODO: Implement popups on error for user to see, and option to send all their
	// logs to me in a debug report. Can happen if Python not started, etc.
	if (!result) return console.warn("Unable to get tickers for specified query...")
	return result
}

/** Searches API for stock ticker and returns related performance data. */
const getTickerData = async (ticker) => {
	const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/get_ticker_data/${ticker}`
	const result = await getJSONDataSafely(url)
	if (!result) return console.warn("Unable to get data for specified ticker...")
	return result
}