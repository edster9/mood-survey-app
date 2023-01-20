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

	test('Ed Wood - 40 years old) create a new mood survey', async () => {
		// calculate the birthday for 40 years old
		const personAge = DateTime.now()
			.minus({ years: 40 })
			.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

		const response = await request(app).post('/people/survey').send({
			fullName: 'Ed Wood 40',
			birthday: personAge.toISO(),
			happyScale: 2,
			energyScale: 2,
			hopefulnessScale: 2,
			sleepHours: 8,
			compareToAll: false,
		})

		expect(response.statusCode).toBe(201)

		delete response.body.person.lastSurveyTime

		expect(response.body).toEqual({
			person: {
				id: 1,
				fullName: 'Ed Wood 40',
				birthday: personAge.toISO(),
				happyScale: 2,
				happyAverage: 2,
				energyScale: 2,
				energyAverage: 2,
				hopefulnessScale: 2,
				hopefulnessAverage: 2,
				sleepHours: 8,
				sleepAverage: 8,
				age: 40,
			},
		})
	})

	test('(Jane Smith - 30 year old) with no previous survey date and no age groups yet to compare to', async () => {
		// calculate the birthday for 30 years old
		const personAge = DateTime.now()
			.minus({ years: 30 })
			.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

		const response = await request(app).post('/people/survey').send({
			fullName: 'Jane Smith 30',
			birthday: personAge.toISO(),
			happyScale: 4,
			energyScale: 4,
			hopefulnessScale: 4,
			sleepHours: 4,
			compareToAll: false,
		})

		expect(response.statusCode).toBe(201)

		delete response.body.person.lastSurveyTime

		expect(response.body).toEqual({
			person: {
				id: 2,
				fullName: 'Jane Smith 30',
				birthday: personAge.toISO(),
				happyScale: 4,
				happyAverage: 4,
				energyScale: 4,
				energyAverage: 4,
				hopefulnessScale: 4,
				hopefulnessAverage: 4,
				sleepHours: 4,
				sleepAverage: 4,
				age: 30,
			},
		})
	})

	test('(John Smith - 30 year old) with no previous survey date but with compare to existing age groups', async () => {
		// calculate the birthday for 30 years old
		const personAge = DateTime.now()
			.minus({ years: 30 })
			.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

		const response = await request(app).post('/people/survey').send({
			fullName: 'John Smith 30',
			birthday: personAge.toISO(),
			happyScale: 2,
			energyScale: 2,
			hopefulnessScale: 2,
			sleepHours: 8,
			compareToAll: false,
		})

		expect(response.statusCode).toBe(201)

		delete response.body.person.lastSurveyTime

		expect(response.body).toEqual({
			person: {
				id: 3,
				fullName: 'John Smith 30',
				birthday: personAge.toISO(),
				happyScale: 2,
				happyAverage: 2,
				energyScale: 2,
				energyAverage: 2,
				hopefulnessScale: 2,
				hopefulnessAverage: 2,
				sleepHours: 8,
				sleepAverage: 8,
				age: 30,
			},
			ownAgeGroup: {
				ageGroup: '30',
				energyAverage: 4,
				happyAverage: 4,
				hopefulnessAverage: 4,
				sleepAverage: 4,
			},
		})
	})

	test('2nd entry for (John Smith - 30 year old) with previous survey date and with compare to existing age groups', async () => {
		// calculate the birthday for 30 years old
		const personAge = DateTime.now()
			.minus({ years: 30 })
			.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

		const response = await request(app).post('/people/survey').send({
			fullName: 'John Smith 30',
			birthday: personAge.toISO(),
			happyScale: 4,
			energyScale: 4,
			hopefulnessScale: 4,
			sleepHours: 4,
			compareToAll: false,
		})

		expect(response.statusCode).toBe(201)

		delete response.body.person.lastSurveyTime
		delete response.body.previousSurvey.timestamp

		expect(response.body).toEqual({
			person: {
				id: 3,
				fullName: 'John Smith 30',
				birthday: personAge.toISO(),
				happyScale: 4,
				happyAverage: 3,
				energyScale: 4,
				energyAverage: 3,
				hopefulnessScale: 4,
				hopefulnessAverage: 3,
				sleepHours: 4,
				sleepAverage: 6,
				age: 30,
			},
			previousSurvey: {
				energyScale: 2,
				happyScale: 2,
				hopefulnessScale: 2,
				id: 3,
				peopleId: 3,
				sleepHours: 8,
			},
			ownAgeGroup: {
				ageGroup: '30',
				energyAverage: 4,
				happyAverage: 4,
				hopefulnessAverage: 4,
				sleepAverage: 4,
			},
		})
	})

	test('(Bob Smith - 25 year old) create a mood survey', async () => {
		// calculate the birthday for 25 years old
		const personAge = DateTime.now()
			.minus({ years: 25 })
			.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

		const response = await request(app).post('/people/survey').send({
			fullName: 'Bob Smith 25',
			birthday: personAge.toISO(),
			happyScale: 3,
			energyScale: 3,
			hopefulnessScale: 3,
			sleepHours: 3,
			compareToAll: false,
		})

		expect(response.statusCode).toBe(201)

		delete response.body.person.lastSurveyTime

		expect(response.body).toEqual({
			person: {
				id: 4,
				fullName: 'Bob Smith 25',
				birthday: personAge.toISO(),
				happyScale: 3,
				happyAverage: 3,
				energyScale: 3,
				energyAverage: 3,
				hopefulnessScale: 3,
				hopefulnessAverage: 3,
				sleepHours: 3,
				sleepAverage: 3,
				age: 25,
			},
		})
	})

	test('create a mood survey for a 90 year old (Bob Dole) with compare to all age groups', async () => {
		// calculate the birthday for 90 years old
		const personAge = DateTime.now()
			.minus({ years: 90 })
			.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

		const response = await request(app).post('/people/survey').send({
			fullName: 'Bob Dole 90',
			birthday: personAge.toISO(),
			happyScale: 5,
			energyScale: 5,
			hopefulnessScale: 5,
			sleepHours: 5,
			compareToAll: true,
		})

		expect(response.statusCode).toBe(201)

		delete response.body.person.lastSurveyTime

		expect(response.body).toEqual({
			person: {
				id: 5,
				fullName: 'Bob Dole 90',
				birthday: personAge.toISO(),
				happyScale: 5,
				happyAverage: 5,
				energyScale: 5,
				energyAverage: 5,
				hopefulnessScale: 5,
				hopefulnessAverage: 5,
				sleepHours: 5,
				sleepAverage: 5,
				age: 90,
			},
			otherAgeGroups: [
				{
					ageGroup: '22-30',
					energyAverage: 3,
					happyAverage: 3,
					hopefulnessAverage: 3,
					sleepAverage: 4,
				},
				{
					ageGroup: '31-40',
					energyAverage: 2,
					happyAverage: 2,
					hopefulnessAverage: 2,
					sleepAverage: 8,
				},
			],
		})
	})
})

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

