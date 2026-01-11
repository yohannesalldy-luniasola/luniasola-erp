'use client'

import type { Action, ColumnTable } from '@/app/system/growth/datasource/account/action/schema'
import type { ID }                  from '@/component/hook/table'

import { Plus } from 'lucide-react'

import { Form, FormRemoval as FormRemovalRoot, useForm } from '@/app/system/component/form'
import { insert, update, remove }                        from '@/app/system/growth/datasource/account/action/mutation'
import { ICON, LABEL, PATH }                             from '@/app/system/growth/datasource/account/action/schema'
import { FormCollection }                                from '@/app/system/growth/datasource/account/component/form/collection'
import { Button }                                        from '@/component/canggu/button'
import { Keyboard }                                      from '@/component/canggu/keyboard'

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

export function FormCreate() {
	const form = useForm()

	const Trigger = (
		<Button appearance={'primary'} className={'text-sm'} shape={'ellipse'} size={'sm'}>
			<Plus className={'-ml-0.75 size-3.5!'} /> New <Keyboard className={'hidden bg-primary-300 text-white lg:block dark:bg-primary-700'}>N</Keyboard>
		</Button>
	)

	return (
		<Form action={insert} defaultOpen={form.create.open} icon={ICON} label={LABEL} mode={'create'} path={PATH} trigger={Trigger} onOpenChange={form.create.setOpen}>
			{({ state }) => <FormCollection id={'form-create'} state={state} />}
		</Form>
	)
}

export function FormUpdate({ open, onOpenChange, onUpdate, data }: FormUpdate) {
	const defaultValues = {
		name    : data.name,
		country : data.country,
		status  : data.status,
	}
	
	const action = async (state: Action, formData: FormData) => {
		const updated: Partial<ColumnTable> = {
			name    : formData.get('name')        as string,
			country : formData.get('country')     as string,
			status  : formData.get('status')      as 'active' | 'inactive',
		}

		await onUpdate(data.id, updated)

		return await update(state, formData)
	}

	return (
		<Form action={action} defaultOpen={open} icon={ICON} label={LABEL} mode={'update'} path={PATH} onOpenChange={onOpenChange}>
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
