import express, { NextFunction, Request, Response } from 'express'
import { Database } from 'sqlite'
import helmet from 'helmet'
import routes from './routes'
import openDb from './modules/database'

// Create express server
const app = express()

// Helment middleware for enhanced security
app.use(helmet())

// Parse body middle ware for accepting json body
app.use(express.json())

// Setup all routes
routes(app)

const initServer = async () => {
	// Open database and run initial migrations
	const db = await openDb()
	await db.migrate()

	// Listen for REST API requests
	app.listen(3001, () => {
		console.log('Application listening at http://localhost:3001')
	})
}

initServer()
