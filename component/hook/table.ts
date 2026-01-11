'use client'

import type { RefObject, ReactNode } from 'react'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import { useState, useCallback, useMemo, useEffect, useTransition, useOptimistic, useRef } from 'react'

import { toast } from 'sonner'

import { usePersistedState } from '@/component/hook/storage'

type Table       	 	 	 	 		= { readonly id : string } & Record<string, unknown>
type Action     			 	 	 	= { readonly status : 'success' | 'error' | 'idle', readonly message? : string, readonly errors? : Record<string, string[] | undefined> }
type Sort		  			 	 	    = Readonly<'asc' | 'desc' | null>
type ColumnVisibility<T extends string> = Record<T, boolean>
type Toast	 	  			 	 	    = { readonly title : ReactNode, readonly actionLabel : ReactNode, readonly onAction : () => void }
type Optimistic<T> 			 	 	    = | { 
	readonly type : 'insert',
	readonly item : T
} | { 
	readonly type : 'remove'
	readonly id   : string 
} | { 
	readonly type : 'removeBatch'
	readonly ids  : readonly string[]
} | { 
	readonly type : 'update'
	readonly id   : string,
	readonly data : Partial<T>
}

export type ID 	  			 	 	   		   = { readonly id : string }
export type ColumnDefinition<T extends string> = { readonly key : T, readonly label : string, sort? : boolean }
export type ColumnLabels<T extends string> 	   = Record<T, string>

export function useTable<T extends Table>(data: readonly T[]) {
	const [ rowSelection, setRowSelection ] 			 	 	 	 	 	 	 	 	 		 	 	 	 	 	 	 	 	 	 	 = useState<T | null>(null)
	const [ updateOpen, setUpdateOpen ]     			 	 	 	 	 	 	 	 	 		 	 	 	 	 	 	 	 	 	 	 = useState<boolean>(false)
	const [ removalProcess, setRemovalProcess ] 		 	 	 	 	 	 	 	 	 		 	 	 	 	 	 	 	 	 	 	 = useState<Set<string>>(new Set())
	const [ removalSuccess, setRemovalSuccess ] 		 	 	 	 	 	 	 	 	 		 	 	 	 	 	 	 	 	 	 	 = useState<Set<string>>(new Set())
	const [ removalSelection, setRemovalSelection ] 	 	 	 	 	 	 	 	 	 		 	 	 	 	 	 	 	 	 	 	 = useState<T | null>(null)
	const [ pending, startTransition ]  	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 		 	 	 		 	 	 = useTransition()
	const { optimistic, optimisticUpdate, optimisticRemove, optimisticRemoveBatch } 	 	 	 	 	 	 		 	 	 	 	 	 = useTableOptimistic(data)
	const { selectionState, selectionSelectedAll, selectionSelectedPartial, selection, selectionAll, selectionClear, setSelectionState } = useTableSelection(optimistic)
	const refTimer                     			 	 	 	 	 		 	 			 	 	 	 	 	 	 		 	 		 	 = useRef<NodeJS.Timeout | null>(null)
	const refToast 		 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 		 	 	 		 	 	 	     = useRef<string | number | null>(null)
	
	const clearTimers = useCallback(() => {
		if (refTimer.current) {
			clearTimeout(refTimer.current)
			refTimer.current = null
		}
	}, [])
	
	const performUpdate = useCallback((id: string, updated: Partial<T>) => {
		startTransition(() => optimisticUpdate(id, updated))

		return Promise.resolve()
	}, [ optimisticUpdate ])

	const performRemoval = useCallback(async (id: string, action: (id: string) => Promise<Action> ) => {
		setRemovalProcess((previous) => {
			const next = new Set(previous)
			next.add(id)

			return next
		})

		try {
			const result = await action(id)

			if (result.status === 'success') {
				setSelectionState((previous) => {
					const next = new Set(previous)

					if (next.has(id))
						next.delete(id)

					return next
				})

				setRemovalSuccess((previous) => {
					const next = new Set(previous)
					next.add(id)

					return next
				})

				refTimer.current = setTimeout(() => {
					startTransition(() => { 
						optimisticRemove(id)

						setRemovalProcess((previous) => { 
							const next = new Set(previous)
							next.delete(id)

							return next 
						})

						setRemovalSuccess((previous) => { 
							const next = new Set(previous)
							next.delete(id)

							return next 
						})
					})

					toast.success('Success', { description : result.message })
				}, 500)
			} else {
				throw new Error(result.message)
			}
		} catch(error) {
			const message = error instanceof Error && error.message 

			toast.error('Failed', { description : message })

			setRemovalProcess((previous) => { 
				const next = new Set(previous)
				next.delete(id)

				return next 
			})
		}
	}, [ optimisticRemove, setSelectionState ])

	const performRemovalBatch = useCallback(async (action: (ids: string[]) => Promise<Action>) => {
		const ids = Array.from(selectionState)

		if (ids.length === 0)
			return

		setRemovalProcess(new Set(ids))
        
		const toastId = toast.loading('Removal in progress', { description : 'Removing ' + ids.length + ' ' + 'record' + (ids.length > 1 ? 's' : '') })

		startTransition(async () => {
			try {
				const result = await action(ids)

				toast.dismiss(toastId)

				if (result.status === 'success') {
					toast.success('Success', { description : result.message })
                
					startTransition(() => {
						optimisticRemoveBatch(ids)
						selectionClear()
						setRemovalProcess(new Set())
					})
				} else {
					throw new Error(result.message)
				}
			} catch(error) {
				const message = error instanceof Error && error.message 

				toast.error('Failed', { description : message })

				setRemovalProcess(new Set()) 
			}
		})
	}, [ selectionState, optimisticRemoveBatch, selectionClear ])

	const performRowRemoval = useCallback((item: T) => {
		setRemovalSelection(item)
	}, [])

	const performRowRemovalCancellation = useCallback((open: boolean) => {
		if (!open)
			setRemovalSelection(null)
	}, [])

	const performRowUpdate = useCallback((item: T) => {
		setRowSelection(item)
		setUpdateOpen(true)
	}, [])

	const performRowUpdateCancellation = useCallback((open: boolean) => {
		setUpdateOpen(open)

		if (!open)
			setRowSelection(null)
	}, [])

	const performDialogOpen = useCallback(() => {
		if (refToast.current && selectionState.size > 0) {
			toast.dismiss(refToast.current)
			refToast.current = null

			selectionClear()
		}
	}, [ selectionState.size, selectionClear ])

	useEffect(() => { 
		return () => clearTimers() 
	}, [ clearTimers ])

	useEffect(() => {
		if (updateOpen)
			performDialogOpen()
	}, [ updateOpen, performDialogOpen ])
    
	return { optimistic, pending, rowSelection, updateOpen, removalProcess, removalSuccess, removalSelection, selection, selectionAll, selectionState, selectionSelectedAll, selectionSelectedPartial, performUpdate, performRemoval, performRemovalBatch, performRowUpdate, performRowUpdateCancellation, performRowRemoval, performRowRemovalCancellation, performDialogOpen, refToast }
}

