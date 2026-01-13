'use client'

import type { Action, ColumnTable } from '@/app/system/growth/datasource/deal/action/schema'

import { Plus } from 'lucide-react'

import { Form, useForm }     from '@/app/system/component/form'
import { insert, update }   from '@/app/system/growth/datasource/deal/action/mutation'
import { ICON, LABEL, PATH } from '@/app/system/growth/datasource/deal/action/schema'
import { FormCollection }    from '@/app/system/growth/datasource/deal/component/form/collection'
import { Button }            from '@/component/canggu/button'
import { Keyboard }          from '@/component/canggu/keyboard'

type FormCreate = {
	readonly account : readonly { id : string, name : string, status : string | null }[]
	readonly people  : readonly { id : string, name : string }[]
}

type FormUpdate = {
	readonly open         : boolean
	readonly onOpenChange : (open: boolean) => void
	readonly onUpdate     : (id: string, data: Partial<ColumnTable>) => Promise<void>
	readonly data         : ColumnTable & { account : { id : string, name : string } | null }
	readonly account      : readonly { id : string, name : string, status : string | null }[]
	readonly people       : readonly { id : string, name : string }[]
}

export function FormCreate({ account, people }: FormCreate) {
	const form = useForm()

	const Trigger = (
		<Button appearance={'primary'} className={'text-sm'} shape={'ellipse'} size={'sm'}>
			<Plus className={'-ml-0.75 size-3.5!'} /> New <Keyboard className={'hidden bg-primary-300 text-white lg:block dark:bg-primary-700'}>N</Keyboard>
		</Button>
	)

	return (
		<Form action={insert} className={'w-3xl'} defaultOpen={form.create.open} icon={ICON} label={LABEL} mode={'create'} path={PATH} trigger={Trigger} onOpenChange={form.create.setOpen}>
			{({ state }) => <FormCollection account={account} defaultValues={{}} id={'form-create'} people={people} provision={false} state={state} />}
		</Form>
	)
}

export function FormUpdate({ open, onOpenChange, onUpdate, data, account, people }: FormUpdate) {
	const defaultValues = {
		name    : data.name,
		account : data.account?.id ?? '',
		amount  : data.amount,
		source  : data.source,
		stage   : data.stage,
	}
	
	const action = async (state: Action, formData: FormData) => {
		await onUpdate(data.id, {
			name    : formData.get('name')    as string,
			account : formData.get('account') as string,
			amount  : Number(formData.get('amount')),
			source  : formData.get('source')  as string,
			stage   : formData.get('stage')   as string,
		} as Partial<ColumnTable>)

		return await update(state, formData)
	}

	return (
		<Form action={action} className={'w-3xl'} defaultOpen={open} icon={ICON} label={LABEL} mode={'update'} path={PATH} onOpenChange={onOpenChange}>
			{({ state }) => <FormCollection account={account} defaultValues={defaultValues} id={data.id} people={people} provision={true} state={state} />}
		</Form>
	)
}
