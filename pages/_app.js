import { Provider } from 'next-auth/client'
import '../public/styles.css'

//import getConfig from 'next/config'
//const { publicRuntimeConfig } = getConfig()

export default function MyApp({ Component, pageProps }) {
	return (
		<Provider session={pageProps.session}>
			<Component {...pageProps} />
		</Provider>
	)
}