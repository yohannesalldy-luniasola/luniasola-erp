import type { Metadata } from 'next'

import { Main } from '@/component/canggu/block'

import { Header, Body } from '@/app/system/growth/performance/budget/component/page'

export const metadata: Readonly<Metadata> = {
	title       : 'Budget - Performance - Growth - Luniasola Solarynth',
	description : 'Impact-Driven Software Artistry',
} as const satisfies Metadata

export default async function Budget() {
	return (
		<Main className={'flex size-full flex-col overflow-hidden'}>
			<Header />
			<Body />
		</Main>
	)
}

