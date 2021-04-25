import '../public/styles.css'

// https://nextjs.org/docs/advanced-features/custom-app
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}