import type { SearchParams } from '@/type/next'
import type { z }            from 'zod'

export async function parse<T>(params: SearchParams, schema: z.ZodSchema<T>, fallback: T): Promise<T> {
	const parameters 		= await params
	const { success, data } = schema.safeParse(parameters)

	if (success)
		return data

	return fallback
}
