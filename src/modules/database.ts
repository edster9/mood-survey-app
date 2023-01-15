import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

export default async function openDb() {
	return open({
		filename: 'db.sqlite',
		driver: sqlite3.cached.Database,
	})
}
