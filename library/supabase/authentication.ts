'use server'

import type { SupabaseClient } from '@supabase/supabase-js'

import { headers }  from 'next/headers'
import { redirect } from 'next/navigation'

import { ROUTE_AUTHENTICATION, ROUTE_REDIRECTION } from '@/library/supabase/proxy'
import { server }                                  from '@/library/supabase/server'

type AuthenticationResponse = Readonly<{ success : boolean, error? : string }>

async function getSiteUrl(): Promise<string> {
	const headersList = await headers()
	const host = headersList.get('host')
	const protocol = headersList.get('x-forwarded-proto') || 'https'

	if (host && !host.includes('localhost')) {
		const url = protocol + '://' + host

		return url.endsWith('/') ? url.slice(0, -1) : url
	}

	let url = process.env.NEXT_PUBLIC_SITE_URL

	if (!url) {
		const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL

		if (vercelUrl)
			url = 'https://' + vercelUrl
		else
			throw new Error('Missing environment variable: NEXT_PUBLIC_SITE_URL')
	}

	url = url.endsWith('/') ? url.slice(0, -1) : url

	if (!url.startsWith('http'))
		url = 'https://' + url

	return url
}

export async function session(): Promise<AuthenticationResponse> {
	const supabase: SupabaseClient = await server()

	const siteUrl = await getSiteUrl()
	const redirectTo = siteUrl + ROUTE_AUTHENTICATION.CALLBACK

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider : 'google',
		options  : {
			redirectTo,
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
