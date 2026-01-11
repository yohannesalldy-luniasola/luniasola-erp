import type { Metadata } from 'next'

import { cacheLife } from 'next/cache'

import { State } from '@/app/component/state'
import { Main }  from '@/component/canggu/block'

export const metadata: Readonly<Metadata> = {
	title : 'Forthcoming - Luniasola Solarynth',
} as const satisfies Metadata

export default async function Forthcoming() {
	'use cache'
	
	cacheLife('hours')

	return (
		<Main className={'flex h-dvh items-center justify-center'}>
			<State type={'forthcoming'} />
		</Main>
	)
}
