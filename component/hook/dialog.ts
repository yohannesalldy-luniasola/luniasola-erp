'use client'

import type { Dispatch, SetStateAction } from 'react'

import { useEffect } from 'react'

import { toast } from 'sonner'

export const useDialogActionState = (state: { timestamp : number, status : 'idle' | 'success' | 'error', message? : string }, setOpen: Dispatch<SetStateAction<boolean>>, messageSuccess: string, messageError: string, onSuccess?: () => void) => {
	useEffect(() => {
		if (state.timestamp > 0)
			if (state.status === 'success') {
				toast.success('Success', { description : state.message ?? messageSuccess })

				setTimeout(() => {
					setOpen(false)

					if (onSuccess)
						onSuccess()
				}, 0)
			} else if (state.status === 'error') {
				toast.error('Failed', { description : state.message ?? messageError })
			}
	}, [ state.timestamp, state.status, state.message, setOpen, messageSuccess, messageError, onSuccess ])
}
