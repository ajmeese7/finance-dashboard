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
	const [trackedTickers, setTrackedTickers] = useState([])

	// Ensures trackedTickers useEffect doesn't run on initial 
	// state population with the empty useEffect function
	const alreadySetTrackedTickers = useRef(false)

	// Sets trackedTickers asynchrously on initial render
	useEffect(async () => {
		const res = await fetch(`${API_URL}/trackedTickers?user=${session.user.email}`)
		const json = await res.json()
		setTrackedTickers(json.trackedTickers)
		alreadySetTrackedTickers.current = true
	}, [])

	// Updates the server data when the user's trackedTicker list is modified
	useEffect(async () => {
		if (!alreadySetTrackedTickers.current) return
		const res = await fetch(`${API_URL}/trackedTickers`, {
			method: 'post',
			body: JSON.stringify({
				user: session.user.email,
				trackedTickers: trackedTickers
			})
		})
	}, [trackedTickers])

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
		<>
			<Input
				name="ticker"
				type="text"
				placeholder="Ticker or Company Name"
				autoComplete="off"
				onChange={displayTickers}
			/>

			<div id="tickerSearchResults">
				{tickers.map((ticker, index) => {
					let tickerTracked = trackedTickers.includes(ticker.symbol)
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
			</div>
		</>
	)
}

/** Searches API for user query and returns related stock tickers. */
const getTickers = async (name) => {
	const res = await fetch(`${API_URL}/get_tickers?name=${name}`)
	const json = await res.json()
	return json
}