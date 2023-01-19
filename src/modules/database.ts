import sqlite3 from 'sqlite3'
import { open, Database, ISqlite } from 'sqlite'

/**
 * Createa cached connection to sqlite database
 *
 * @returns Database
 */
export default async function openDb() {
	const dbConfig: ISqlite.Config = {
		filename: 'db.sqlite',
		driver: sqlite3.cached.Database,
	}

	if (process.env.NODE_ENV) {
		dbConfig.filename = `${process.env.NODE_ENV}.db.sqlite`
	}

	return open(dbConfig)
}
