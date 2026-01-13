import type { SchemaAction }         from '@/component/utility/schema'
import type { SupabaseSystemColumn } from '@/library/supabase/type'

import { Handshake } from 'lucide-react'
import { z }         from 'zod'

export type Schema 		      = z.infer<typeof SCHEMA>
export type SchemaSearchParam = z.infer<typeof SCHEMA_SEARCH_PARAMS>
export type Action            = SchemaAction<Schema>
export type Error			  = Record<string, string[]>
export type ColumnTable 	  = Readonly<Schema> & SupabaseSystemColumn

export const ICON		          = Handshake
export const LABEL		          = 'Deal' 	   					   as const 
export const PATH  		          = '/system/growth/datasource/deal' as const 
export const TABLE                = 'deal' 		 	 	 	 	   as const

export const STAGE_VALUES = [ 'Discovery', 'Proposal', 'Negotiation', 'Administration', 'Won', 'Lost' ] as const
export const SOURCE_VALUES = [ 'Upwork', 'Google Ads', 'Referral' ] as const

export const SCHEMA = z.object({
	name    : z.string().min(1, 'Name is a mandatory field').max(255),
	account : z.string().uuid('Account is a mandatory field'),
	amount  : z.coerce.number().int().min(0, 'Amount must be a positive number'),
	source  : z.enum(SOURCE_VALUES, 'Source is a mandatory field'),
	stage   : z.enum(STAGE_VALUES, 'Stage is a mandatory field').default('Discovery'),
})

export const SCHEMA_SEARCH_PARAMS = z.object({
	stage   : z.enum(STAGE_VALUES).optional(),
	source  : z.enum(SOURCE_VALUES).optional(),
	account : z.string().uuid().optional(),
}).passthrough()

export const SCHEMA_SEARCH_PARAMS_INITIAL: SchemaSearchParam = {
	stage   : undefined,
	source  : undefined,
	account : undefined,
}
