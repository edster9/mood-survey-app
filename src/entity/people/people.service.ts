import { DateTime } from 'luxon'
import openDb from '../../modules/database'
import {
	PeopleSurveyDto,
	People,
	PeopleAgeCompare,
	AgeGroup,
	Survey,
} from './types'

/**
 * Find a person by id
 *
 * @param {number} id
 * @returns People
 */
const getOne = async (id: number) => {
	// get a database connection
	const db = await openDb()

	// query the people table and search by id
	const person = await db.get<People>(
		`SELECT 
			id, fullName, birthday, lastSurveyTime,
			happyScale, happyAverage, 
			energyScale, energyAverage,
			hopefulnessScale, hopefulnessAverage,
			sleepHours, sleepAverage
			FROM people WHERE id = ?`,
		id,
	)

	// calculate person age
	if (person) {
		const birthday = DateTime.fromISO(person.birthday)
		person.age = Math.abs(Math.floor(birthday.diffNow('years').years)) - 1
	}

	// return the Person object
	return person
}

/**
 * Delete a person and all survey logs by id
 *
 * @param {number} id
 */
const removeOne = async (id: number) => {
	// get a database connection
	const db = await openDb()

	// delete all the survey logs for this person
	await db.run('DELETE FROM survey WHERE peopleId = :id', {
		':id': id,
	})

	// delete the person record
	await db.run('DELETE FROM people WHERE id = :id', {
		':id': id,
	})
}

/**
 * Collect a new mood survey
 *
 * @param {PeopleSurveyDto} survey
 * @returns PeopleAgeCompare
 */