export function useTableColumnVisibility<T extends string>(key: string, initial: ColumnVisibility<T>, locked: readonly T[] = []) {
	const [ visibility, setVisibility ] = usePersistedState<ColumnVisibility<T>>(key, initial)

	const visibilityLocked = useMemo(() => {
		const result = { ...visibility }

		locked.forEach((column) => result[column] = true)

		return result
	}, [ visibility, locked ])

	const setVisibilityLocked = useCallback((value: ColumnVisibility<T> | ((previous: ColumnVisibility<T>) => ColumnVisibility<T>)) => {
		setVisibility((previous) => {
			const next   = typeof value === 'function' ? value(previous) : value
			const result = { ...next }

			locked.forEach((column) => result[column] = true)

			return result
		})
	}, [ setVisibility, locked ])

	return [ visibilityLocked, setVisibilityLocked ] as const
}

export function useTableSelection<T extends ID>(data: readonly T[]) {
	const [ selectionState, setSelectionState ] = useState<ReadonlySet<string>>(new Set())
	const selectionSelectedAll     		 	 	= useMemo(() 	 => data.length > 0 && selectionState.size === data.length, 	  [ data.length, selectionState.size ])
	const selectionSelectedPartial 		 	 	= useMemo(() 	 => selectionState.size > 0 && selectionState.size < data.length, [ selectionState.size, data.length ])
	const selectionClear  		   		 	 	= useCallback(() => setSelectionState(new Set()), [])

	const selection = useCallback((id: string) => {
		setSelectionState((previous) => {
			const next = new Set(previous)

			if (next.has(id))
				next.delete(id)
			else
				next.add(id)

			return next
		})
	}, [])

	const selectionAll = useCallback(() => {
		if (selectionSelectedAll)
			setSelectionState(new Set())
		else
			setSelectionState(new Set(data.map((item) => item.id)))
	}, [ selectionSelectedAll, data ])

	return { selectionState, selectionSelectedAll, selectionSelectedPartial, selection, selectionAll, setSelectionState, selectionClear }
}

