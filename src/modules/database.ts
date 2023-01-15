import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

/**
 * Createa cached connection to sqlite database
 *
 * @returns Database
 */
export default async function openDb() {
	return open({
		filename: 'db.sqlite',
		driver: sqlite3.cached.Database,
	})
}
