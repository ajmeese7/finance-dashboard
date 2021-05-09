import { MongoClient } from 'mongodb'
import nextConnect from 'next-connect'
require('dotenv').config()

const databaseName = 'data'
const collectionName = 'users'
const client = new MongoClient(process.env.MONGO_CONNECTION_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

async function collection(req, res, next) {
	if (!client.isConnected()) await client.connect()
	req.dbClient = client
	req.collection = client.db(databaseName).collection(collectionName)
	return next()
}

const middleware = nextConnect()
middleware.use(collection)

export default middleware