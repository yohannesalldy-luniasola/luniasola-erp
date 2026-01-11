import type { SchemaAction }         from '@/component/utility/schema'
import type { SupabaseSystemColumn } from '@/library/supabase/type'

import { Flag } from 'lucide-react'
import { z }    from 'zod'

import { SEARCH_PARAMS, SEARCH_PARAMS_LIMIT, SEARCH_PARAMS_INITIAL } from '@/component/utility/schema'

export type Schema 		      = z.infer<typeof SCHEMA>
export type SchemaSearchParam = z.infer<typeof SCHEMA_SEARCH_PARAMS>
export type Action            = SchemaAction<Schema>
export type Error			  = Record<string, string[]>
export type Column	   		  = typeof TABLE_COLUMNS[number]['key']
export type ColumnSort 		  = typeof TABLE_COLUMN_SORT[number]
export type ColumnVisibility  = Record<Column, boolean>
export type ColumnTable       = Readonly<Schema> & SupabaseSystemColumn

export const ICON		   = Flag
export const LABEL		   = 'Account' 	   					     as const 
export const PATH  		   = '/system/growth/datasource/account' as const 
export const TABLE         = 'account' 		 	 	 	 	 	 as const 
export const TABLE_COLUMNS = [
	{ 
		key      : 'name', 
		label    : 'Name', 
		initial  : true,
		sort     : true,
		lock     : true,
		skeleton : 'w-48',
	},
	{ 
		key      : 'country', 
		label    : 'Country', 
		initial  : true,
		sort     : true,
		lock     : false,
		skeleton : 'w-24',
	},
	{ 
		key      : 'status', 
		label    : 'Status', 
		initial  : true,
		sort     : true,
		lock     : false,
		skeleton : 'w-20',
	},
] as const
export const TABLE_COLUMN		  = TABLE_COLUMNS.map((column) => column.key) 		 	 	 	 	 	 	 						  as unknown as [Column, ...Column[]]
export const TABLE_COLUMN_LOCKED  = TABLE_COLUMNS.filter((column) => column.lock).map((column) => column.key) 						  as unknown as readonly Column[]
export const TABLE_COLUMN_SORT    = [ ...TABLE_COLUMNS.filter((column) => column.sort).map((column) => column.key), 'date_creation' ] as const
export const TABLE_COLUMN_INITIAL = Object.fromEntries(TABLE_COLUMNS.map((column) => [ column.key, column.initial ])) 				  as Record<Column, boolean>
export const TABLE_COLUMN_LABELS  = Object.fromEntries(TABLE_COLUMNS.map((column) => [ column.key, column.label ])) 			 	  as Record<Column, string>

export const SCHEMA = z.object({
	name    : z.string().min(1, LABEL + ' ' + 'name is a mandatory field').max(255),
	country : z.union([
		z.string().min(2, 'Country is a mandatory field').max(2),
		z.literal(''),
	]).optional(),
	status : z.enum([ 'active', 'inactive' ], { error : LABEL + ' ' + 'Status is a mandatory field' }).default('active'),
})
export const SCHEMA_SEARCH_PARAMS_INITIAL = SEARCH_PARAMS_INITIAL
export const SCHEMA_LIMIT 		  		  = SEARCH_PARAMS_LIMIT
export const SCHEMA_SEARCH_PARAMS 		  = SEARCH_PARAMS.extend({
	status : z.enum([ 'active', 'inactive' ]).optional(),
})
