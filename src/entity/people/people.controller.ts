import { Request, Response } from 'express'
import PeopleService from './people.service'
import { validate } from '../../entity'
import { PeopleSurveyDto } from './types'
import { EntityFindById } from '../../entity/types'

/**
 * Find a person by id
 *
 * @param req
 * @param res
 * @returns Person
 */
const getOne = async (req: Request<EntityFindById>, res: Response) => {
	try {
		// validate search params
		await validate(new EntityFindById(req.params))

		// find the person from the People service
		const person = await PeopleService.getOne(req.params.id)

		// return if found
		if (person) {
			return res.json(person)
		} else {
			return res.sendStatus(404)
		}
	} catch (e: any) {
		return res.status(400).send(e.message)
	}
}

/**
 * Delete a person and all survey logs by id
 *
 * @param req
 * @param res
 */
const removeOne = async (req: Request<EntityFindById>, res: Response) => {
	try {
		// validate search params
		await validate(new EntityFindById(req.params))

		// remove the person from the database
		await PeopleService.removeOne(req.params.id)

		// return 204 status (No Content)
		return res.sendStatus(204)
	} catch (e: any) {
		return res.status(400).send(e.message)
	}
}

/**
 * Collect a new mood survey
 *
 * @param req
 * @param res
 * @returns PeopleAgeCompare
 */
const peopleSurvey = async (
	req: Request<{}, PeopleSurveyDto>,
	res: Response,
) => {
	try {
		// validate new survey request
		await validate(new PeopleSurveyDto(req.body))

		// insert new survey and return result
		return res.json(await PeopleService.peopleSurvey(req.body))
	} catch (e: any) {
		return res.status(400).send(e.message)
	}
}

/**
 * Compare a person to others in the same age group
 *
 * @param req
 * @param res
 * @returns PeopleAgeCompare
 */
const compareByAge = async (req: Request<EntityFindById>, res: Response) => {
	try {
		// validate search params
		await validate(new EntityFindById(req.params))

		// compare the person to others using age
		const compare = await PeopleService.compareByAge(req.params.id)

		// resturn compare result if person was found
		if (compare) {
			return res.json(compare)
		} else {
			return res.sendStatus(404)
		}
	} catch (e: any) {
		return res.status(400).send(e.message)
	}
}

/**
 * Compare a person to others using many age groups
 *
 * @param req
 * @param res
 * @returns
 */
const compareByAgeGroups = async (
	req: Request<EntityFindById>,
	res: Response,
) => {
	try {
		// validate search params
		await validate(new EntityFindById(req.params))

		// compare the person to others age groups
		const compare = await PeopleService.compareByAgeGroups(req.params.id)

		// resturn compare result if person was found
		if (compare) {
			return res.json(compare)
		} else {
			return res.sendStatus(404)
		}
	} catch (e: any) {
		return res.status(400).send(e.message)
	}
}

// export all the controller functions
export default {
	getOne,
	removeOne,
	peopleSurvey,
	compareByAge,
	compareByAgeGroups,
}
