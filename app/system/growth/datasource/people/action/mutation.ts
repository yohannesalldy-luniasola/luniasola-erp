'use server'

import type { Action, Schema } from '@/app/system/growth/datasource/people/action/schema'

import { revalidatePath } from 'next/cache'

import { flattenError } from 'zod'

import { LABEL, PATH, SCHEMA, TABLE, TABLE_ACCOUNT_PEOPLE } from '@/app/system/growth/datasource/people/action/schema'
import { server }                                           from '@/library/supabase/server'

export async function insert(_: Action, formData: FormData): Promise<Action> {
	const timestamp  = Date.now()
	const payload 	 = Object.fromEntries(formData)
	const validation = SCHEMA.safeParse(payload)

	if (!validation.success)
		return {
			status  : 'error',
			message : LABEL + ' ' + 'form validation was unsuccessful',
			errors  : flattenError(validation.error).fieldErrors,
			inputs  : payload as unknown as Partial<Schema>,
			timestamp,
		}

	try {
		const supabase = await server()
		
		let accountPeople: { account : string, designation : string }[] = []
		
		if (validation.data.accountPeople) {
			try {
				accountPeople = Array.isArray(JSON.parse(validation.data.accountPeople)) ? JSON.parse(validation.data.accountPeople) : []
			} catch {
				accountPeople = []
			}
		}

		// if (accountPeople.length === 0)
		// 	throw new Error('At least one Account must be provided')
        
		const { data: people, error: peopleError } = await supabase.from(TABLE).insert({
			name  : validation.data.name,
			email : validation.data.email,
			phone : validation.data.phone,
		}).select('id').single()

		if (peopleError)
			throw peopleError

		if (people && accountPeople.length > 0) {
			const { error: accountPeopleError } = await supabase.from(TABLE_ACCOUNT_PEOPLE).insert(accountPeople.map(account => ({
				people      : people.id,
				account     : account.account,
				designation : account.designation,
			})))

			if (accountPeopleError)
				throw accountPeopleError
		}

		revalidatePath(PATH)

		return {
			status  : 'success',
			message : LABEL + ' ' + 'creation was completed successfully',
			timestamp,
		}
	} catch (error) {
		let message = LABEL + ' ' + 'creation was unsuccessful'

		if (error instanceof Error)
			message = error.message
		else if (typeof error === 'object' && error !== null && 'message' in error)
			message = String((error as { message : unknown }).message)
		
		return {
			status  : 'error',
			message : message,
			timestamp,
		}
	}
}

export async function update(_: Action, formData: FormData): Promise<Action> {
	const timestamp = Date.now()
	const payload   = Object.fromEntries(formData)
	const id 		= formData.get('id')
    
	if (!id || typeof id !== 'string')
		return {
			status  : 'error',
			message : LABEL + ' ' + 'identification is missing or invalid',
			inputs  : payload as unknown as Partial<Schema>,
			timestamp,
		}

	const validation = SCHEMA.safeParse(payload)

	if (!validation.success)
		return {
			status  : 'error',
			message : LABEL + ' ' + 'form validation was unsuccessful',
			errors  : flattenError(validation.error).fieldErrors,
			inputs  : payload as unknown as Partial<Schema>,
			timestamp,
		}

	try {
		const supabase = await server()
		
		let accountPeople: { account : string, designation : string }[] = []
		
		if (validation.data.accountPeople) {
			try {
				accountPeople = Array.isArray(JSON.parse(validation.data.accountPeople)) ? JSON.parse(validation.data.accountPeople) : []
			} catch {
				accountPeople = []
			}
		}

		// if (accountPeople.length === 0)
		// 	throw new Error('At least one Account must be provided')
        
		const { data: people, error: peopleError } = await supabase.from(TABLE).update({
			name  : validation.data.name,
			email : validation.data.email,
			phone : validation.data.phone,
		}).eq('id', id).select()

		if (peopleError)
			throw peopleError

		if (!people || people.length === 0)
			throw peopleError

		const { error: accountPeopleDeleteError } = await supabase.from(TABLE_ACCOUNT_PEOPLE).delete().eq('people', id)

		if (accountPeopleDeleteError)
			throw accountPeopleDeleteError

		if (accountPeople.length > 0) {
			const { error: accountPeopleInsertError } = await supabase.from(TABLE_ACCOUNT_PEOPLE).insert(accountPeople.map(account => ({
				people      : id,
				account     : account.account,
				designation : account.designation,
			})))

			if (accountPeopleInsertError)
				throw accountPeopleInsertError
		}

		revalidatePath(PATH)

		return {
			status  : 'success',
			message : LABEL + ' ' + 'update was completed successfully',
			timestamp,
		}
	} catch (error) {
		let message = LABEL + ' ' + 'update was unsuccessful'

		if (error instanceof Error)
			message = error.message
		else if (typeof error === 'object' && error !== null && 'message' in error)
			message = String((error as { message : unknown }).message)
		
		return {
			status  : 'error',
			message : message,
			timestamp,
		}
	}
}

export async function remove(id: string): Promise<Action> {
	const timestamp = Date.now()

	if (!id)
		return {
			status  : 'error',
			message : LABEL + ' ' + 'identification is missing or invalid',
			timestamp,
		}

	try {
		const supabase = await server()

		const { error: accountPeopleError } = await supabase.from(TABLE_ACCOUNT_PEOPLE).delete().eq('people', id)

		if (accountPeopleError)
			throw accountPeopleError

		const { error } = await supabase.from(TABLE).delete().eq('id', id)

		if (error)
			throw error

		revalidatePath(PATH)

		return {
			status  : 'success',
			message : LABEL + ' ' + 'removal was completed successfully',
			timestamp,
		}
	} catch (error) {
		let message = LABEL + ' ' + 'removal was unsuccessful'

		if (error instanceof Error)
			message = error.message
		else if (typeof error === 'object' && error !== null && 'message' in error)
			message = String((error as { message : unknown }).message)
		
		return {
			status  : 'error',
			message : message,
			timestamp,
		}
	}
}

export async function removeBatch(ids: string[]): Promise<Action> {
	const timestamp = Date.now()

	if (!ids || ids.length === 0)
		return {
			status  : 'error',
			message : 'No' + ' ' + LABEL + ' ' + 'record' + (ids.length > 1 ? 's' : '') + ' ' + 'were selected',
			timestamp,
		}

	try {
		const supabase = await server()
		
		const { error: accountPeopleError } = await supabase.from(TABLE_ACCOUNT_PEOPLE).delete().in('people', ids)

		if (accountPeopleError)
			throw accountPeopleError

		const { error } = await supabase.from(TABLE).delete().in('id', ids)

		if (error)
			throw error

		revalidatePath(PATH)

		return {
			status  : 'success',
			message : ids.length + ' ' + 'record' + (ids.length > 1 ? 's' : '') + ' ' + 'have been successfully removed',
			timestamp,
		}
	} catch (error) {
		let message = 'Batch removal was unsuccessful'

		if (error instanceof Error)
			message = error.message
		else if (typeof error === 'object' && error !== null && 'message' in error)
			message = String((error as { message : unknown }).message)
		
		return {
			status  : 'error',
			message : message,
			timestamp,
		}
	}
}
