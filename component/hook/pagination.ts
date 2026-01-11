'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useCallback, useMemo, useState, useTransition } from 'react'

function calculation(current: number, total: number): readonly (number | '...')[] {
	if (!(total > 7))
		return Array.from({ length : total }, (_, index) => index + 1)

	if (current <= 4)
		return [ 1, 2, 3, 4, 5, '...', total ]

	if (current >= total - 3)
		return [ 1, '...', total - 4, total - 3, total - 2, total - 1, total ]

	return [ 1, '...', current - 1, current, current + 1, '...', total ]
}

export function usePagination(current: number, total: number) {
	const router       	 	 	 	   = useRouter()
	const pathname     	 	 	 	   = usePathname()
	const searchParams 	 	 	 	   = useSearchParams()
	const [ pending, startTransition ] = useTransition()
	const [ target, setTarget ]        = useState<number | null>(null)

	const push = useCallback((number: number): string => {
		const parameters = new URLSearchParams(searchParams.toString())

		parameters.set('page', number.toString())
        
		return pathname + '?' + parameters.toString()
	}, [ searchParams, pathname ])

	const perform = useCallback((number: number) => {
		if (number === current || number < 1 || number > total || pending) 
			return

		setTarget(number)

		startTransition(() => router.push(push(number)))
	}, [ current, total, pending, router, push ])

	const visibility = useMemo(() => calculation(current, total), [ current, total ])

	return { pending, target, visibility, push, perform }
}

export function useLimit(defaultLimit: number = 10) {
	const router                       = useRouter()
	const pathname                     = usePathname()
	const searchParams                 = useSearchParams()
	const [ pending, startTransition ] = useTransition()

	const current = useMemo(() => {
		const parameter = searchParams.get('limit')

		return parameter ? parseInt(parameter, 10) : defaultLimit
	}, [ searchParams, defaultLimit ])

	const perform = useCallback((number: number) => {
		const parameters = new URLSearchParams(searchParams.toString())

		parameters.set('limit', number.toString())
		parameters.set('page', '1')

		startTransition(() => router.push(pathname + '?' + parameters.toString(), { scroll : false }))
	}, [ router, pathname, searchParams ])

	return { current, pending, perform }
}
