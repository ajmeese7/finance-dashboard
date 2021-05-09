import { useState, useEffect, useRef } from 'react'
import Fade from 'react-reveal/Fade'
import fetch from 'isomorphic-unfetch'
import { useSession } from 'next-auth/client'
const API_URL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api`

export default function TickerSearch(props) {
	// TODO: See if I can use the data.js method instead, or something similar
	const [session, loading] = useSession()
	const [tickers, setTickers] = useState([])
	const [trackedTickers, setTrackedTickers] = useState([])

	// Ensures trackedTickers useEffect doesn't run on initial 
	// state population with the empty useEffect function
	const alreadySetTrackedTickers = useRef(false)

	useEffect(async () => {
		// Sets trackedTickers asynchrously on initial render
		const res = await fetch(`${API_URL}/trackedTickers?user=${session.user.email}`)
		const json = await res.json()
		setTrackedTickers(json.trackedTickers)
		alreadySetTrackedTickers.current = true
	}, [])

	useEffect(async () => {
		// Updates the server data when the user's trackedTicker list is modified
		if (!alreadySetTrackedTickers.current) return
		const res = await fetch(`${API_URL}/trackedTickers`, {
			method: 'post',
			body: JSON.stringify({
				user: session.user.email,
				trackedTickers: trackedTickers
			})
		})
	}, [trackedTickers])

	const displayTickers = async (event) => {
		event.preventDefault()

		const name = event.target.ticker.value
		const tickers = await getTickers(name)
		setTickers(tickers)
	}

	const updateTrackedTickers = async (tickerSymbol) => {
		if (trackedTickers.includes(tickerSymbol)) {
			// Removes ticker from tracked list
			const newTickerList = trackedTickers.filter(symbol => symbol !== tickerSymbol)
			setTrackedTickers(newTickerList)
		} else {
			// Adds ticker data to tracked list
			setTrackedTickers([...trackedTickers, tickerSymbol])
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

					// TODO: Somehow clear the previous render of this part of the 
					// page to get the Fade effect to run again; component maybe?
					let tickerTracked = trackedTickers.includes(ticker.symbol)
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

/** Searches API for user query and returns related stock tickers. */
const getTickers = async (name) => {
	// TODO: Handle when res.json() is empty
	const res = await fetch(`${API_URL}/get_tickers?name=${name}`)
	return await res.json()
}