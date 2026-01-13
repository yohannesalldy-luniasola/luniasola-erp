'use client'

import type { Action } from '@/app/system/growth/datasource/deal/action/schema'

import { Plus } from 'lucide-react'

import { Form, useForm }     from '@/app/system/component/form'
import { insert }            from '@/app/system/growth/datasource/deal/action/mutation'
import { ICON, LABEL, PATH } from '@/app/system/growth/datasource/deal/action/schema'
import { FormCollection }    from '@/app/system/growth/datasource/deal/component/form/collection'
import { Button }            from '@/component/canggu/button'
import { Keyboard }          from '@/component/canggu/keyboard'

type FormCreate = {
	readonly account : readonly { id : string, name : string, status : string | null }[]
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
			{({ state }) => <FormCollection account={account} defaultValues={{}} id={'form-create'} provision={false} state={state} />}
		</Form>
	)
}
