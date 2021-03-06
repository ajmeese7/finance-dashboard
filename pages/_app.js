import { Provider } from 'next-auth/client'
import '../public/styles.scss'
import 'bootstrap/dist/css/bootstrap.css'

export default function MyApp({ Component, pageProps }) {
	return (
		<Provider session={pageProps.session}>
			<Component {...pageProps} />
		</Provider>
	)
}