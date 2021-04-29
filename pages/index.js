import Head from 'next/head'
import TickerSearch from '../components/TickerSearch'

export default function Home(props) {
	const { backend_url } = props;
	return (
		<div className="container">
			<Head>
				<title>Stocks Dashboard</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<TickerSearch backend_url={backend_url} />
		</div>
	)
}