import { Express } from 'express'
import PeopleController from './entity/people/people.controller'

function routes(app: Express) {
	app.get('/people/:id', PeopleController.getOne)
	app.delete('/people/:id', PeopleController.removeOne)
	app.post('/people/survey', PeopleController.peopleSurvey)
	app.get('/people/:id/compare/age', PeopleController.compareByAge)
	app.get('/people/:id/compare/age-groups', PeopleController.compareByAgeGroups)
}

export default routes