const peopleSurvey = async (
	survey: PeopleSurveyDto,
): Promise<PeopleAgeCompare> => {
	// get a database connection
	const db = await openDb()

	let personId = 0
	// mark the current time
	const surveyTime = DateTime.now().toISO()

	// does the current person already exists?
	const person = await db.get<People>(
		'SELECT * FROM people WHERE fullName = :fullName AND birthday = :birthday',
		{
			':fullName': survey.fullName,
			':birthday': survey.birthday,
		},
	)

	if (!person) {
		// If the person does not exists then create a new row in the person table
		const insertPeopleResult = await db.run(
			`INSERT INTO people
				(
					fullName, birthday, happyScale, happyAverage, happyAggregate, happyCount, 
					energyScale, energyAverage, energyAggregate, energyCount, 
					hopefulnessScale, hopefulnessAverage, hopefulnessAggregate, hopefulnessCount,
					sleepHours, sleepAverage, sleepAggregate, sleepCount, lastSurveyTime
				) 
				VALUES 
				(
					:fullName, :birthday, :happyScale, :happyAverage, :happyAggregate, :happyCount, 
					:energyScale, :energyAverage, :energyAggregate, :energyCount, 
					:hopefulnessScale, :hopefulnessAverage, :hopefulnessAggregate, :hopefulnessCount,
					:sleepHours, :sleepAverage, :sleepAggregate, :sleepCount, :lastSurveyTime
				)`,
			{
				':fullName': survey.fullName,
				':birthday': survey.birthday,
				':happyScale': survey.happyScale,
				':happyAverage': survey.happyScale,
				':happyAggregate': survey.happyScale,
				':happyCount': 1,
				':energyScale': survey.energyScale,
				':energyAverage': survey.energyScale,
				':energyAggregate': survey.energyScale,
				':energyCount': 1,
				':hopefulnessScale': survey.hopefulnessScale,
				':hopefulnessAverage': survey.hopefulnessScale,
				':hopefulnessAggregate': survey.hopefulnessScale,
				':hopefulnessCount': 1,
				':sleepHours': survey.sleepHours,
				':sleepAverage': survey.sleepHours,
				':sleepAggregate': survey.sleepHours,
				':sleepCount': 1,
				':lastSurveyTime': surveyTime,
			},
		)

		// get the new person id
		if (insertPeopleResult.lastID) {
			personId = insertPeopleResult.lastID
		}
	} else {
		// if the person already exists then update the table with latest survey data
		person.happyCount++
		person.happyAggregate += survey.happyScale
		person.happyAverage = Math.round(person.happyAggregate / person.happyCount)

		person.energyCount++
		person.energyAggregate += survey.energyScale
		person.energyAgerage = Math.round(
			person.energyAggregate / person.energyCount,
		)

		person.hopefulnessCount++
		person.hopefulnessAggregate += survey.hopefulnessScale
		person.hopefulnessAverage = Math.round(
			person.hopefulnessAggregate / person.hopefulnessCount,
		)

		person.sleepCount++
		person.sleepAggregate += survey.sleepHours
		person.sleepAverage = Math.round(person.sleepAggregate / person.sleepCount)

		// get the current person id
		personId = person.id

		// update the database with new survey data
		await db.run(
			`UPDATE people SET
					happyScale = :happyScale,
					happyAverage = :happyAverage, 
					happyAggregate = :happyAggregate, 
					happyCount = :happyCount, 
					energyScale = :energyScale, 
					energyAverage = :energyAverage, 
					energyAggregate = :energyAggregate, 
					energyCount = :energyCount, 
					hopefulnessScale = :hopefulnessScale, 
					hopefulnessAverage = :hopefulnessAverage, 
					hopefulnessAggregate = :hopefulnessAggregate, 
					hopefulnessCount = :hopefulnessCount,
					sleepHours = :sleepHours, 
					sleepAverage = :sleepAverage, 
					sleepAggregate = :sleepAggregate, 
					sleepCount = :sleepCount,
					lastSurveyTime = :lastSurveyTime
					WHERE id = :id	
				`,
			{
				':id': personId,
				':happyScale': survey.happyScale,
				':happyAverage': person.happyAverage,
				':happyAggregate': person.happyAggregate,
				':happyCount': person.happyCount,
				':energyScale': survey.energyScale,
				':energyAverage': person.energyAgerage,
				':energyAggregate': person.energyAggregate,
				':energyCount': person.energyCount,
				':hopefulnessScale': survey.hopefulnessScale,
				':hopefulnessAverage': person.hopefulnessAverage,
				':hopefulnessAggregate': person.hopefulnessAggregate,
				':hopefulnessCount': person.hopefulnessCount,
				':sleepHours': survey.sleepHours,
				':sleepAverage': person.sleepAverage,
				':sleepAggregate': person.sleepAggregate,
				':sleepCount': person.sleepCount,
				':lastSurveyTime': surveyTime,
			},
		)
	}

	// insert into survey logs
	await db.run(
		`INSERT INTO survey
			(
				peopleId, happyScale, energyScale, hopefulnessScale, sleepHours, timestamp
			) 
			VALUES 
			(
				:peopleId, :happyScale, :energyScale, :hopefulnessScale, :sleepHours, :timestamp
			)`,
		{
			':peopleId': personId,
			':happyScale': survey.happyScale,
			':energyScale': survey.energyScale,
			':hopefulnessScale': survey.hopefulnessScale,
			':sleepHours': survey.sleepHours,
			':timestamp': surveyTime,
		},
	)

	const newPerson: People = (await getOne(personId)) as People

	const result: PeopleAgeCompare = {
		person: newPerson,
	}

	const previousSurvey = await getPreviousSruvey(
		personId,
		newPerson.lastSurveyTime,
	)
	if (previousSurvey) {
		result.previousSurvey = previousSurvey
	}

	const ownAgeGroup = await compareByAge(personId, newPerson.age)
	if (ownAgeGroup) {
		result.ownAgeGroup = ownAgeGroup
	}

	return result
}

/**
 * Compare a person to others in the same age group
 *
 * @param {number} id
 * @returns PeopleAgeCompare
 */
const compareByAge = async (
	id: number,
	age?: number,
): Promise<AgeGroup | null | undefined> => {
	// get a database connection
	const db = await openDb()

	if (!age) {
		// find the existing person
		const person = await getOne(id)

		if (!person) {
			return
		}

		age = person.age
	}

	// calculate the age from compare from the givin person's age
	const ageCompareFrom = DateTime.now()
		.minus({ years: age + 1 })
		.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
	//console.log('compare years from', ageCompareFrom.toISO())

	// calculate the age to compare from the givin person's age
	const ageCompareTo = DateTime.now()
		.minus({ years: age })
		.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
	//console.log('compare years to', ageCompareTo.toISO())

	// run query on all existing people in the same age group
	// and calculate the averages
	let ownAgeGroup = await db.get<AgeGroup | null>(
		`SELECT
			round(avg(happyAverage)) as happyAverage, 
			round(avg(energyAverage)) as energyAverage,
			round(avg(hopefulnessAverage)) as hopefulnessAverage,
			round(avg(sleepAverage)) as sleepAverage
			FROM people WHERE birthday >= :from AND birthday <= :to
			AND id != :id`,
		{
			':id': id,
			':from': ageCompareFrom.toISO(),
			':to': ageCompareTo.toISO(),
		},
	)
	//console.log('averages', ownAgeGroup)

	// are there any age groups comparable to the person's age group?
	if (ownAgeGroup && ownAgeGroup.energyAverage) {
		// define the age group code for this age group
		ownAgeGroup.ageGroup = age.toString()
	} else {
		ownAgeGroup = null
	}

	return ownAgeGroup
}

