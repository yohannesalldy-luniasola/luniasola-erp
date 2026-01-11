'use client'

import { useMemo } from 'react'

import { ChevronDown, Loader2 } from 'lucide-react'

import { Span }                                                                                       from '@/component/canggu/block'
import { Button }                                                                                     from '@/component/canggu/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCard, DropdownMenuItem } from '@/component/canggu/dropdown'
import { Skeleton }                                                                                   from '@/component/canggu/skeleton'
import { useLimit }                                                                                   from '@/component/hook/pagination' 
import { classNames }                                                                                 from '@/component/utility/style'

type ToolbarLimit 		  = { readonly limitDefault? : number, readonly options? : readonly number[] }
type ToolbarLimitFallback = { readonly className? : string }

const LIMIT = [ 10, 25, 50, 100 ] as const

function configuration(options: readonly number[], limitDefault: number): readonly number[] {
	if (options.includes(limitDefault))
		return options

	return [ ...options, limitDefault ].sort((a, b) => a - b)
}

export function ToolbarLimit({ limitDefault = 10, options = LIMIT }: ToolbarLimit) {
	const limit 	 = useLimit(limitDefault)
	const preference = useMemo(() => configuration(options, limitDefault), [ options, limitDefault ])

	const Icon = useMemo(() => {
		if (limit.pending)
			return <Loader2 className={'size-3.5 animate-spin'} strokeWidth={1.500} />

		return <ChevronDown className={'size-3.5'} strokeWidth={1.500} />
	}, [ limit.pending ])

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button appearance={'ghost'} className={'gap-1 px-2 text-sm'} disabled={limit.pending} shape={'ellipse'} size={'xs'}>
					<Span className={'text-xs'}>{limit.current}</Span> {Icon}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align={'start'}>
				<DropdownMenuCard>
					{
						preference.map((option) => (
							<DropdownMenuItem className={'justify-between'} disabled={limit.pending} key={option} onClick={() => limit.perform(option)}>
								<Span className={'text-xs'}>{option}</Span>
								{limit.current === option && <Span className={'text-xs font-bold text-primary'}>✓</Span>}
							</DropdownMenuItem>
						))
					}
				</DropdownMenuCard>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export function ToolbarLimitFallback({ className }: ToolbarLimitFallback) {
	return <Skeleton className={classNames('h-6 w-11.5', className)} />
}