describe('GET /people/:id/compare/age', () => {
	test('compare a non existant user to others in same age group, should be 404', async () => {
		const response = await request(app).get('/people/123456789/compare/age')

		expect(response.statusCode).toBe(404)
	})

	test('compare a user with malformed id to others in the same age group, should be 400', async () => {
		const response = await request(app).get('/people/ABC/compare/age')

		expect(response.statusCode).toBe(400)
	})

	test('compare (Ed Wood 40 - years old) to others in same age group, should be no others in same age group', async () => {
		const response = await request(app).get('/people/1/compare/age')

		expect(response.body).toEqual({})
		expect(response.statusCode).toBe(204)
	})

	test('compare (Jane Smith 30) years old to others in same age group', async () => {
		const response = await request(app).get('/people/2/compare/age')

		expect(response.body).toEqual({
			ageGroup: '30',
			energyAverage: 3,
			happyAverage: 3,
			hopefulnessAverage: 3,
			sleepAverage: 6,
		})
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

describe('GET /people/:id/compare/age-groups', () => {
	test('compare a non existant user to other age groups, should be 404', async () => {
		const response = await request(app).get(
			'/people/123456789/compare/age-groups',
		)

		expect(response.statusCode).toBe(404)
	})

	test('compare a user with malformed id to other age groups, should be 400', async () => {
		const response = await request(app).get('/people/ABC/compare/age-groups')

		expect(response.statusCode).toBe(400)
	})

	test('compare (Jane Smith 30 - year old) to other age groups', async () => {
		const response = await request(app).get('/people/2/compare/age-groups')

		expect(response.body).toEqual([
			{
				happyAverage: 3,
				energyAverage: 3,
				hopefulnessAverage: 3,
				sleepAverage: 5,
				ageGroup: '22-30',
			},
			{
				happyAverage: 5,
				energyAverage: 5,
				hopefulnessAverage: 5,
				sleepAverage: 5,
				ageGroup: '71-Infinity',
			},
		])

		expect(response.statusCode).toBe(200)
	})

	test('compare (Bob Dole 90 - year old) years old to other age groups when no other age groups exists', async () => {
		await request(app).delete('/people/2')
		await request(app).delete('/people/3')
		await request(app).delete('/people/4')

		const response = await request(app).get('/people/5/compare/age-groups')

		expect(response.body).toEqual([])

		expect(response.statusCode).toBe(200)
	})
})
