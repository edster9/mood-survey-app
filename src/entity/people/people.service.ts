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
	await db.run('DELETE FROM servey WHERE peopleId = :id', {
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
const peopleSurvey = async (survey: PeopleSurveyDto) => {
	// get a database connection
	const db = await openDb()

	let peopleId = 0
	// mark the current time
	const surveyTime = DateTime.now().toISO()

	// does the current person already exists?
	const result = await db.get<People>(
		'SELECT * FROM people WHERE fullName = :fullName AND birthday = :birthday',
		{
			':fullName': survey.fullName,
			':birthday': survey.birthday,
		},
	)

	if (!result) {
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
			peopleId = insertPeopleResult.lastID
		}
	} else {
		// if the person already exists then update the table with latest survey data
		result.happyCount++
		result.happyAggregate += survey.happyScale
		result.happyAverage = Math.round(result.happyAggregate / result.happyCount)

		result.energyCount++
		result.energyAggregate += survey.energyScale
		result.energyAgerage = Math.round(
			result.energyAggregate / result.energyCount,
		)

		result.hopefulnessCount++
		result.hopefulnessAggregate += survey.hopefulnessScale
		result.hopefulnessAverage = Math.round(
			result.hopefulnessAggregate / result.hopefulnessCount,
		)

		result.sleepCount++
		result.sleepAggregate += survey.sleepHours
		result.sleepAverage = Math.round(result.sleepAggregate / result.sleepCount)

		// get the current person id
		peopleId = result.id

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
				':id': peopleId,
				':happyScale': survey.happyScale,
				':happyAverage': result.happyAverage,
				':happyAggregate': result.happyAggregate,
				':happyCount': result.happyCount,
				':energyScale': survey.energyScale,
				':energyAverage': result.energyAgerage,
				':energyAggregate': result.energyAggregate,
				':energyCount': result.energyCount,
				':hopefulnessScale': survey.hopefulnessScale,
				':hopefulnessAverage': result.hopefulnessAverage,
				':hopefulnessAggregate': result.hopefulnessAggregate,
				':hopefulnessCount': result.hopefulnessCount,
				':sleepHours': survey.sleepHours,
				':sleepAverage': result.sleepAverage,
				':sleepAggregate': result.sleepAggregate,
				':sleepCount': result.sleepCount,
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
			':peopleId': peopleId,
			':happyScale': survey.happyScale,
			':energyScale': survey.energyScale,
			':hopefulnessScale': survey.hopefulnessScale,
			':sleepHours': survey.sleepHours,
			':timestamp': surveyTime,
		},
	)

	// compare the age groups and retrun the data
	return compareByAge(peopleId)
}

/**
 * Compare a person to others in the same age group
 *
 * @param {number} id
 * @returns PeopleAgeCompare
 */
const compareByAge = async (
	id: number,
): Promise<PeopleAgeCompare | undefined> => {
	// get a database connection
	const db = await openDb()

	// find the existing person
	const person = await getOne(id)

	if (!person) {
		return
	}

	// calculate the age from compare from the givin person's age
	const ageCompareFrom = DateTime.now()
		.minus({ years: person.age + 1 })
		.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
	//console.log('compare years from', ageCompareFrom.toString())

	// calculate the age to compare from the givin person's age
	const ageCompareTo = DateTime.now()
		.minus({ years: person.age })
		.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
	//console.log('compare years to', ageCompareTo.toString())

	// run query on all existing people in the same age group
	// and calculate the averages
	let ownAgeGroup = await db.get<AgeGroup>(
		`SELECT
			round(avg(happyAverage)) as happyAverage, 
			round(avg(energyAverage)) as energyAverage,
			round(avg(hopefulnessAverage)) as hopefulnessAverage,
			round(avg(sleepAverage)) as sleepAverage
			FROM people WHERE birthday > :from AND birthday <= :to
			AND id != :id`,
		{
			':id': id,
			':from': ageCompareFrom.toISODate(),
			':to': ageCompareTo.toISODate(),
		},
	)
	//console.log('averages', averages)

	// are there any age groups comparable to the person's age group?
	if (ownAgeGroup && ownAgeGroup.energyAverage) {
		ownAgeGroup.ageGroup = person.age.toString()
	} else {
		ownAgeGroup = undefined
	}

	// prepare the result set for the compare age opeartion
	const peopleAgeCompare: PeopleAgeCompare = {
		person,
		ownAgeGroup,
		previousSurvey: await getPreviousSruvey(id, person.lastSurveyTime),
		otherAgeGroups: [],
	}

	// return the data
	return peopleAgeCompare
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

	// TODO: work in progress

	return {}
}

// export all the service functions
export default {
	getOne,
	removeOne,
	peopleSurvey,
	compareByAge,
	compareByAgeGroups,
}
