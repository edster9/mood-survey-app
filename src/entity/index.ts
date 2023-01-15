import { validate as classValidate } from 'class-validator'

export const validate = async (entity: any) => {
	const errors = await classValidate(entity)

	if (errors.length) {
		throw Error(errors.join('\n'))
	}
}
