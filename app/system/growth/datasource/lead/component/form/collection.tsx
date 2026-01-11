'use client'

import type { Action, Schema } from '@/app/system/growth/datasource/lead/action/schema'

import { Link, UserRound } from 'lucide-react'

import { LABEL }                                                                     from '@/app/system/growth/datasource/lead/action/schema'
import { Fieldset, Label, Input, Message, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/component/canggu/form'
import { Separator }                                                                 from '@/component/canggu/separator'
import { Span }                                                                      from '@/component/canggu/block'

type FormCollection = {
	readonly state          : Action
	readonly defaultValues? : Partial<Schema>
	readonly id             : string
	readonly provision?     : boolean
}

export function FormCollection({ state, defaultValues, id, provision = false }: FormCollection) {
	const errors = state?.status === 'error' ? state.errors ?? {} : {}
	const values = state?.status === 'error' ? state.inputs ?? defaultValues ?? {} : defaultValues ?? {}

	return (
		<>
			{provision && id && <Input name={'id'} type={'hidden'} value={id} />}

			<Fieldset>
				<Label htmlFor={'name'}>{LABEL} Name</Label>
				<Input adornment={<UserRound className={'size-3.5'} />} defaultValue={values.name} id={'name'} name={'name'} placeholder={LABEL + ' ' + 'Name'} type={'text'} />

				{errors.name && <Message>{errors.name[0]}</Message>}
			</Fieldset>

			<Fieldset>
				<Label htmlFor={'gclid'}>GCLID</Label>
				<Input adornment={<Link className={'size-3.5'} />} defaultValue={values.gclid ?? ''} id={'gclid'} name={'gclid'} placeholder={'GCLID'} type={'text'} />

				{errors.gclid && <Message>{errors.gclid[0]}</Message>}
			</Fieldset>

			<Fieldset>
				<Label htmlFor={'fbclid'}>FBCLID</Label>
				<Input adornment={<Link className={'size-3.5'} />} defaultValue={values.fbclid ?? ''} id={'fbclid'} name={'fbclid'} placeholder={'FBCLID'} type={'text'} />

				{errors.fbclid && <Message>{errors.fbclid[0]}</Message>}
			</Fieldset>

			<Separator className={'mb-2.5 bg-neutral-200/50 dark:bg-zinc-800/50'} />

			<Fieldset>
				<Label htmlFor={'status'}>Status</Label>
				<Select defaultValue={values.status ?? 'pending'} name={'status'}>
					<SelectTrigger className={'w-1/2'} id={'status'}>
						<SelectValue placeholder={'Select a Status'} />
					</SelectTrigger>

					<SelectContent align={'start'} position={'popper'} sideOffset={5}>
						<SelectItem value={'pending'}>
							<Span className={'flex items-center gap-2'}>
								<Span className={'size-2 rounded-full bg-yellow-500'} /> Pending
							</Span>
						</SelectItem>

						<SelectItem value={'in progress'}>
							<Span className={'flex items-center gap-2'}>
								<Span className={'size-2 rounded-full bg-blue-500'} /> In Progress
							</Span>
						</SelectItem>

						<SelectItem value={'cancelled'}>
							<Span className={'flex items-center gap-2'}>
								<Span className={'size-2 rounded-full bg-red-500'} /> Cancelled
							</Span>
						</SelectItem>

						<SelectItem value={'passed'}>
							<Span className={'flex items-center gap-2'}>
								<Span className={'size-2 rounded-full bg-emerald-500'} /> Passed
							</Span>
						</SelectItem>
					</SelectContent>
				</Select>

				{errors.status && <Message>{errors.status[0]}</Message>}
			</Fieldset>
		</>
	)
}
