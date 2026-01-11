'use client'

import { RefreshCcw } from 'lucide-react'

import { State }  from '@/app/component/state'
import { Main }   from '@/component/canggu/block'
import { Button } from '@/component/canggu/button'

export default function Error({ error, reset }: { error : Error & { digest? : string }, reset : () => void}) {
	return (
		<Main className={'flex size-full flex-col overflow-hidden'}>
			<State description={error.message} type={'error'}>
				<Button appearance={'primary'} className={'group'} shape={'ellipse'} size={'sm'} onClick={reset}>
					<RefreshCcw className={'size-3! transition-transform duration-250 ease-in-out group-hover:rotate-180'} /> Try Again
				</Button>
			</State>
		</Main>
	)
}