function optimisticReducer<T extends ID>(state: readonly T[], action: Optimistic<T>): readonly T[] {
	switch (action.type) {
		case 'insert':     
			return [ action.item, ...state ]

		case 'remove':      
			return state.filter((item) => item.id !== action.id)

		case 'removeBatch':
			return state.filter((item) => !action.ids.includes(item.id))

		case 'update':
			return state.map((item) => item.id === action.id ? { ...item, ...action.data } : item)

		default:
			return state
	}
}

export function useTableOptimistic<T extends ID>(initialData: readonly T[]) {
	const [ optimistic, setOptimistic ] = useOptimistic(initialData, optimisticReducer<T>)

	return {
		optimistic,
		optimisticInsert      : (item: T)                      => setOptimistic({ type : 'insert', item }),
		optimisticRemove      : (id: string)                   => setOptimistic({ type : 'remove', id }),
		optimisticRemoveBatch : (ids: readonly string[])       => setOptimistic({ type : 'removeBatch', ids }),
		optimisticUpdate      : (id: string, data: Partial<T>) => setOptimistic({ type : 'update', id, data }),
	}
}

export function useTableSort(column: string) {
	const router       	 	 	 	   = useRouter()
	const pathname     	 	 	 	   = usePathname()
	const searchParams 	 	 	 	   = useSearchParams()
	const [ pending, startTransition ] = useTransition()

	const state: Sort = useMemo(() => {
		const currentSort = searchParams.get('sort')
        
		if (currentSort === (column + '-' + 'asc'))
			return 'asc'

		if (currentSort === (column + '-' + 'desc'))
			return 'desc'
        
		return null
	}, [ searchParams, column ])

	const perform = useCallback(() => {
		const parameters = new URLSearchParams(searchParams.toString())

		if (state === 'asc')
			parameters.set('sort', column + '-' + 'desc')
		else if (state === 'desc')
			parameters.delete('sort')
		else
			parameters.set('sort', column + '-' + 'asc')

		if (parameters.has('page'))
			parameters.set('page', '1')

		startTransition(() => router.push(pathname + '?' + parameters.toString(), { scroll : false }))
	}, [ router, pathname, searchParams, column, state ])

	return { state, perform, pending }
}

export function useTableFilter() {
	const router       	 	 	 	   = useRouter()
	const pathname     	 	 	 	   = usePathname()
	const searchParams 	 	 	 	   = useSearchParams()
	const [ pending, startTransition ] = useTransition()

	const perform = useCallback((filters: Record<string, string | null | undefined>) => {
		const parameters = new URLSearchParams(searchParams.toString())

		Object.entries(filters).forEach(([ key, value ]) => {
			if (value && value.trim() !== '')
				parameters.set(key, value)
			else
				parameters.delete(key)
		})

		if (parameters.has('page'))
			parameters.set('page', '1')

		startTransition(() => router.push(pathname + '?' + parameters.toString(), { scroll : false }))
	}, [ router, pathname, searchParams ])

	const clear = useCallback((keys: readonly string[]) => {
		const parameters = new URLSearchParams(searchParams.toString())

		keys.forEach((key) => parameters.delete(key))

		if (parameters.has('page'))
			parameters.set('page', '1')

		startTransition(() => router.push(pathname + '?' + parameters.toString(), { scroll : false }))
	}, [ router, pathname, searchParams ])

	return { perform, clear, pending }
}

export const useTableFilterClear = <T extends Record<string, unknown>>(setters: Record<keyof T, (value: string) => void>) => {
	return useCallback(() => Object.values(setters).forEach((setter) => (typeof setter === 'function') && setter('')), [ setters ])
}

export const useTableSelectionToast = (selection: number, process: number, ref: RefObject<string | number | null>, options: Toast) => {
	useEffect(() => {
		if (process > 0) {
			if (ref.current) {
				toast.dismiss(ref.current)

				ref.current = null
			}

			return
		}
		
		if (selection > 0) {
			const count   = selection
			const message = count + ' record' + (count > 1 ? 's' : '') + ' ' + 'have been selected'
            
			const toastContent = {
				message     : options.title,
				dismissible : false,
				action      : {
					label   : options.actionLabel,
					onClick : options.onAction,
				},
			}

			if (ref.current)
				toast.message(toastContent.message, {
					id          : ref.current,
					description : message,
					dismissible : false,
					duration    : Infinity,
					position    : 'top-center',
					action      : toastContent.action,
				})
			else
				ref.current = toast(toastContent.message, {
					description : message,
					dismissible : false,
					duration    : Infinity,
					position    : 'top-center',
					action      : toastContent.action,
				})
		} else {
			if (ref.current) {
				toast.dismiss(ref.current)

				ref.current = null
			}
		}
	}, [ selection, options, process, ref ])
}
