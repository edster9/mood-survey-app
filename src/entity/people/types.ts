import { IsString, IsDateString, IsNumber, Min, Max } from 'class-validator'

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

export interface AgeGroup {
	ageGroup: string
	happyAverage: number
	energyAverage: number
	hopefulnessAverage: number
	sleepAverage: number
}

export interface Survey {
	id: number
	peopleId: number
	happyScale: number
	energyScale: number
	hopefulnessScale: number
	sleepHours: number
	timestamp: string
}

export interface PeopleAgeCompare {
	person: People
	previousSurvey: Survey | undefined
	ownAgeGroup: AgeGroup | undefined
	otherAgeGroups: AgeGroup[]
}

export class PeopleSurveyDto {
	constructor(data: PeopleSurveyDto) {
		this.fullName = data.fullName
		this.birthday = data.birthday
		this.happyScale = data.happyScale
		this.energyScale = data.energyScale
		this.hopefulnessScale = data.hopefulnessScale
		this.sleepHours = data.sleepHours
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
}
