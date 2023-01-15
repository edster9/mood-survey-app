import { DateTime } from 'luxon'
import openDb from '../../modules/database'
import {
	PeopleSurveyDto,
	People,
	PeopleAgeCompare,
	AgeGroup,
	Survey,
} from './types'

const getOne = async (id: number) => {
	const db = await openDb()

	const person: People | undefined = await db.get(
		`SELECT 
			id, fullName, birthday, lastSurveyTime,
			happyScale, happyAverage, 
			energyScale, energyAverage,
			hopefulnessScale, hopefulnessAverage,
			sleepHours, sleepAverage
			FROM people WHERE id = ?`,
		id,
	)

	// Calculate person age
	if (person) {
		const birthday = DateTime.fromISO(person.birthday)
		person.age = Math.abs(Math.floor(birthday.diffNow('years').years)) - 1
	}

	return person
}

const removeOne = async (id: number) => {
	const db = await openDb()

	await db.run('DELETE FROM servey WHERE peopleId = :id', {
		':id': id,
	})

	await db.run('DELETE FROM people WHERE id = :id', {
		':id': id,
	})
}

const peopleSurvey = async (survey: PeopleSurveyDto) => {
	const db = await openDb()

	let peopleId = 0
	const surveyTime = DateTime.now().toISO()

	const result: People | undefined = await db.get(
		'SELECT * FROM people WHERE fullName = :fullName AND birthday = :birthday',
		{
			':fullName': survey.fullName,
			':birthday': survey.birthday,
		},
	)

	if (!result) {
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

		if (insertPeopleResult.lastID) {
			peopleId = insertPeopleResult.lastID
		}
	} else {
		peopleId = result.id

		// update People table
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

	return compareByAge(peopleId)
}

const compareByAge = async (
	id: number,
): Promise<PeopleAgeCompare | undefined> => {
	const db = await openDb()

	const person = await getOne(id)

	if (!person) {
		return
	}

	const ageCompareTo = DateTime.now()
		.minus({ years: person.age })
		.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
	//console.log('compare years to', ageCompareTo.toString())

	const ageCompareFrom = DateTime.now()
		.minus({ years: person.age + 1 })
		.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
	//console.log('compare years from', ageCompareFrom.toString())

	// const rawAverages = await db.all(
	// 	`SELECT
	// 		id,
	// 		happyAverage,
	// 		energyAverage,
	// 		hopefulnessAverage,
	// 		sleepAverage
	// 		FROM people WHERE birthday >= :from AND birthday <= :to
	// 		AND id != :id`,
	// 	{
	// 		':id': id,
	// 		':from': ageCompareFrom.toISODate(),
	// 		':to': ageCompareTo.toISODate(),
	// 	},
	// )
	// console.log('rawAverages', rawAverages)

	let ownAgeGroup: AgeGroup | undefined = await db.get(
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

	if (ownAgeGroup && ownAgeGroup.energyAverage) {
		ownAgeGroup.ageGroup = person.age.toString()
	} else {
		ownAgeGroup = undefined
	}

	const peopleAgeCompare: PeopleAgeCompare = {
		person,
		ownAgeGroup,
		previousSurvey: await getPreviousSruvey(id, person.lastSurveyTime),
		otherAgeGroups: [],
	}

	return peopleAgeCompare
}

const getPreviousSruvey = async (id: number, lastSurveyTime: string) => {
	const db = await openDb()

	//console.log('lastSurveyTime', lastSurveyTime)

	const result = await db.get<Survey>(
		`SELECT * FROM survey
			WHERE peopleId = :peopleId AND timestamp < :lastSurveyTime ORDER BY timestamp DESC`,
		{
			':peopleId': id,
			':lastSurveyTime': lastSurveyTime,
		},
	)

	//console.log('survey', result)

	return result
}

const compareByAgeGroups = async (id: number) => {
	// TODO:
}

export default {
	getOne,
	removeOne,
	peopleSurvey,
	compareByAge,
	compareByAgeGroups,
}
