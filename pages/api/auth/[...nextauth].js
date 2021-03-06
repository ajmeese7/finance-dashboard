import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
	site: process.env.NEXT_PUBLIC_WEBSITE_URL,
	providers: [
		Providers.Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			// NOTE: Not sure if this is needed; https://next-auth.js.org/providers/google
			authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
		})
	],
	secret: process.env.SECRET,
	callbacks: {
		// Always go to index page after login
		redirect: async (url, baseUrl) => {
			return baseUrl
		},
	},
}

export default (req, res) => NextAuth(req, res, options)