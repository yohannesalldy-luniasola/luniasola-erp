'use client'

import type { Action, ColumnTable } from '@/app/system/growth/datasource/direct/action/schema'
import type { ID }                  from '@/component/hook/table'

import { useEffect, useRef } from 'react'

import { Plus }  from 'lucide-react'
import { toast } from 'sonner'

import { Form, FormRemoval as FormRemovalRoot, useForm } from '@/app/system/component/form'
import { insert, update, remove }                        from '@/app/system/growth/datasource/direct/action/mutation'
import { ICON, LABEL, PATH }                             from '@/app/system/growth/datasource/direct/action/schema'
import { FormCollection }                                from '@/app/system/growth/datasource/direct/component/form/collection'
import { Div }                                           from '@/component/canggu/block'
import { Button }                                        from '@/component/canggu/button'
import { Keyboard }                                      from '@/component/canggu/keyboard'
import { Small }                                         from '@/component/canggu/typography'

type FormUpdate = {
	readonly open         : boolean
	readonly onOpenChange : (open: boolean) => void
	readonly onUpdate     : (id: string, data: Partial<ColumnTable>) => Promise<void>
	readonly data         : ColumnTable
}

type FormRemoval = {
	readonly provision     : ID
	readonly onDelete      : (id: string) => Promise<void>
	readonly onOpenChange? : (open: boolean) => void
}

type FormCreateProps = {
	readonly totalAmount : number
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('id-ID', {
		style                 : 'currency',
		currency              : 'IDR',
		minimumFractionDigits : 0,
		maximumFractionDigits : 0,
	}).format(amount)
}

export function FormCreate({ totalAmount }: FormCreateProps) {
	const form = useForm()

	const Trigger = (
		<Div className={'flex items-center gap-2'}>
			<Small className={'text-xs text-neutral-500 dark:text-neutral-400'}>
				Total: {formatCurrency(totalAmount)}
			</Small>
			<Button appearance={'primary'} className={'text-sm'} shape={'ellipse'} size={'sm'}>
				<Plus className={'-ml-0.75 size-3.5!'} /> New <Keyboard className={'hidden bg-primary-300 text-white lg:block dark:bg-primary-700'}>N</Keyboard>
			</Button>
		</Div>
	)

	return (
		<Form action={insert} className={'w-3xl'} defaultOpen={form.create.open} icon={ICON} label={LABEL} mode={'create'} path={PATH} trigger={Trigger} onOpenChange={form.create.setOpen}>
			{({ state }) => <FormCollection defaultValues={{}} id={'form-create'} provision={false} state={state} />}
		</Form>
	)
}

export function FormUpdate({ open, onOpenChange, onUpdate, data }: FormUpdate) {
	const defaultValues = {
		name            : data.name,
		gclid           : data.gclid,
		fbclid          : data.fbclid,
		status          : data.status,
		purchase_amount : data.purchase_amount,
		purchase_pic    : data.purchase_pic,
	}
	
	const toastIdRef = useRef<string | number | null>(null)
	const previousStatusRef = useRef<string | undefined>(data.status)
	
	const action = async (state: Action, formData: FormData) => {
		const newStatus = formData.get('status') as string
		const statusChanged = previousStatusRef.current !== newStatus

		if (statusChanged) {
			toastIdRef.current = toast.loading('Sending data to Google...', {
				description : 'Updating lead status and syncing with Google',
				duration    : Infinity,
			})
		}

		await onUpdate(data.id, {
			name            : formData.get('name')            as string,
			gclid           : formData.get('gclid')           as string,
			fbclid          : formData.get('fbclid')          as string,
			status          : newStatus,
			purchase_amount : formData.get('purchase_amount') ? Number(formData.get('purchase_amount')) : null,
			purchase_pic    : formData.get('purchase_pic')    as string,
		} as Partial<ColumnTable>)

		const result = await update(state, formData)

		if (statusChanged && toastIdRef.current) {
			if (result.status === 'success') {
				toast.success('Status updated successfully', {
					description : 'Lead status has been synced with Google',
					id          : toastIdRef.current,
				})
			} else if (result.status === 'error') {
				toast.error('Update failed', {
					description : result.message || 'Failed to sync with Google',
					id          : toastIdRef.current,
				})
			}
			toastIdRef.current = null
		}

		previousStatusRef.current = newStatus

		return result
	}

	useEffect(() => {
		if (!open) {
			previousStatusRef.current = data.status
			if (toastIdRef.current) {
				toast.dismiss(toastIdRef.current)
				toastIdRef.current = null
			}
		}
	}, [ open, data.status ])

	return (
		<Form action={action} className={'w-3xl'} defaultOpen={open} icon={ICON} label={LABEL} mode={'update'} path={PATH} onOpenChange={onOpenChange}>
			{({ state }) => <FormCollection defaultValues={defaultValues} id={data.id} provision={true} state={state} />}
		</Form>
	)
}

export function FormRemoval({ provision, onDelete, onOpenChange }: FormRemoval) {
	const action = async (id: string) => {
		await onDelete(id)
		await remove(id)
	}

	return <FormRemovalRoot action={action} id={provision.id} label={LABEL} onOpenChange={onOpenChange} />
}
