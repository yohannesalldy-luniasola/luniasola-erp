import type { NextRequest } from 'next/server'

import { session } from '@/library/supabase/proxy'

export async function proxy(request: NextRequest): Promise<Response> {
	return await session(request)
}

export const config = {
	matcher : [ '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)' ],
}
