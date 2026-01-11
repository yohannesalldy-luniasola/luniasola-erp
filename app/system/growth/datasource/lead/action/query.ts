import 'server-only'

import type { SchemaSearchParam, ColumnTable } from '@/app/system/growth/datasource/lead/action/schema'
import type { SupabaseMeta }                   from '@/library/supabase/type'

import { redirect } from 'next/navigation'

import { cache } from 'react'

import { LABEL, PATH, TABLE, TABLE_COLUMN_SORT } from '@/app/system/growth/datasource/lead/action/schema'
import { server }                                from '@/library/supabase/server'

export const list = cache(async (params: SchemaSearchParam): Promise<Readonly<{ data : readonly ColumnTable[], metadata : SupabaseMeta}>> => {
	const supabase = await server()

	const { page, limit, query, gclid, fbclid, status, sort } = params

	const offset = (page - 1) * limit

	let sortBy		  : string 		   = 'created_at'
	let sortDirection : 'asc' | 'desc' = 'desc'

	if (sort) {
		const [ field, direction ] = sort.split('-')
		
		if (field && TABLE_COLUMN_SORT.includes(field as typeof TABLE_COLUMN_SORT[number]))
			sortBy = field
		
		if (direction === 'asc' || direction === 'desc')
			sortDirection = direction
	}

	let supabaseQuery = supabase.from(TABLE).select('*', { count : 'exact' })

	if (query)
		supabaseQuery = supabaseQuery.ilike('name', '%' + query + '%')

	if (gclid)
		supabaseQuery = supabaseQuery.ilike('gclid', '%' + gclid + '%')

	if (fbclid)
		supabaseQuery = supabaseQuery.ilike('fbclid', '%' + fbclid + '%')

	if (status)
		supabaseQuery = supabaseQuery.eq('status', status)

	supabaseQuery = supabaseQuery.order(sortBy, { ascending : sortDirection === 'asc' }).order('id', { ascending : true }).range(offset, offset + limit - 1)

	const { data, error, count } = await supabaseQuery

	if (error)
		throw new Error((LABEL + ' ' + 'fetch was unsuccessful') + ':' + ' ' + (error.message ?? JSON.stringify(error)))

	const total = count ?? 0

	if (page > (Math.ceil(total / limit)) && total > 0) {
		const redirection = new URLSearchParams()

		Object.entries(params).forEach(([ key, value ]) => (value !== null && value !== undefined && value !== '' && key !== 'page' && key !== 'limit') && redirection.set(key, String(value)))
		redirection.set('page', String((Math.ceil(total / limit))))

		redirect(PATH + '?' + redirection.toString())
	}

	return {
		data     : (data ?? []) as readonly ColumnTable[],
		metadata : {
			total,
			limit,
			page : {
				total   : Math.ceil(total / limit),
				current : page,
			},
		},
	}
})

export const get = cache(async (id: string): Promise<ColumnTable | null> => {
	if (!id)
		return null

	const supabase 		  = await server()
	const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()

	if (error)
		return null

	return data as ColumnTable
})
