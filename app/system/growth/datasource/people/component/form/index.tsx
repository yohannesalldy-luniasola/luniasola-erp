'use client'

import type { Action, ColumnTable } from '@/app/system/growth/datasource/people/action/schema'
import type { ID }                  from '@/component/hook/table'

import { Plus } from 'lucide-react'

import { Form, FormRemoval as FormRemovalRoot, useForm } from '@/app/system/component/form'
import { insert, update, remove }                        from '@/app/system/growth/datasource/people/action/mutation'
import { ICON, LABEL, PATH }                             from '@/app/system/growth/datasource/people/action/schema'
import { FormCollection }                                from '@/app/system/growth/datasource/people/component/form/collection'
import { Button }                                        from '@/component/canggu/button'
import { Keyboard }                                      from '@/component/canggu/keyboard'

type FormCreate = {
	readonly account : readonly { id : string, name : string }[]
}

type FormUpdate = {
	readonly open         : boolean
	readonly onOpenChange : (open: boolean) => void
	readonly onUpdate     : (id: string, data: Partial<ColumnTable>) => Promise<void>
	readonly data         : ColumnTable
	readonly account      : readonly { id : string, name : string }[]
}

type FormRemoval = {
	readonly provision     : ID
	readonly onDelete      : (id: string) => Promise<void>
	readonly onOpenChange? : (open: boolean) => void
}

export function FormCreate({ account }: FormCreate) {
	const form = useForm()

	const Trigger = (
		<Button appearance={'primary'} className={'text-sm'} shape={'ellipse'} size={'sm'}>
			<Plus className={'-ml-0.75 size-3.5!'} /> New <Keyboard className={'hidden bg-primary-300 text-white lg:block dark:bg-primary-700'}>N</Keyboard>
		</Button>
	)

	return (
		<Form action={insert} className={'w-3xl'} defaultOpen={form.create.open} icon={ICON} label={LABEL} mode={'create'} path={PATH} trigger={Trigger} onOpenChange={form.create.setOpen}>
			{({ state }) => <FormCollection account={account as { id : string, name : string }[]} defaultValues={{}} id={'form-create'} provision={false} state={state} />}
		</Form>
	)
}

export function FormUpdate({ open, onOpenChange, onUpdate, data, account }: FormUpdate) {
	const defaultValues = {
		name          : data.name,
		email         : data.email,
		phone         : data.phone,
		accountPeople : JSON.stringify(
			(data.accountPeople ?? []).map((data) => ({
				account     : data.account?.id   ?? '',
				accountName : data.account?.name ?? '',
				designation : data.designation   ?? '',
			})).filter((data) => Boolean(data.account)),
		),
	}
	
	const action = async (state: Action, formData: FormData) => {
		await onUpdate(data.id, {
			name  : formData.get('name')  as string,
			email : formData.get('email') as string,
			phone : formData.get('phone') as string,
		} as Partial<ColumnTable>)

		return await update(state, formData)
	}

	return (
		<Form action={action} className={'w-3xl'} defaultOpen={open} icon={ICON} label={LABEL} mode={'update'} path={PATH} onOpenChange={onOpenChange}>
			{({ state }) => <FormCollection account={account as { id : string, name : string }[]} defaultValues={defaultValues} id={data.id} provision={true} state={state} />}
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
