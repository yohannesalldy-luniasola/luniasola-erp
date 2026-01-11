import { z } from 'zod'

export type SchemaAction<T = Record<string, unknown>> = | {
	status    : 'idle' 
	timestamp : number 
} | { 
	status    : 'success' 
	message   : string 
	timestamp : number
	data?     : unknown
} | { 
	status    : 'error' 
	message   : string 
	errors?   : { [K in keyof T]?: string[] }
	inputs?   : Partial<T>
	timestamp : number 
}

export const SEARCH_PARAMS_LIMIT   = [ 10, 25, 50, 100 ]      as const
export const SEARCH_PARAMS_INITIAL = { page : 1, limit : 25 } as const
export const SEARCH_PARAMS         = z.object({
	page  : z.coerce.number().int().positive().default(SEARCH_PARAMS_INITIAL.page),
	limit : z.coerce.number().int().positive().max(100).default(SEARCH_PARAMS_INITIAL.limit),
	query : z.string().optional(),
	sort  : z.string().optional(),
})
