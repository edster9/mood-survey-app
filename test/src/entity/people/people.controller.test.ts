import request from 'supertest'
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

	test('create a new mood survey for a 30 year old', async () => {
		const response = await request(app).post('/people/survey').send({
			fullName: 'John Smith',
			birthday: '1971-09-12T00:00:00.000',
			happyScale: 4,
			energyScale: 3,
			hopefulnessScale: 2,
			sleepHours: 8,
		})

		expect(response.statusCode).toBe(201)

		delete response.body.person.lastSurveyTime

		expect(response.body).toEqual({
			person: {
				id: 1,
				fullName: 'John Smith',
				birthday: '1971-09-12T00:00:00.000',
				happyScale: 4,
				happyAverage: 4,
				energyScale: 3,
				energyAverage: 3,
				hopefulnessScale: 2,
				hopefulnessAverage: 2,
				sleepHours: 8,
				sleepAverage: 8,
				age: 51,
			},
		})
	})
})

describe('GET /people/:id', () => {
	test('fail getting an unknown id', async () => {
		const response = await request(app).get('/people/123456789')

		expect(response.statusCode).toBe(404)
	})

	test('get a person by id', async () => {
		const response = await request(app).get('/people/1')

		expect(response.statusCode).toBe(200)
	})
})
