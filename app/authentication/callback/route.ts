import type { SupabaseClient } from '@supabase/supabase-js'
import type { NextRequest }    from 'next/server'

import { NextResponse } from 'next/server'

import { ROUTE_AUTHENTICATION, ROUTE_REDIRECTION } from '@/library/supabase/proxy'
import { server }                                  from '@/library/supabase/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
	const url    = new URL(request.url)
	const code   = url.searchParams.get('code')
	const next   = url.searchParams.get('next') ?? ROUTE_REDIRECTION.AUTHENTICATION_CLEARANCE
	const origin = url.origin

	if (!code)
		return NextResponse.redirect(new URL(ROUTE_AUTHENTICATION.SIGNIN, origin))

	const supabase: SupabaseClient = await server()
	const { error } 			   = await supabase.auth.exchangeCodeForSession(code)

	if (error)
		return NextResponse.redirect(new URL(ROUTE_AUTHENTICATION.SIGNIN, origin))

	return NextResponse.redirect(new URL(next, origin))
}
