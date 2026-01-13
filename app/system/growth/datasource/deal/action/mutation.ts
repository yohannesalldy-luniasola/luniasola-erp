'use server'

import type { Action, Schema } from '@/app/system/growth/datasource/deal/action/schema'

import { revalidatePath } from 'next/cache'

import { flattenError } from 'zod'

import { LABEL, PATH, SCHEMA, TABLE } from '@/app/system/growth/datasource/deal/action/schema'
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
			name    : validation.data.name,
			account : validation.data.account,
			amount  : validation.data.amount,
			source  : validation.data.source,
			stage   : validation.data.stage,
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

export async function updateStage(id: string, stage: string): Promise<Action> {
	const timestamp = Date.now()

	if (!id || typeof id !== 'string')
		return {
			status  : 'error',
			message : LABEL + ' ' + 'identification is missing or invalid',
			timestamp,
		}

	if (!stage || typeof stage !== 'string')
		return {
			status  : 'error',
			message : 'Stage is missing or invalid',
			timestamp,
		}

	try {
		const supabase = await server()

		const { data, error } = await supabase
			.from(TABLE)
			.update({
				stage      : stage,
				date_update : new Date().toISOString(),
			})
			.eq('id', id)
			.select()

		if (error)
			throw error

		if (!data || data.length === 0)
			throw new Error('Deal not found')

		revalidatePath(PATH)

		return {
			status  : 'success',
			message : LABEL + ' ' + 'stage update was completed successfully',
			timestamp,
		}
	} catch (error) {
		let message = LABEL + ' ' + 'stage update was unsuccessful'

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
	const timestamp  = Date.now()
	const payload 	 = Object.fromEntries(formData)
	const id         = payload.id as string
	const validation = SCHEMA.safeParse(payload)

	if (!id || typeof id !== 'string')
		return {
			status  : 'error',
			message : LABEL + ' ' + 'identification is missing or invalid',
			timestamp,
		}

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

		const { data, error } = await supabase
			.from(TABLE)
			.update({
				name       : validation.data.name,
				account    : validation.data.account,
				amount     : validation.data.amount,
				source     : validation.data.source,
				stage      : validation.data.stage,
				date_update : new Date().toISOString(),
			})
			.eq('id', id)
			.select()

		if (error)
			throw error

		if (!data || data.length === 0)
			throw new Error('Deal not found')

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

	if (!id || typeof id !== 'string')
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
