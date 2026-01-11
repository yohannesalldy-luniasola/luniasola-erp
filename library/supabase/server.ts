import type { SupabaseClient } from '@supabase/supabase-js'

import { cookies } from 'next/headers'

import { createServerClient } from '@supabase/ssr'

export async function server(): Promise<SupabaseClient> {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

	if (!url)
		throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')

	if (!key)
		throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')

	const cookie = await cookies()

	return createServerClient(url, key, {
		cookies : {
			getAll() {
				return cookie.getAll()
			},
			setAll(cookieSet) {
				try {
					cookieSet.forEach(({ name, value, options }) => cookie.set(name, value, options))
				} catch {}
			},
		},
	})
}
