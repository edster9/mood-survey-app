import { IsNumberString, IsOptional } from 'class-validator'

export class EntityFindById {
	constructor(data: EntityFindById) {
		this.id = data.id
	}

	@IsNumberString()
	id: number
}
