'use client'

import { useRouter } from 'next/navigation'

import { useEffect, useRef } from 'react'

import { usePageVisibility } from '@/component/hook/visibility'

export function PageRefresh() {
	const router = useRouter()
	const isVisible = usePageVisibility()
	const previousVisibleRef = useRef(isVisible)

	useEffect(() => {
		if (!previousVisibleRef.current && isVisible) {
			router.refresh()
		}

		previousVisibleRef.current = isVisible
	}, [ isVisible, router ])

	return null
}
