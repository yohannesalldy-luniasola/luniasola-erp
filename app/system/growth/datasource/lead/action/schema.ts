import type { SchemaAction }         from '@/component/utility/schema'
import type { SupabaseSystemColumn } from '@/library/supabase/type'

import { BadgeDollarSign } from 'lucide-react'
import { z }               from 'zod'

import { SEARCH_PARAMS, SEARCH_PARAMS_LIMIT, SEARCH_PARAMS_INITIAL } from '@/component/utility/schema'

export type Schema 		      = z.infer<typeof SCHEMA>
export type SchemaSearchParam = z.infer<typeof SCHEMA_SEARCH_PARAMS>
export type Action            = SchemaAction<Schema>
export type Error			  = Record<string, string[]>
export type Column	   		  = typeof TABLE_COLUMNS[number]['key']
export type ColumnSort 		  = typeof TABLE_COLUMN_SORT[number]
export type ColumnVisibility  = Record<Column, boolean>
export type ColumnTable 	  = Readonly<Schema> & SupabaseSystemColumn

export const ICON		          = BadgeDollarSign
export const LABEL		          = 'Lead' 	   					   as const 
export const PATH  		          = '/system/growth/datasource/lead' as const 
export const TABLE                = 'lead' 		 	 	 	 	   as const
export const TABLE_COLUMNS 		  = [
	{ 
		key      : 'name', 
		label    : 'Name', 
		initial  : true,
		sort     : true,
		lock     : true,
		skeleton : 'w-48',
	},
	{ 
		key      : 'gclid', 
		label    : 'GCLID', 
		initial  : true,
		sort     : true,
		lock     : false,
		skeleton : 'w-32',
	},
	{ 
		key      : 'fbclid', 
		label    : 'FBCLID', 
		initial  : true,
		sort     : true,
		lock     : false,
		skeleton : 'w-32',
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
export const TABLE_COLUMN_SORT    = [ ...TABLE_COLUMNS.filter((column) => column.sort).map((column) => column.key), 'created_at' ] as const
export const TABLE_COLUMN_INITIAL = Object.fromEntries(TABLE_COLUMNS.map((column) => [ column.key, column.initial ])) 				  as Record<Column, boolean>
export const TABLE_COLUMN_LABELS  = Object.fromEntries(TABLE_COLUMNS.map((column) => [ column.key, column.label ])) 			 	  as Record<Column, string>

export const SCHEMA = z.object({
	name   : z.string().min(1, 'Name is a mandatory field').max(255),
	gclid  : z.string().optional().nullable(),
	fbclid : z.string().optional().nullable(),
	status : z.enum([ 'pending', 'in progress', 'cancelled', 'passed' ], { error : LABEL + ' ' + 'Status is a mandatory field' }).default('pending'),
})
export const SCHEMA_SEARCH_PARAMS_INITIAL = SEARCH_PARAMS_INITIAL
export const SCHEMA_LIMIT 		  		  = SEARCH_PARAMS_LIMIT
export const SCHEMA_SEARCH_PARAMS 		  = SEARCH_PARAMS.extend({
	gclid  : z.string().optional(),
	fbclid : z.string().optional(),
	status : z.enum([ 'pending', 'in progress', 'cancelled', 'passed' ]).optional(),
})
