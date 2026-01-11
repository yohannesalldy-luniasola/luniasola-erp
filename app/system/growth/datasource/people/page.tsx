import type { PageProps } from '@/type/next'
import type { Metadata }  from 'next'

import { Suspense } from 'react'

import { Context, Header, Body, BodyFallback } from '@/app/system/growth/datasource/people/component/page'
import { Main }                                from '@/component/canggu/block'

export const metadata: Readonly<Metadata> = {
	title       : 'People - Data Source - Growth - Luniasola Solarynth',
	description : 'Impact-Driven Software Artistry',
} as const satisfies Metadata

export default async function People({ searchParams }: PageProps) {
	return (
		<Main className={'flex size-full flex-col overflow-hidden'}>
			<Context>
				<Header searchParams={searchParams} />

				<Suspense fallback={<BodyFallback />}>
					<Body searchParams={searchParams} />
				</Suspense>
			</Context>
		</Main>
	)
}
