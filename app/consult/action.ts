'use server'

import { server } from '@/library/supabase/server'

type ConsultFormData = {
	readonly name     : string
	readonly contact  : string
	readonly company? : string
	readonly gclid?   : string | null
	readonly fbclid?  : string | null
}

function isEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function formatPhone(phone: string): string {
	const trimmed = phone.trim()
	
	if (trimmed.startsWith('0'))
		return '+62' + trimmed.substring(1)
	
	return trimmed
}

export async function submitConsult(data: ConsultFormData): Promise<{ success : boolean, error? : string }> {
	try {
		const supabase = await server()

		const contactValue = data.contact.trim()
		const isContactEmail = isEmail(contactValue)

		const peopleData: {
			name          : string
			email?        : string | null
			phone?        : string | null
			date_creation : string
		} = {
			name          : data.name.trim(),
			date_creation : new Date().toISOString(),
		}

		if (isContactEmail) {
			peopleData.email = contactValue
			peopleData.phone = null
		} else {
			peopleData.email = null
			peopleData.phone = formatPhone(contactValue)
		}

		const { error: peopleError } = await supabase.from('people').insert(peopleData)

		if (peopleError)
			throw peopleError

		if (data.company && data.company.trim() !== '') {
			const accountData = {
				name          : data.company.trim(),
				country       : null,
				status        : 'active' as const,
				date_creation : new Date().toISOString(),
			}

			const { error: accountError } = await supabase.from('account').insert(accountData)

			if (accountError)
				throw accountError
		}

		const leadData = {
			name   : data.name.trim(),
			gclid  : data.gclid && data.gclid.trim() !== '' ? data.gclid.trim() : null,
			fbclid : data.fbclid && data.fbclid.trim() !== '' ? data.fbclid.trim() : null,
			status : 'pending' as const,
		}

		const { error: leadError } = await supabase.from('lead').insert(leadData)

		if (leadError)
			throw leadError

		return { success : true }
	} catch (error) {
		let message = 'Form submission was unsuccessful'

		if (error instanceof Error)
			message = error.message
		else if (typeof error === 'object' && error !== null && 'message' in error)
			message = String((error as { message : unknown }).message)

		return { success : false, error : message }
	}
}
