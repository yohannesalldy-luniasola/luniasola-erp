'use server'

import type { Action, Schema } from '@/app/system/growth/datasource/direct/action/schema'

import { revalidatePath } from 'next/cache'

import { flattenError } from 'zod'

import { LABEL, PATH, SCHEMA, TABLE } from '@/app/system/growth/datasource/direct/action/schema'
import { server }                     from '@/library/supabase/server'

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
		
		const { error } = await supabase.from(TABLE).insert({
			name            : validation.data.name,
			gclid           : validation.data.gclid,
			fbclid          : validation.data.fbclid,
			status          : validation.data.status,
			purchase_amount : validation.data.purchase_amount,
			purchase_pic    : validation.data.purchase_pic,
		})

		if (error)
			throw error

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
		
		const { data, error } = await supabase.from(TABLE).update({
			name            : validation.data.name,
			gclid           : validation.data.gclid,
			fbclid          : validation.data.fbclid,
			status          : validation.data.status,
			purchase_amount : validation.data.purchase_amount,
			purchase_pic    : validation.data.purchase_pic,
		}).eq('id', id).select()

		if (error)
			throw error

		if (!data || data.length === 0)
			throw error

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
