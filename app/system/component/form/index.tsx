'use client'

import type { SchemaAction }                        from '@/component/utility/schema'
import type { LucideIcon }                          from 'lucide-react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

import { useRouter } from 'next/navigation'

import { useState, useActionState, useCallback, useTransition, useId, useEffect, useRef, useMemo, useContext, createContext } from 'react'

import { Trash2, Loader2, Send } from 'lucide-react'
import { toast }                 from 'sonner'

import { Button }                                                                                                                                                                                                                                                                                                        from '@/component/canggu/button'
import { Dialog, DialogContent, DialogCard, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose, DialogTrigger, DialogAlert, DialogAlertContent, DialogAlertCard, DialogAlertHeader, DialogAlertTitle, DialogAlertDescription, DialogAlertFooter, DialogAlertCancel, DialogAlertAction } from '@/component/canggu/dialog'
import { Form as FormRoot }                                                                                                                                                                                                                                                                                              from '@/component/canggu/form'
import { Keyboard }                                                                                                                                                                                                                                                                                                      from '@/component/canggu/keyboard'
import { useKeyboard }                                                                                                                                                                                                                                                                                                   from '@/component/hook/keyboard'
import { useMobile }                                                                                                                                                                                                                                                                                                     from '@/component/hook/mobile'
import { classNames }                                                                                                                                                                                                                                                                                                    from '@/component/utility/style'

type Form = {
	readonly trigger?      : ReactNode
	readonly action        : (state: SchemaAction, payload: FormData) => Promise<SchemaAction>
	readonly className?    : string
	readonly children      : (props: { state : SchemaAction })        => ReactNode 
	readonly onOpenChange? : (open: boolean) 		 		    	  => void
	readonly defaultOpen?  : boolean
	readonly label         : string
	readonly path          : string
	readonly mode?         : 'create' | 'update'
	readonly icon          : LucideIcon
}

type FormContext = {
	readonly create : {
		readonly open       : boolean
		readonly openDialog : () => void
		readonly setOpen    : Dispatch<SetStateAction<boolean>>
	}
}

type FormSubmission = Omit<Form, 'trigger' | 'defaultOpen'> & { onOpenChange : Dispatch<SetStateAction<boolean>> }
type FormRemoval 	= {
	readonly id            : string
	readonly label         : string
	readonly action        : (id: string) => Promise<void>
	readonly onOpenChange? : (open: boolean) => void
	readonly defaultOpen?  : boolean
}

const FormContext = createContext<FormContext | null>(null)

export function useForm() {
	const context = useContext(FormContext)

	if (!context)
		throw new Error('useForm must be invoked within a FormProvider context')

	return context
}

export function FormProvider({ children }: { readonly children : ReactNode }) {
	const [ open, setOpen ] = useState(false)

	const openDialog = useCallback(() => setOpen(true), [])
	const value 	 = useMemo<FormContext>(() => ({ create : { open, setOpen, openDialog } }), [ open, openDialog ])

	return (
		<FormContext value={value}>
			{children}
		</FormContext>
	)
}

export function Form({ trigger, className, defaultOpen = false, onOpenChange, mode = 'create', ...props }: Form) {
	const [ openInternal, setOpenInternal ] = useState(defaultOpen)

	const open = onOpenChange ? (defaultOpen ?? false) : openInternal

	const performOpenChange = useCallback((value: boolean | ((previous: boolean) => boolean)) => {
		const next = typeof value === 'function' ? value(open) : value

		if (onOpenChange)
			onOpenChange(next)
		else
			setOpenInternal(next)
	}, [ onOpenChange, open ])

	useKeyboard({ key : mode === 'create' ? 'n' : '', condition : !open, onAction : () => performOpenChange(true), modifier : 'none' })

	return (
		<Dialog open={open} onOpenChange={performOpenChange}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

			<DialogContent className={classNames('w-lg', className)} overlay={true}>
				<FormSubmission mode={mode} onOpenChange={performOpenChange} {...props} />
			</DialogContent>
		</Dialog>
	)
}

