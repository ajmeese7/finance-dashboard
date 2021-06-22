// https://github.com/vercel/next.js/discussions/12229#discussioncomment-363517
import { MongoClient } from 'mongodb'
import nextConnect from 'next-connect'
require('dotenv').config()
const { MONGODB_URI } = process.env

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	)
}

/** Time before MongoDB client closes; currently 10 seconds. */
const timeout = 1000 * 10;
const opts = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	maxIdleTimeMS: timeout,
	serverSelectionTimeoutMS: timeout,
	socketTimeoutMS: 2 * timeout,
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 * https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/util/mongodb.js
 */
let cached = global.mongo

if (!cached) {
	cached = global.mongo = { conn: null, promise: null }
}

async function database(req, res, next) {
	if (cached.conn) {
		req.db = cached.conn
		return next()
	}

	if (!cached.promise) {
		cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
			return client.db('data')
		})
	}
	cached.conn = await cached.promise
	req.db = cached.conn
	return next()
}

// TODO: Make sure the old connection is re-used, not more continually opened
const middleware = nextConnect()
middleware.use(database)

export default middleware