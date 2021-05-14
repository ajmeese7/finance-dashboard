import { MongoClient } from 'mongodb'
import nextConnect from 'next-connect'
require('dotenv').config()

const databaseName = 'data'
const client = new MongoClient(process.env.MONGO_CONNECTION_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

async function database(req, res, next) {
	if (!client.isConnected()) await client.connect()
	req.dbClient = client
	req.db = client.db(databaseName)
	return next()
}

const middleware = nextConnect()
middleware.use(database)

export default middleware