function FormSubmission({ action, children, label, path, icon, mode, onOpenChange }: FormSubmission) {
	const router 	 	 	 	 	 	 = useRouter()
	const [ pendingTransition ]          = useTransition()
	const [ state, formAction, pending ] = useActionState(action, { status : 'idle', timestamp : .000 })
	const refTimestamp                   = useRef(state.timestamp)

	const formId = 'form' + '-' + mode + '-' + useId()
	const Icon   = icon as LucideIcon

	const performSuccess = useCallback(() => {
		router.push(path)
		router.refresh()
	}, [ router, path ])

	useEffect(() => {
		if (state.timestamp !== refTimestamp.current) {
			if (state.status === 'success') {
				toast.success('Success', { description : state.message })

				onOpenChange(false)
				
				if (mode === 'create')
					performSuccess()
			} else if (state.status === 'error') {
				toast.error('Failed', { description : state.message })
			}
            
			refTimestamp.current = state.timestamp
		}
	}, [ state, label, mode, onOpenChange, performSuccess ])
	
	return (
		<DialogCard>
			<DialogHeader>
				<DialogTitle className={'flex flex-row items-center gap-2 capitalize'}>
					<Icon className={'size-4 text-primary'} strokeWidth={2.500} /> {mode} {label}
				</DialogTitle>
				<DialogDescription>{mode === 'create' ? 'Create a new ' + label + ' ' + 'data source information' : 'Update ' + label + ' ' + 'data source information'}</DialogDescription>
			</DialogHeader>

			<DialogBody className={'max-h-[calc(100vh-23.000rem)] overflow-auto'}>
				<FormRoot action={formAction} id={formId}>
					{children({ state })} 
				</FormRoot>
			</DialogBody>

			<DialogFooter>
				<DialogClose asChild>
					<Button appearance={'ghost'} className={'font-normal'} shape={'ellipse'} size={useMobile() ? 'md' : 'sm'} type={'button'}>Cancel</Button>
				</DialogClose>

				<Button appearance={'primary'} className={'font-normal capitalize'} disabled={pending || pendingTransition} form={formId} shape={'ellipse'} size={useMobile() ? 'md' : 'sm'} type={'submit'}>
					{pending || pendingTransition ? <Loader2 className={'relative left-0.25 size-2.5! animate-spin'} strokeWidth={2.500} /> : <Send className={'relative top-0 left-0.25 size-2.5! fill-white'} strokeWidth={2.500} />} {mode}
				</Button>
			</DialogFooter>
		</DialogCard>
	)
}

export function FormRemoval({ id, label, action, onOpenChange, defaultOpen = true }: FormRemoval) {
	const [ open, setOpen ]                   = useState(defaultOpen)
	const [ removalProcess, startTransition ] = useTransition()

	const performOpenChange = useCallback((value: boolean) => {
		setOpen(value)

		if (value && onOpenChange)
			onOpenChange(value)

		if (!value && onOpenChange)
			onOpenChange(false)
	}, [ onOpenChange ])

	const performRemoval = useCallback(() => {
		startTransition(async () => await action(id))
	}, [ action, id ])

	useKeyboard({ key : 'r', condition : open, onAction : performRemoval, modifier : 'none' })
    
	return (
		<DialogAlert open={open} onOpenChange={performOpenChange}>
			<DialogAlertContent className={'sm:max-w-md'} overlay={true}>
				<DialogAlertCard>
					<DialogAlertHeader>
						<DialogAlertTitle>
							<Trash2 className={'text-red-500'} strokeWidth={2.500} /> Remove {label}
						</DialogAlertTitle>
						<DialogAlertDescription>This action is permanent and cannot be reversed</DialogAlertDescription>
					</DialogAlertHeader>
                        
					<DialogAlertFooter>
						<DialogAlertCancel asChild>
							<Button appearance={'ghost'} className={'font-normal'} shape={'ellipse'} size={useMobile() ? 'md' : 'sm'} type={'button'}>Cancel</Button>
						</DialogAlertCancel>

						<DialogAlertAction asChild>
							<Button appearance={'destructive'} disabled={removalProcess} shape={'ellipse'} size={useMobile() ? 'md' : 'sm'} type={'button'} onClick={performRemoval}>
								Remove <Keyboard className={'hidden bg-red-300 text-white lg:block dark:bg-red-300 dark:text-white'}>R</Keyboard>
							</Button>
						</DialogAlertAction>
					</DialogAlertFooter>
				</DialogAlertCard>
			</DialogAlertContent>
		</DialogAlert>
	)
}
