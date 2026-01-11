'use client'

import type { Action, Schema } from '@/app/system/growth/datasource/account/action/schema'

import { CircleUserRound } from 'lucide-react'

import { LABEL }                                                                                                                                     from '@/app/system/growth/datasource/account/action/schema'
import { Span }                                                                                                                                      from '@/component/canggu/block'
import { Fieldset, Label, Input, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectSeparator, Message } from '@/component/canggu/form'
import { Separator }                                                                                                                                 from '@/component/canggu/separator'

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
				<Input adornment={<CircleUserRound className={'size-3.5'} />} defaultValue={values.name} id={'name'} name={'name'} placeholder={LABEL + ' ' + 'Name'} type={'text'} />

				{errors.name && <Message>{errors.name[0]}</Message>}
			</Fieldset>

			<Fieldset>
				<Label className={'justify-between'} htmlFor={'country'}>
					<Span>Country</Span>
					<Span className={'text-2xs font-medium text-neutral-400'}>(Optional)</Span>
				</Label>
				<Select defaultValue={values.country} name={'country'}>
					<SelectTrigger id={'country'}>
						<SelectValue placeholder={'Select a Country'} />
					</SelectTrigger>

					<SelectContent align={'start'} className={'w-72'} position={'popper'} sideOffset={5}>
						<SelectGroup>
							<SelectLabel>Asia</SelectLabel>
							<SelectItem value={'ID'}>Indonesia</SelectItem>
							<SelectItem value={'MY'}>Malaysia</SelectItem>
							<SelectItem value={'SG'}>Singapore</SelectItem>
						</SelectGroup>

						<SelectSeparator />

						<SelectGroup>
							<SelectLabel>America</SelectLabel>
							<SelectItem value={'US'}>United States of America</SelectItem>
						</SelectGroup>

						<SelectSeparator />

						<SelectGroup>
							<SelectLabel>Europe</SelectLabel>
							<SelectItem value={'GB'}>United Kingdom</SelectItem>
							<SelectItem value={'DE'}>Germany</SelectItem>
							<SelectItem value={'FR'}>France</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				
				{errors.country && <Message>{errors.country[0]}</Message>}
			</Fieldset>

			<Separator className={'mb-2.5 bg-neutral-200/50 dark:bg-zinc-800/50'} />

			<Fieldset>
				<Label htmlFor={'status'}>Status</Label>
				<Select defaultValue={values.status} name={'status'}>
					<SelectTrigger className={'w-1/2'} id={'status'}>
						<SelectValue placeholder={'Select a Status'} />
					</SelectTrigger>

					<SelectContent align={'start'} position={'popper'} sideOffset={5}>
						<SelectItem value={'active'}>
							<Span className={'flex items-center gap-2'}>
								<Span className={'size-2 rounded-full bg-emerald-500'} /> Active
							</Span>
						</SelectItem>

						<SelectItem value={'inactive'}>
							<Span className={'flex items-center gap-2'}>
								<Span className={'size-2 rounded-full bg-neutral-300'} /> Inactive
							</Span>
						</SelectItem>
					</SelectContent>
				</Select>

				{errors.status && <Message>{errors.status[0]}</Message>}
			</Fieldset>
		</>
	)
}
