import '../public/styles.css'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const backend_url = publicRuntimeConfig.IS_LOCAL_DEV ?
	'http://localhost:8080/'
	:
	'___TODO___'

// https://nextjs.org/docs/advanced-features/custom-app
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component 
		{...pageProps}
		backend_url={backend_url}
	/>
}