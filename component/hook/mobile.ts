'use client'

import { useSyncExternalStore } from 'react'

const BREAKPOINT = '(max-width: 767px)'

function snapshotServer(): boolean {
	return false
}

function snapshotClient(): boolean {
	return window.matchMedia(BREAKPOINT).matches
}

function subscribe(callback: () => void) {
	const MQL = window.matchMedia(BREAKPOINT)
    
	MQL.addEventListener('change', callback)

	return () => MQL.removeEventListener('change', callback)
}

export function useMobile(): boolean {
	return useSyncExternalStore(subscribe, snapshotClient, snapshotServer)
}
