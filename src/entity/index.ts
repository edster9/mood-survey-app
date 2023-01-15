import { validate as classValidate } from 'class-validator'

/**
 * Generic class-validator helper function
 *
 * @param entity
 */
export const validate = async (entity: any) => {
	const errors = await classValidate(entity)

	if (errors.length) {
		throw Error(errors.join('\n'))
	}
}
