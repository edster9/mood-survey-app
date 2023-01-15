import { Request, Response } from 'express'
import PeopleService from './people.service'
import { validate } from '../../entity'
import { PeopleSurveyDto } from './types'
import { EntityFindById } from '../../entity/types'

const getOne = async (req: Request<EntityFindById>, res: Response) => {
	try {
		await validate(new EntityFindById(req.params))

		const person = await PeopleService.getOne(req.params.id)

		if (person) {
			return res.json(person)
		} else {
			return res.sendStatus(404)
		}
	} catch (e: any) {
		return res.status(400).send(e.message)
	}
}

const removeOne = async (req: Request<EntityFindById>, res: Response) => {
	try {
		await validate(new EntityFindById(req.params))

		await PeopleService.removeOne(req.params.id)

		return res.sendStatus(204)
	} catch (e: any) {
		return res.status(400).send(e.message)
	}
}

const peopleSurvey = async (
	req: Request<{}, PeopleSurveyDto>,
	res: Response,
) => {
	try {
		await validate(new PeopleSurveyDto(req.body))

		return res.json(await PeopleService.peopleSurvey(req.body))
	} catch (e: any) {
		return res.status(400).send(e.message)
	}
}

const compareByAge = async (req: Request<EntityFindById>, res: Response) => {
	try {
		await validate(new EntityFindById(req.params))

		const compare = await PeopleService.compareByAge(req.params.id)

		if (compare) {
			return res.json(compare)
		} else {
			return res.sendStatus(404)
		}
	} catch (e: any) {
		return res.status(400).send(e.message)
	}
}

const compareByAgeGroups = async (
	req: Request<EntityFindById>,
	res: Response,
) => {
	try {
		// TODO:

		res.sendStatus(501)
	} catch (e: any) {
		return res.status(400).send(e.message)
	}
}

export default {
	getOne,
	removeOne,
	peopleSurvey,
	compareByAge,
	compareByAgeGroups,
}
