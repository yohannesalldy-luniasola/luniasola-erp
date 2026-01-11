'use client'

import type { Dispatch, SetStateAction } from 'react'

import { useCallback, useMemo, useSyncExternalStore } from 'react'

type CustomEventDetail = { key : string, value : string | null }

const hydration = () => () => {}

function subscribe(key: string, callback: () => void) {
	const onStorage 	 = (event: StorageEvent) => (event.key === key) && callback()
	const onStorageLocal = (event: Event) => {
		const { detail } = event as CustomEvent<CustomEventDetail>

		if (detail.key === key)
			callback()
	}

	window.addEventListener('storage', 	   	 onStorage)
	window.addEventListener('storage-local', onStorageLocal)

	return () => {
		window.removeEventListener('storage', 	    onStorage)
		window.removeEventListener('storage-local', onStorageLocal)
	}
}

export function usePersistedState<T>(key: string, initial: T): readonly [T, Dispatch<SetStateAction<T>>, boolean] {
	const initialString = useMemo(() => JSON.stringify(initial), [ initial ])

	const getServerSnapshot = useCallback(() => initialString, [ initialString ])
	const getClientSnapshot = useCallback(() => {
		try {
			return localStorage.getItem(key) ?? initialString
		} catch {
			return initialString
		}
	}, [ key, initialString ])

	const subscription = useCallback((callback: () => void) => subscribe(key, callback), [ key ])
	const store		   = useSyncExternalStore(subscription, getClientSnapshot, getServerSnapshot)

	const value = useMemo(() => {
		try {
			return JSON.parse(store) as T
		} catch {
			return initial
		}
	}, [ store, initial ])

	const setValue: Dispatch<SetStateAction<T>> = useCallback((update) => {
		try {
			const next 	     = update instanceof Function ? update(value) : update
			const nextString = JSON.stringify(next)
            
			localStorage.setItem(key, nextString)

			const event = new CustomEvent<CustomEventDetail>('storage-local', { detail : { key, value : nextString } })

			window.dispatchEvent(event)
		} catch (error) {
			console.error(error)
		}
	}, [ key, value ])

	const hydrated = useSyncExternalStore(hydration, () => true, () => false)

	return [ value, setValue, hydrated ] as const
}
