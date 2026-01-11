import type { SupabaseClient } from '@supabase/supabase-js'

import { createBrowserClient } from '@supabase/ssr'

export function client(): SupabaseClient {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

	if (!url)
		throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')

	if (!key)
		throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')

	return createBrowserClient(url, key)
}
