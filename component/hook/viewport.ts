'use client'

import { usePathname, useSearchParams } from 'next/navigation'

import { Suspense, useEffect, useCallback, useRef, useMemo, createElement, Fragment } from 'react'

type ViewportProviderProps = Viewport & {
	readonly children : React.ReactNode
}

type Viewport = {
	readonly mount? : boolean
	readonly width? : number
	readonly watch? : boolean
	readonly zoom?  : boolean
}

type ViewportConfig = {
	readonly scaleInitial : number
	readonly scaleMaximum : number
	readonly scaleMinimum : number
	readonly scaleUser    : .000 | 1.000
	readonly width        : number | 'device-width'
}

function calculation(screen: number, width: number): ViewportConfig {
	const state = screen < width
	const scale = state ? screen / width : 1.000

	return {
		width        : 'device-width',
		scaleInitial : scale,
		scaleMinimum : scale,
		scaleMaximum : scale,
		scaleUser    : .000,
	} as const
}

function serialization(config: ViewportConfig): string {
	return 'width' + '=' + config.width + ',' + 'initial-scale' + '=' + config.scaleInitial + ',' + 'minimum-scale' + '=' + config.scaleMinimum + ',' + 'maximum-scale' + '=' + config.scaleMaximum + ',' + 'user-scalable' + '=' + config.scaleUser
}

function meta(): HTMLMetaElement | null {
	if (typeof document === 'undefined')
		return null

	let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]')

	if (!meta) {
		meta      = document.createElement('meta')
		meta.name = 'viewport'

		document.head.appendChild(meta)
	}

	return meta
}

function apply(config: ViewportConfig): boolean {
	const data = meta()

	if (!data)
		return false

	data.content = serialization(config)

	return true
}

function ViewportLogical({ width, mount, watch }: Viewport) {
	useViewport({ width, mount, watch })

	return null
}

export function useViewport(options: Viewport = {}) {
	const { width = 360, mount = true, watch = false } = options

	const pathname     = usePathname()
	const searchParams = useSearchParams()
	const refTimeout   = useRef<NodeJS.Timeout | null>(null)

	const viewportConfig = useMemo(() => {
		if (typeof window === 'undefined')
			return null

		return calculation(window.innerWidth, width)
	}, [ width ])

	const viewportUpdate = useCallback(() => {
		if (typeof window === 'undefined')
			return

		apply(calculation(window.innerWidth, width))
	}, [ width ])

	const resize = useCallback(() => {
		if (refTimeout.current)
			clearTimeout(refTimeout.current)

		refTimeout.current = setTimeout(() => viewportUpdate(), 25)
	}, [ viewportUpdate ])

	useEffect(() => {
		if (typeof window === 'undefined')
			return

		if (window.innerWidth > width)
			return
    
		if (mount && viewportConfig)
			queueMicrotask(() => apply(viewportConfig))
	}, [ mount, viewportConfig, pathname, searchParams, width ])

	useEffect(() => {
		if (typeof window === 'undefined' || !watch)
			return

		if (window.innerWidth > width)
			return

		window.addEventListener('resize', resize)
    
		return () => {
			window.removeEventListener('resize', resize)

			if (refTimeout.current)
				clearTimeout(refTimeout.current)
		}
	}, [ watch, width, resize ])

	return { viewportConfig, viewportUpdate } as const
}

export function ViewportProvider({ children, width = 360, mount = true, watch = false }: ViewportProviderProps) {
	return createElement(Fragment, null, createElement(Suspense, { fallback : null }, createElement(ViewportLogical, { width, mount, watch })), children)
}
