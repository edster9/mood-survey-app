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
