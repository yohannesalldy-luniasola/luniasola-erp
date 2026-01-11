import type { Metadata } from 'next'

import { cacheLife } from 'next/cache'

import { State } from '@/app/component/state'
import { Main }  from '@/component/canggu/block'

export const metadata: Readonly<Metadata> = {
	title : 'Not Found - Luniasola Solarynth',
} as const satisfies Metadata

export default async function NotFound() {
	'use cache'
	
	cacheLife('hours')

	return (
		<Main className={'flex h-dvh items-center justify-center'}>
			<State type={404} />
		</Main>
	)
}
