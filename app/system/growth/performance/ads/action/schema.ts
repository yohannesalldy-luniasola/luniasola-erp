import type { SchemaAction }         from '@/component/utility/schema'
import type { SupabaseSystemColumn } from '@/library/supabase/type'

import { Radio } from 'lucide-react'
import { z }     from 'zod'

import { numberSchema }                                              from '@/component/utility/data'
import { SEARCH_PARAMS, SEARCH_PARAMS_LIMIT, SEARCH_PARAMS_INITIAL } from '@/component/utility/schema'

export type Schema 		      = z.infer<typeof SCHEMA>
export type SchemaSearchParam = z.infer<typeof SCHEMA_SEARCH_PARAMS>
export type Action            = SchemaAction<Schema>
export type Error			  = Record<string, string[]>
export type Column	   		  = typeof TABLE_COLUMNS[number]['key']
export type ColumnSort 		  = typeof TABLE_COLUMN_SORT[number]
export type ColumnVisibility  = Record<Column, boolean>
export type ColumnTable 	  = Readonly<Schema> & SupabaseSystemColumn & {
	adsPerformanceAccount?: {
		account: {
			id   : string
			name : string
		} | null
	}[]
}

export const ICON		            	   = Radio
export const LABEL		            	   = 'Ads Performance' 	   			  as const 
export const PATH  		            	   = '/system/growth/performance/ads' as const 
export const TABLE                  	   = 'ads_performance' 		 	 	  as const
export const TABLE_ACCOUNT          	   = 'account' 		 	 	 	 	  as const
export const TABLE_ADS_PERFORMANCE_ACCOUNT = 'ads_performance_account' 		  as const
export const TABLE_COLUMNS 		  		   = [
	{ 
		key      : 'channel', 
		label    : 'Channel', 
		initial  : true,
		sort     : true,
		lock     : true,
		skeleton : 'w-26',
	},
	{ 
		key      : 'date', 
		label    : 'Date', 
		initial  : true,
		sort     : true,
		lock     : true,
		skeleton : 'w-24',
	},
	{ 
		key      : 'cost', 
		label    : 'Cost', 
		initial  : true,
		sort     : true,
		lock     : false,
		skeleton : 'w-32',
	},
	{ 
		key      : 'lead', 
		label    : 'Incoming Lead', 
		initial  : true,
		sort     : true,
		lock     : false,
		skeleton : 'w-10',
	},
	{ 
		key      : 'lead_qualified', 
		label    : 'Qualified Lead', 
		initial  : true,
		sort     : true,
		lock     : false,
		skeleton : 'w-10',
	},
	{ 
		key      : 'account', 
		label    : 'Qualified Lead Account', 
		initial  : true,
		sort     : false,
		lock     : false,
		skeleton : 'w-48',
	},
] as const
export const TABLE_COLUMN		  = TABLE_COLUMNS.map((column) => column.key) 		 	 	 	 	 	 	 						  as unknown as [Column, ...Column[]]
export const TABLE_COLUMN_LOCKED  = TABLE_COLUMNS.filter((column) => column.lock).map((column) => column.key) 						  as unknown as readonly Column[]
export const TABLE_COLUMN_SORT    = [ ...TABLE_COLUMNS.filter((column) => column.sort).map((column) => column.key), 'date_creation' ] as const
export const TABLE_COLUMN_INITIAL = Object.fromEntries(TABLE_COLUMNS.map((column) => [ column.key, column.initial ])) 				  as Record<Column, boolean>
export const TABLE_COLUMN_LABELS  = Object.fromEntries(TABLE_COLUMNS.map((column) => [ column.key, column.label ])) 			 	  as Record<Column, string>

export const SCHEMA = z.object({
	channel               : z.enum([ 'Google Ads', 'Meta Ads' ], { message : 'Channel is a mandatory field' }),
	date                  : z.string().min(1, 'Date is a mandatory field').refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), { message : 'Date format is malformed' }),
	cost                  : numberSchema({ field : 'Cost', mandatory : false,	min : 0,  max : 10000000.00 }).nullable(),
	lead                  : numberSchema({ field : 'Incoming Lead', mandatory : true, min : 0, max : 32767 }),
	lead_qualified        : numberSchema({ field : 'Qualified Lead', mandatory : true, min : 0, max : 32767 }),
	adsPerformanceAccount : z.string().optional().default('[]'),
})
export const SCHEMA_SEARCH_PARAMS_INITIAL = SEARCH_PARAMS_INITIAL
export const SCHEMA_LIMIT 		  		  = SEARCH_PARAMS_LIMIT
export const SCHEMA_SEARCH_PARAMS 		  = SEARCH_PARAMS.extend({
	channel : z.string().optional(),
})
