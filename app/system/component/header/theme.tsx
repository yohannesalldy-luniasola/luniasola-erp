'use client'

import { Eclipse, Moon } from 'lucide-react'
import { useTheme }      from 'next-themes'

import { Span }                                    from '@/component/canggu/block'
import { Button }                                  from '@/component/canggu/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/component/canggu/tooltip'

export function HeaderTheme() {
	const { setTheme, resolvedTheme } = useTheme()

	function perform(): void { 
		return setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button appearance={'ghost'} icon={true} shape={'circle'} size={'sm'} onClick={perform}>
					<Eclipse className={'size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90'} />
					<Moon className={'absolute size-4 scale-0 rotate-180 transition-all dark:scale-100 dark:rotate-0'} />
					<Span className={'sr-only'}>Toggle Theme</Span>
				</Button>
			</TooltipTrigger>

			<TooltipContent align={'center'} alignOffset={8} side={'bottom'}>
				<Span suppressHydrationWarning>
					{resolvedTheme === 'dark' ? 'Light' : 'Dark'} Theme
				</Span>
			</TooltipContent>
		</Tooltip>
	)
}
