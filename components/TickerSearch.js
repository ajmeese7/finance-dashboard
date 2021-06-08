import { useState, useEffect, useRef } from 'react'
import {
	Input,
} from 'reactstrap'
import Fade from 'react-reveal/Fade'
import fetch from 'isomorphic-unfetch'
import { useSession } from 'next-auth/client'
const API_URL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api`

export default function TickerSearch(props) {
	const [session, loading] = useSession()
	const [search, setSearch] = useState('')
	const [tickers, setTickers] = useState([])
	const [trackedTickers, setTrackedTickers] = useState(props.trackedTickers)

	// Updates the server data when the user's trackedTicker list is modified
	useEffect(async () => {
		if (!session) return
		const res = await fetch(`${API_URL}/tracked_tickers`, {
			method: 'post',
			body: JSON.stringify({
				email: session.user.email,
				trackedTickers: trackedTickers
			})
		})
	}, [trackedTickers, session])

	// Changes the mapped array of tickers beneath the search bar
	const displayTickers = async (event) => {
		event.preventDefault()

		const name = event.target.value
		setSearch(name)
		const tickers = await getTickers(name)
		setTickers(tickers)
	}

	// Adds or removes tickers from tracked ticker list
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
		<div id="tickerSearch">
			<Input
				name="search"
				type="text"
				placeholder="Ticker or Company Name"
				autoComplete="off"
				onChange={displayTickers}
			/>

			<div
				id="tickerSearchResults"
				className="border border-dark"
			>
				{tickers.map((ticker, index) => {
					const tickerTracked = trackedTickers.includes(ticker.symbol)
					return (
						// Key forces the component to re-render for animations only on search change
						<Fade bottom distance={"50px"} delay={index * 100} key={search + index}>
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

				{tickers.length == 0 && (
					<p className="text-muted text-center m-3 user-select-none">Go ahead, search for a stock!</p>
				)}
			</div>
		</div>
	)
}

/** Searches API for user query and returns related stock tickers. */
const getTickers = async (name) => {
	const res = await fetch(`${API_URL}/get_tickers?name=${name}`)
	const json = await res.json()
	return json
}