'use server'

import type { SupabaseClient } from '@supabase/supabase-js'

import { redirect } from 'next/navigation'

import { ROUTE_AUTHENTICATION, ROUTE_REDIRECTION } from '@/library/supabase/proxy'
import { server }                                  from '@/library/supabase/server'

type AuthenticationResponse = Readonly<{ success : boolean, error? : string }>

export async function session(): Promise<AuthenticationResponse> {
	const supabase: SupabaseClient = await server()

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider : 'google',
		options  : {
			redirectTo : process.env.NEXT_PUBLIC_SITE_URL + ROUTE_AUTHENTICATION.CALLBACK,
		},
	})

	if (error)
		return { success : false, error : error.message } as const

	if (data)
		redirect(data.url)

	return { success : true } as const
}

export async function revoke(): Promise<AuthenticationResponse> {
	const supabase: SupabaseClient = await server()

	const { error } = await supabase.auth.signOut()

	if (error)
		return { success : false, error : error.message } as const

	redirect(ROUTE_REDIRECTION.AUTHENTICATION_MISSING)
}
