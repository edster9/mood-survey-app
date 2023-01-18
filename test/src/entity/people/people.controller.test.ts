import request from 'supertest'
import { DateTime } from 'luxon'
import openDb from '../../../../src/modules/database'
import app from '../../../../src/app'

beforeAll(async () => {
	const db = await openDb()
	await db.migrate()
})

describe('POST /people/survey', () => {
	test('fail creating a new mood survey due to missing post data', async () => {
		const response = await request(app).post('/people/survey').send()

		expect(response.statusCode).toBe(400)
	})

	test('create a new mood survey for a 40 year old', async () => {
		// calculate the birthday for 40 years old
		const personAge = DateTime.now()
			.minus({ years: 40 })
			.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

		const response = await request(app).post('/people/survey').send({
			fullName: 'John Smith 40',
			birthday: personAge.toISO(),
			happyScale: 1,
			energyScale: 1,
			hopefulnessScale: 1,
			sleepHours: 1,
		})

		expect(response.statusCode).toBe(201)

		delete response.body.person.lastSurveyTime

		expect(response.body).toEqual({
			person: {
				id: 1,
				fullName: 'John Smith 40',
				birthday: personAge.toISO(),
				happyScale: 1,
				happyAverage: 1,
				energyScale: 1,
				energyAverage: 1,
				hopefulnessScale: 1,
				hopefulnessAverage: 1,
				sleepHours: 1,
				sleepAverage: 1,
				age: 40,
			},
		})
	})

	test('create a new mood survey for a 30 year old (Jane Smith)', async () => {
		// calculate the birthday for 30 years old
		const personAge = DateTime.now()
			.minus({ years: 30 })
			.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

		const response = await request(app).post('/people/survey').send({
			fullName: 'Jane Smith 30',
			birthday: personAge.toISO(),
			happyScale: 1,
			energyScale: 1,
			hopefulnessScale: 1,
			sleepHours: 1,
		})

		expect(response.statusCode).toBe(201)

		delete response.body.person.lastSurveyTime

		expect(response.body).toEqual({
			person: {
				id: 2,
				fullName: 'Jane Smith 30',
				birthday: personAge.toISO(),
				happyScale: 1,
				happyAverage: 1,
				energyScale: 1,
				energyAverage: 1,
				hopefulnessScale: 1,
				hopefulnessAverage: 1,
				sleepHours: 1,
				sleepAverage: 1,
				age: 30,
			},
		})
	})

	test('create a second mood survey for a 30 year old (John Smith)', async () => {
		// calculate the birthday for 30 years old
		const personAge = DateTime.now()
			.minus({ years: 30 })
			.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

		const response = await request(app).post('/people/survey').send({
			fullName: 'John Smith 30',
			birthday: personAge.toISO(),
			happyScale: 1,
			energyScale: 1,
			hopefulnessScale: 1,
			sleepHours: 1,
		})

		expect(response.statusCode).toBe(201)

		delete response.body.person.lastSurveyTime

		expect(response.body).toEqual({
			person: {
				id: 3,
				fullName: 'John Smith 30',
				birthday: personAge.toISO(),
				happyScale: 1,
				happyAverage: 1,
				energyScale: 1,
				energyAverage: 1,
				hopefulnessScale: 1,
				hopefulnessAverage: 1,
				sleepHours: 1,
				sleepAverage: 1,
				age: 30,
			},
		})
	})

	test('create a mood survey for a 25 year old (Bob Smith)', async () => {
		// calculate the birthday for 25 years old
		const personAge = DateTime.now()
			.minus({ years: 25 })
			.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

		const response = await request(app).post('/people/survey').send({
			fullName: 'Bob Smith 25',
			birthday: personAge.toISO(),
			happyScale: 1,
			energyScale: 1,
			hopefulnessScale: 1,
			sleepHours: 1,
		})

		expect(response.statusCode).toBe(201)

		delete response.body.person.lastSurveyTime

		expect(response.body).toEqual({
			person: {
				id: 4,
				fullName: 'Bob Smith 25',
				birthday: personAge.toISO(),
				happyScale: 1,
				happyAverage: 1,
				energyScale: 1,
				energyAverage: 1,
				hopefulnessScale: 1,
				hopefulnessAverage: 1,
				sleepHours: 1,
				sleepAverage: 1,
				age: 25,
			},
		})
	})
})

describe('GET /people/:id/compare/age', () => {})

describe('GET /people/:id', () => {
	test('fail with unknown id', async () => {
		const response = await request(app).get('/people/123456789')

		expect(response.statusCode).toBe(404)
	})

	test('fail with malformed id', async () => {
		const response = await request(app).get('/people/ABC')

		expect(response.statusCode).toBe(400)
	})

	test('get a person by id', async () => {
		const response = await request(app).get('/people/1')

		expect(response.statusCode).toBe(200)
	})
})

describe('DELETE /people/:id', () => {
	test('fail with malformed id', async () => {
		const response = await request(app).delete('/people/ABC')

		expect(response.statusCode).toBe(400)
	})

	test('delete a person by id', async () => {
		const response = await request(app).delete('/people/1')

		expect(response.statusCode).toBe(204)
	})

	test('verify person deleted', async () => {
		const response = await request(app).get('/people/1')

		expect(response.statusCode).toBe(404)
	})
})
