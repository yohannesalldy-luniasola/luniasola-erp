export type SupabaseMeta = Readonly<{
	total : number
	limit : number
	page : {
		total   : number
		current : number
	},
}>

export type SupabasePayload<T> = Readonly<{
	data     : readonly T[]
	metadata : SupabaseMeta
}>

export type SupabaseSystemColumn = Readonly<{
	id            : string
	date_creation : string
	date_update   : string | null
}>
