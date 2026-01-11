'use server'

import type { Action, Schema } from '@/app/system/growth/performance/ads/action/schema'

import { revalidatePath } from 'next/cache'

import { z, flattenError } from 'zod'

import { LABEL, PATH, SCHEMA, TABLE, TABLE_ADS_PERFORMANCE_ACCOUNT } from '@/app/system/growth/performance/ads/action/schema'
import { server }                                                    from '@/library/supabase/server'

function parse(value: unknown) {
	if (!value || typeof value !== 'string')
		return []

	try {
		const result = z.array(z.object({ account : z.string().min(1) })).safeParse(JSON.parse(value))

		if (!result.success)
			return []

		return result.data.filter((item, index, self) => index === self.findIndex((association) => association.account === item.account))
	} catch {
		return []
	}
}

function supplementary(data: Schema, count: number): Record<string, string[]> | null {
	const errors: Record<string, string[]> = {}

	if ((data.lead_qualified ?? 0) > (data.lead ?? 0))
		errors.lead_qualified = [ 'Qualified Lead must be less than or equal to Incoming Lead' ]

	if ((data.lead_qualified ?? 0) > 0 && count !== (data.lead_qualified ?? 0))
		errors.adsPerformanceAccount = [ 'Qualified Lead Account mapping must correspond to Qualified Lead input' ]

	return Object.keys(errors).length > 0 ? errors : null
}

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

	const adsPerformanceAccount = parse(validation.data.adsPerformanceAccount)
	const supplementaryError    = supplementary(validation.data, adsPerformanceAccount.length)

	if (supplementaryError)
		return {
			status  : 'error',
			message : LABEL + ' ' + 'form validation was unsuccessful',
			errors  : supplementaryError,
			inputs  : payload as unknown as Partial<Schema>,
			timestamp,
		}

	try {
		const supabase = await server()
        
		const { data: performance, error: performanceError } = await supabase.from(TABLE).insert({
			channel        : validation.data.channel,
			cost           : validation.data.cost ?? 0,
			lead           : validation.data.lead,
			lead_qualified : validation.data.lead_qualified,
			date           : validation.data.date,
		}).select('id').single()

		if (performanceError)
			throw performanceError

		if (performance && adsPerformanceAccount.length > 0) {
			const { error: adsPerformanceAccountError } = await supabase.from(TABLE_ADS_PERFORMANCE_ACCOUNT).insert(adsPerformanceAccount.map((association) => ({
				ads_performance : performance.id,
				account         : association.account,
			})))

			if (adsPerformanceAccountError)
				throw adsPerformanceAccountError
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
		
	const adsPerformanceAccount	= parse(validation.data.adsPerformanceAccount)
	const supplementaryError    = supplementary(validation.data, adsPerformanceAccount.length)

	if (supplementaryError)
		return {
			status  : 'error',
			message : LABEL + ' ' + 'form validation was unsuccessful',
			errors  : supplementaryError,
			inputs  : payload as unknown as Partial<Schema>,
			timestamp,
		}

	try {
		const supabase = await server()

		const { data: performance, error: performanceError } = await supabase.from(TABLE).update({
			channel        : validation.data.channel,
			cost           : validation.data.cost ?? 0,
			lead           : validation.data.lead,
			lead_qualified : validation.data.lead_qualified,
			date           : validation.data.date,
		}).eq('id', id).select()

		if (performanceError)
			throw performanceError

		if (!performance || performance.length === 0)
			throw performanceError

		const { error: adsPerformanceAccountDeleteError } = await supabase.from(TABLE_ADS_PERFORMANCE_ACCOUNT).delete().eq('ads_performance', id)

		if (adsPerformanceAccountDeleteError)
			throw adsPerformanceAccountDeleteError

		if (adsPerformanceAccount.length > 0) {
			const { error: adsPerformanceAccountInsertError } = await supabase.from(TABLE_ADS_PERFORMANCE_ACCOUNT).insert(adsPerformanceAccount.map((association) => ({
				ads_performance : id,
				account         : association.account,
			})))

			if (adsPerformanceAccountInsertError)
				throw adsPerformanceAccountInsertError
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

		const { error: adsPerformanceAccountError } = await supabase.from(TABLE_ADS_PERFORMANCE_ACCOUNT).delete().eq('ads_performance', id)

		if (adsPerformanceAccountError)
			throw adsPerformanceAccountError

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
		
		const { error: adsPerformanceAccountError } = await supabase.from(TABLE_ADS_PERFORMANCE_ACCOUNT).delete().in('ads_performance', ids)

		if (adsPerformanceAccountError)
			throw adsPerformanceAccountError

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
