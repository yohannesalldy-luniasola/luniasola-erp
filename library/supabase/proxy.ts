import type { SupabaseClient } from '@supabase/supabase-js'

import { NextResponse, type NextRequest } from 'next/server'

import { createServerClient } from '@supabase/ssr'

const ROUTE_PROTECTED = [ '/system' ]  as const

export const ROUTE_AUTHENTICATION = {
	SIGNIN   : '/',
	CALLBACK : '/authentication/callback',
} as const

export const ROUTE_REDIRECTION = {
	AUTHENTICATION_MISSING   : ROUTE_AUTHENTICATION.SIGNIN,
	AUTHENTICATION_CLEARANCE : '/system/growth/datasource/account',
} as const

function routeProtected(pathname: string): boolean {
	return ROUTE_PROTECTED.some(route => pathname.startsWith(route))
}

function routeAuthentication(pathname: string): boolean {
	return pathname === ROUTE_AUTHENTICATION.SIGNIN
}

export async function session(request: NextRequest): Promise<NextResponse> {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

	if (!url || !key)
		throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')

	let response = NextResponse.next({ request })

	const supabase: SupabaseClient = createServerClient(url, key, {
		cookies : {
			getAll() {
				return request.cookies.getAll()
			},
			setAll(cookieSet) {
				cookieSet.forEach(({ name, value }) => request.cookies.set(name, value))

				response = NextResponse.next({ request })

				cookieSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
			},
		},
	})

	const { data } = await supabase.auth.getUser()
	const user     = data?.user
	const pathname = request.nextUrl.pathname

	if (routeProtected(pathname) && !user) {
		const redirection = request.nextUrl.clone()

		redirection.pathname = ROUTE_REDIRECTION.AUTHENTICATION_MISSING

		return NextResponse.redirect(redirection)
	}

	if (user && routeAuthentication(pathname)) {
		const redirection = request.nextUrl.clone()

		redirection.pathname = ROUTE_REDIRECTION.AUTHENTICATION_CLEARANCE

		return NextResponse.redirect(redirection)
	}

	return response
}
