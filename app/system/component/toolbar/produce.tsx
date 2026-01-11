'use client'

import type { LucideIcon } from 'lucide-react'

import { useState, useCallback, useTransition } from 'react'

import { FolderInput, FileText, Sheet, BetweenHorizontalEnd, Loader2 } from 'lucide-react'
import { toast }                                                       from 'sonner'

import { Span }                                                                                                                                                    from '@/component/canggu/block'
import { Button }                                                                                                                                                  from '@/component/canggu/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCard, DropdownMenuItem, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuSeparator } from '@/component/canggu/dropdown'
import { Skeleton }                                                                                                                                                from '@/component/canggu/skeleton'
import { classNames }                                                                                                                                              from '@/component/utility/style'

type Type 			 	    = 'excel' | 'csv' | 'pdf'
type ToolbarProduce 		= { readonly onProduce : (type: Type) => void | Promise<void>, readonly output? : readonly Type[], readonly disabled? : boolean }
type ToolbarProduceFallback = { readonly className? : string }

export function ToolbarProduce({ onProduce, output = [ 'excel', 'csv', 'pdf' ], disabled = false }: ToolbarProduce) {
	const [ pending, startTransition ] = useTransition()
	const [ current, setCurrent ] 	   = useState<Type | null>(null)

	const performProduce = useCallback((type: Type) => {
		setCurrent(type)

		startTransition(async () => {
			try {
				await onProduce(type)

				toast.success(type.toUpperCase() + ' ' + 'file produced successfully')
			} catch {
				toast.error(type.toUpperCase() + ' ' + 'file production failed')
			}
		})
	}, [ onProduce ])

	const Icon = (type: Type, DefaultIcon: LucideIcon) => {
		if (pending && current === type)
			return <Loader2 className={'size-3.5 animate-spin'} />

		return <DefaultIcon className={'size-3.5 stroke-neutral-800 dark:stroke-neutral-400'} />
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button appearance={'ghost'} className={'px-1 text-sm md:px-2'} disabled={pending || disabled} shape={'ellipse'} size={'xs'}>
					<FolderInput className={'size-3.5'} strokeWidth={1.500} /> 
					<Span className={'hidden sm:block'}>Export</Span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align={'start'} className={'w-36'}>
				<DropdownMenuCard>
					{
						(output.includes('excel') || output.includes('csv')) && (
							<>
								<DropdownMenuLabel>Datasheet</DropdownMenuLabel>
								<DropdownMenuGroup>
									{
										output.includes('excel') && (
											<DropdownMenuItem className={'justify-between'} disabled={pending || disabled} onClick={() => performProduce('excel')}>
												<Span>Excel</Span>
												{Icon('excel', Sheet)}
											</DropdownMenuItem>
										)
									}

									{
										output.includes('csv') && (
											<DropdownMenuItem className={'justify-between'} disabled={pending || disabled} onClick={() => performProduce('csv')}>
												<Span>CSV</Span>
												{Icon('csv', BetweenHorizontalEnd)}
											</DropdownMenuItem>
										)
									}
								</DropdownMenuGroup>

								{output.includes('pdf') && <DropdownMenuSeparator />}
							</>
						)
					}

					{
						output.includes('pdf') && (
							<>
								<DropdownMenuLabel>Document</DropdownMenuLabel>
								<DropdownMenuGroup>
									<DropdownMenuItem className={'justify-between'} disabled={pending || disabled} onClick={() => performProduce('pdf')}>
										<Span>PDF</Span>
										{Icon('pdf', FileText)}
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</>
						)
					}
				</DropdownMenuCard>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export function ToolbarProduceFallback({ className }: ToolbarProduceFallback) {
	return <Skeleton className={classNames('h-6 w-22', className)} />
}
