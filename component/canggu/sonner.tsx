'use client'

import type { CSSProperties } from 'react'

import { CircleCheckIcon, InfoIcon, Loader2Icon, TriangleAlertIcon } from 'lucide-react'
import { useTheme }                                                  from 'next-themes'
import { Toaster as Sonner, type ToasterProps }                      from 'sonner'

export function Toaster({ ...props }: ToasterProps) {
	const { theme = 'system' } = useTheme()

	return <Sonner className={'toaster group **:data-button:rounded-xl! **:data-button:bg-primary-500! **:data-content:gap-0.25! **:data-title:font-semibold! dark:**:data-button:text-white! [&_li]:items-start! [&_svg]:mt-1.5 [&_svg]:stroke-primary **:data-button:[&_svg]:mt-0'} icons={{ success : <CircleCheckIcon className={'size-4'} />, info : <InfoIcon className={'size-4'} />, warning : <TriangleAlertIcon className={'size-4 stroke-red-500!'} />, error : <TriangleAlertIcon className={'size-4 stroke-red-500!'} />, loading : <Loader2Icon className={'size-4 animate-spin'} /> }} style={{ '--normal-bg' : theme === 'dark' ? 'var(--color-black)' : 'var(--background)', '--normal-text' : 'var(--foreground)', '--toast-icon-margin-end' : '.150rem', '--normal-border' : 'var(--border)', '--border-radius' : '.700rem' } as CSSProperties} theme={theme as ToasterProps['theme']} {...props} />
}
