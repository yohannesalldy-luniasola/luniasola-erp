import type { Metadata } from 'next'

import { Main } from '@/component/canggu/block'

import { Header, Body } from '@/app/system/growth/performance/reports/component/page'

export const metadata: Readonly<Metadata> = {
	title       : 'Reports - Performance - Growth - Luniasola Solarynth',
	description : 'Impact-Driven Software Artistry',
} as const satisfies Metadata

export default async function Reports() {
	return (
		<Main className={'flex size-full flex-col overflow-hidden'}>
			<Header />
			<Body />
		</Main>
	)
}

