import 'server-only'

import type { SchemaSearchParam, ColumnTable } from '@/app/system/growth/datasource/people/action/schema'
import type { SupabaseMeta }                   from '@/library/supabase/type'

import { redirect } from 'next/navigation'

import { cache } from 'react'

import { LABEL, PATH, TABLE, TABLE_ACCOUNT, TABLE_COLUMN_SORT } from '@/app/system/growth/datasource/people/action/schema'
import { server }                                               from '@/library/supabase/server'

export const list = cache(async (params: SchemaSearchParam): Promise<Readonly<{ data : readonly ColumnTable[], metadata : SupabaseMeta}>> => {
	const supabase = await server()

	const { page, limit, query, email, sort } = params

	const offset = (page - 1) * limit

	let sortBy		  : string 		   = 'date_creation'
	let sortDirection : 'asc' | 'desc' = 'desc'

	if (sort) {
		const [ field, direction ] = sort.split('-')
		
		if (field && TABLE_COLUMN_SORT.includes(field as typeof TABLE_COLUMN_SORT[number]))
			sortBy = field
		
		if (direction === 'asc' || direction === 'desc')
			sortDirection = direction
	}

	let supabaseQuery = supabase.from(TABLE).select('*, account_people(designation, account(id, name))', { count : 'exact' })

	if (query)
		supabaseQuery = supabaseQuery.ilike('name', '%' + query + '%')

	if (email)
		supabaseQuery = supabaseQuery.ilike('email', '%' + email + '%')

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
		data     : (data ?? []).map(({ account_people, ...column }) => ({ ...column, accountPeople : account_people })) as readonly ColumnTable[],
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

export const listAccount = cache(async (): Promise<{ data : readonly { id : string, name : string }[] }> => {
	const supabase = await server()
	
	const { data, error } = await supabase.from(TABLE_ACCOUNT).select('id, name').order('name', { ascending : true })

	if (error)
		return { data : [] }

	return { data : (data ?? []) as readonly { id : string, name : string }[] }
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
