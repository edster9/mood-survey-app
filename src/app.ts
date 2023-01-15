import express, { NextFunction, Request, Response } from 'express'
import { Database } from 'sqlite'
import helmet from 'helmet'
import routes from './routes'
import openDb from './modules/database'

const app = express()

app.use(helmet())

app.use(express.json())

routes(app)

const initServer = async () => {
	const db = await openDb()
	await db.migrate()

	app.listen(3001, () => {
		console.log('Application listening at http://localhost:3001')
	})
}

initServer()
