import type { PageProps } from '@/type/next'
import type { Metadata }  from 'next'

import { Suspense } from 'react'

import { Context, Header, Body, BodyFallback } from '@/app/system/growth/datasource/direct/component/page'
import { Main }                                from '@/component/canggu/block'

export const metadata: Readonly<Metadata> = {
	title       : 'Lead - Data Source - Growth - Luniasola Solarynth',
	description : 'Impact-Driven Software Artistry',
} as const satisfies Metadata

export default async function Lead({ searchParams }: PageProps) {
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
