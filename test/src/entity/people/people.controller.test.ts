import request from 'supertest'
import app from '../../../../src/app'

describe('People Controller', () => {
	describe('GET /people/1', () => {
		it('get person by id', async () => {
			const res = await request(app).get('/people/1')
			expect(res.statusCode).toBe(200)
		})
	})
})
