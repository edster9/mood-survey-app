import {
	IsString,
	IsDateString,
	IsNumber,
	Min,
	Max,
	IsBoolean,
} from 'class-validator'

/**
 * People definition
 *
 * Represents a persons detail with the currnet mood setting and averages
 */
export interface People {
	id: number
	age: number
	fullName: string
	birthday: string
	happyScale: number
	happyAverage: number
	happyAggregate: number
	happyCount: number
	energyScale: number
	energyAgerage: number
	energyAggregate: number
	energyCount: number
	hopefulnessScale: number
	hopefulnessAverage: number
	hopefulnessAggregate: number
	hopefulnessCount: number
	sleepHours: number
	sleepAverage: number
	sleepAggregate: number
	sleepCount: number
	lastSurveyTime: string
}

/**
 * Age Group definition
 *
 * Represents mood averages for a given age group
 */
export interface AgeGroup {
	ageGroup: string
	happyAverage: number
	energyAverage: number
	hopefulnessAverage: number
	sleepAverage: number
}

/**
 * Survey definition
 *
 * Represents a raw survey collection event
 */
export interface Survey {
	id: number
	peopleId: number
	happyScale: number
	energyScale: number
	hopefulnessScale: number
	sleepHours: number
	timestamp: string
}

/**
 * People Age Compare result
 *
 * The results from running an age compare operation
 *
 */
export interface PeopleAgeCompare {
	person: People
	previousSurvey?: Survey
	ownAgeGroup?: AgeGroup
	otherAgeGroups?: AgeGroup[]
}

/**
 * People Survey DTO
 *
 * Data transfer object with validation for collecting a new mood survey request
 *
 */
export class PeopleSurveyDto {
	constructor(data: PeopleSurveyDto) {
		this.fullName = data.fullName
		this.birthday = data.birthday
		this.happyScale = data.happyScale
		this.energyScale = data.energyScale
		this.hopefulnessScale = data.hopefulnessScale
		this.sleepHours = data.sleepHours
		this.compareToAll = data.compareToAll
	}

	@IsString()
	fullName: string

	@IsDateString()
	birthday: Date

	@IsNumber({ maxDecimalPlaces: 0 })
	@Min(1)
	@Max(5)
	happyScale: number

	@IsNumber({ maxDecimalPlaces: 0 })
	@Min(1)
	@Max(5)
	energyScale: number

	@IsNumber({ maxDecimalPlaces: 0 })
	@Min(1)
	@Max(5)
	hopefulnessScale: number

	@IsNumber({ maxDecimalPlaces: 0 })
	@Min(0)
	@Max(12)
	sleepHours: number

	@IsBoolean()
	compareToAll: boolean
}