/**
 * Query for the previous survey of a person by id and survey time offset
 *
 * @param {number} id
 * @param {DateString} lastSurveyTime
 * @returns
 */
const getPreviousSruvey = async (id: number, lastSurveyTime: string) => {
	// get a database connection
	const db = await openDb()

	// query the survey log table for the last survey entered by a person
	const result = await db.get<Survey>(
		`SELECT * FROM survey
			WHERE peopleId = :peopleId AND timestamp < :lastSurveyTime ORDER BY timestamp DESC`,
		{
			':peopleId': id,
			':lastSurveyTime': lastSurveyTime,
		},
	)

	// return the data
	return result
}

/**
 * Compare a person to others using many age groups
 *
 * @param {number} id
 */
const compareByAgeGroups = async (id: number) => {
	// get a database connection
	const db = await openDb()

	// find the existing person
	const person = await getOne(id)

	if (!person) {
		return
	}

	// age compare groups
	const ageCompares: { from: number; to: number }[] = [
		{
			from: 10,
			to: 0,
		},
		{
			from: 11,
			to: 15,
		},
		{
			from: 21,
			to: 16,
		},
		{
			from: 30,
			to: 22,
		},
		{
			from: 40,
			to: 31,
		},
		{
			from: 50,
			to: 41,
		},
		{
			from: 70,
			to: 51,
		},
		{
			from: -1, // from infinity
			to: 71,
		},
	]

	// return result set
	const result = Array<AgeGroup>()

	for (let ageCompare of ageCompares) {
		//console.log('ageCompare', ageCompare)

		// Is the from date starting at Infinity?
		const fromInfinity = ageCompare.from >= 0 ? false : true

		// calculate the age from compare from the age group array
		const ageCompareFrom = DateTime.now()
			.minus({ years: ageCompare.from })
			.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

		// calculate the age from compare to the age group array
		const ageCompareTo = DateTime.now()
			.minus({ years: ageCompare.to })
			.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

		const sqlBindParams: any = {
			':id': id,
			':to': ageCompareTo.toISO(),
		}

		// add the :from binding for the sql query only if not searching from infinity
		if (!fromInfinity) {
			sqlBindParams[':from'] = ageCompareFrom.toISO()
		}

		// run query on all existing people in the same age group
		// and calculate the averages
		let ownAgeGroup = await db.get<AgeGroup>(
			`SELECT
				round(avg(happyAverage)) as happyAverage, 
				round(avg(energyAverage)) as energyAverage,
				round(avg(hopefulnessAverage)) as hopefulnessAverage,
				round(avg(sleepAverage)) as sleepAverage
				FROM people WHERE ${
					!fromInfinity ? 'birthday >= :from AND' : ''
				} birthday <= :to
				AND id != :id`,
			sqlBindParams,
		)
		// console.log(
		// 	'averages',
		// 	ownAgeGroup,
		// 	ageCompareTo.toISO(),
		// 	fromInfinity ? 'Infinity' : ageCompareFrom.toISO(),
		// )

		if (ownAgeGroup && ownAgeGroup.happyAverage) {
			// define the age group code for this age group
			ownAgeGroup.ageGroup = `${ageCompare.to}-${
				fromInfinity ? 'Infinity' : ageCompare.from
			}`

			// add this age group to the result set
			result.push(ownAgeGroup)
		}
	}

	return result
}

// export all the service functions
export default {
	getOne,
	removeOne,
	peopleSurvey,
	compareByAge,
	compareByAgeGroups,
}
