import { IsNumberString, IsOptional } from 'class-validator'

/**
 * Find enetity search object
 */
export class EntityFindById {
	constructor(data: EntityFindById) {
		this.id = data.id
	}

	@IsNumberString()
	id: number
}
