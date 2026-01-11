import type { SchemaAction } from '@/component/utility/schema'

import { BarChart3 } from 'lucide-react'
import { z }          from 'zod'

import { SEARCH_PARAMS, SEARCH_PARAMS_INITIAL } from '@/component/utility/schema'

export const ICON		          = BarChart3
export const LABEL		          = 'Analytics Metrics' 	   					   as const 
export const PATH  		          = '/system/growth/analytics/metrics' as const 

export const SCHEMA = z.object({
	dateFrom : z.string().optional(),
	dateTo   : z.string().optional(),
	campaign : z.string().optional(),
	channel  : z.string().optional(),
})

export const SCHEMA_SEARCH_PARAMS_INITIAL = SEARCH_PARAMS_INITIAL
export const SCHEMA_SEARCH_PARAMS 		  = SEARCH_PARAMS.extend({
	dateFrom : z.string().optional(),
	dateTo   : z.string().optional(),
	campaign : z.string().optional(),
	channel  : z.string().optional(),
})

export type Schema 		      = z.infer<typeof SCHEMA>
export type SchemaSearchParam = z.infer<typeof SCHEMA_SEARCH_PARAMS>
export type Action            = SchemaAction<Schema>
export type Error			  = Record<string, string[]>
