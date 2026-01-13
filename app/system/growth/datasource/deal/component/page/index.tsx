import type { SearchParams } from '@/type/next'
import type { ReactNode }    from 'react'

import { Section, Div } from '@/component/canggu/block'
import { Separator }    from '@/component/canggu/separator'
import { Paragraph }    from '@/component/canggu/typography'

import { ICON, LABEL } from '@/app/system/growth/datasource/deal/action/schema'

type Page 	 = { readonly searchParams : SearchParams }
type Context = { readonly children : ReactNode }

export function Context({ children }: Context) {
	return <>{children}</>
}

export async function Header({ searchParams }: Page) {
	return (
		<Section className={'shrink-0 border-b border-neutral-100 bg-white px-3 py-1.75 md:px-4 dark:border-zinc-800/50 dark:bg-zinc-950'}>
			<Div className={'flex flex-row items-center justify-between gap-2'}>
				<Div className={'flex flex-row items-center gap-2.5'}>
					<Paragraph className={'flex flex-row items-center gap-2.5 text-sm font-semibold'}>
						<ICON className={'size-4 text-primary'} strokeWidth={2.500} /> {LABEL}
					</Paragraph>

					<Separator className={'-mr-0.5 data-[orientation=vertical]:h-4'} orientation={'vertical'} />
				</Div>
			</Div>
		</Section>
	)
}

export async function Body({ searchParams }: Page) {
	return (
		<Section className={'flex h-full min-h-0 flex-1 flex-col overflow-hidden'}>
			<Div className={'flex min-h-0 flex-1 flex-col items-center justify-center'}>
				<Paragraph className={'text-sm text-neutral-500'}>Deal page is under development</Paragraph>
			</Div>
		</Section>
	)
}

export function BodyFallback() {
	return (
		<Div className={'relative flex size-full min-h-0 flex-1 flex-col overflow-hidden'}>
			<Div className={'flex min-h-0 flex-1 flex-col items-center justify-center'}>
				<Paragraph className={'text-sm text-neutral-500'}>Loading...</Paragraph>
			</Div>
		</Div>
	)
}

