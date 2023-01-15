import { Express } from 'express'
import PeopleController from './entity/people/people.controller'

/**
 * Setup all the routes for the mood survey app
 *
 * @param {Express} app
 */
function routes(app: Express) {
	// Find a person by id
	app.get('/people/:id', PeopleController.getOne)
	// Delete a person and all survey logs by id
	app.delete('/people/:id', PeopleController.removeOne)
	// Collect a new survey
	app.post('/people/survey', PeopleController.peopleSurvey)
	// Compare a person to others in the same age group
	app.get('/people/:id/compare/age', PeopleController.compareByAge)
	// TODO: Compare a person to other age groups
	app.get('/people/:id/compare/age-groups', PeopleController.compareByAgeGroups)
}

export default routes
