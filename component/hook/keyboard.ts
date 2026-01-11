'use client'

import { useEffect } from 'react'

type KeyboardAction = {
	readonly key        : string
	readonly onAction   : () => void
	readonly condition? : boolean
	readonly modifier?  : 'ctrl' | 'meta' | 'alt' | 'shift' | 'none' 
	readonly prevent?   : boolean
}

export function useKeyboard({ key, onAction, condition = true, modifier = 'none', prevent = true }: KeyboardAction) {
	useEffect(() => {
		function performKeyDown(event: KeyboardEvent) {
			const target = event.target as HTMLElement
			const input  = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' ||  target.isContentEditable

			if (input)
				return

			const match = event.key.toLowerCase() === key.toLowerCase()
			const meta  = event.metaKey
			const ctrl  = event.ctrlKey
			const alt   = event.altKey
			const shift = event.shiftKey

			let matchModifier = false

			switch (modifier) {
				case 'meta':
					matchModifier = meta && !ctrl && !alt && !shift 
					break

				case 'ctrl': 
					matchModifier = ctrl && !meta && !alt && !shift 
					break 

				case 'alt':  
					matchModifier = alt && !meta && !ctrl && !shift
					break

				case 'shift':
					matchModifier = shift && !meta && !ctrl && !alt
					break 

				case 'none':  
					matchModifier = !meta && !ctrl && !alt
					break 
			}

			if (match && matchModifier && condition) {
				if (prevent)
					event.preventDefault()

				onAction()
			}
		}

		window.addEventListener('keydown', performKeyDown)

		return () => window.removeEventListener('keydown', performKeyDown)
	}, [ key, onAction, condition, modifier, prevent ])
}
