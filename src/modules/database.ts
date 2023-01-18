import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

/**
 * Createa cached connection to sqlite database
 *
 * @returns Database
 */
export default async function openDb() {
	return open({
		filename: process.env.NODE_ENV
			? `${process.env.NODE_ENV}.db.sqlite`
			: 'db.sqlite',
		driver: sqlite3.cached.Database,
	})
}
