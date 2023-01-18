import app from './app'
import openDb from './modules/database'

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
