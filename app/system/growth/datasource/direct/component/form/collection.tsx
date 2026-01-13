'use client'

import type { Action, Schema } from '@/app/system/growth/datasource/direct/action/schema'

import { useMemo, useState } from 'react'

import { Link, UserRound } from 'lucide-react'

import { LABEL }                                                                                          from '@/app/system/growth/datasource/direct/action/schema'
import { Div, Span }                                                                                      from '@/component/canggu/block'
import { Fieldset, Label, Input, Message, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/component/canggu/form'
import { Separator }                                                                                      from '@/component/canggu/separator'

type FormCollection = {
	readonly state          : Action
	readonly defaultValues? : Partial<Schema>
	readonly id             : string
	readonly provision?     : boolean
}

const PIC_OPTIONS = [ 'sales1', 'sales2', 'sales3' ] as const

export function FormCollection({ state, defaultValues, id, provision = false }: FormCollection) {
	const errors = state?.status === 'error' ? state.errors ?? {} : {}
	const values = state?.status === 'error' ? state.inputs ?? defaultValues ?? {} : defaultValues ?? {}

	const initialSelectedPics = useMemo(() => {
		if (values.purchase_pic) {
			return (values.purchase_pic as string).split(',').map(pic => pic.trim()).filter(Boolean)
		}

		return []
	}, [ values.purchase_pic ])

	const [ selectedPics, setSelectedPics ] = useState<string[]>(initialSelectedPics)

	function handlePicToggle(pic: string) {
		setSelectedPics((prev) => {
			if (prev.includes(pic)) {
				return prev.filter(p => p !== pic)
			}

			return [ ...prev, pic ]
		})
	}

	const purchasePicValue = selectedPics.join(', ')

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
				<Label htmlFor={'purchase_amount'}>Amount</Label>
				<Input adornment={<Span className={'text-sm font-medium text-neutral-600 dark:text-neutral-400'}>Rp</Span>} defaultValue={values.purchase_amount ?? ''} id={'purchase_amount'} name={'purchase_amount'} placeholder={'0'} type={'number'} />

				{errors.purchase_amount && <Message>{errors.purchase_amount[0]}</Message>}
			</Fieldset>

			<Fieldset>
				<Label htmlFor={'purchase_pic'}>PIC</Label>
				<Input name={'purchase_pic'} type={'hidden'} value={purchasePicValue} />
				<Select
					value={selectedPics[0] || ''}
					onValueChange={handlePicToggle}
				>
					<SelectTrigger id={'purchase_pic'}>
						<SelectValue placeholder={'Select PIC'} />
					</SelectTrigger>
					<SelectContent align={'start'} position={'popper'} sideOffset={5}>
						{PIC_OPTIONS.map((pic) => (
							<SelectItem key={pic} value={pic}>
								<Span className={'flex items-center gap-2'}>
									{selectedPics.includes(pic) && <Span className={'size-2 rounded-full bg-primary'} />}
									{pic}
								</Span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{selectedPics.length > 0 && (
					<Div className={'mt-2 flex flex-wrap gap-2'}>
						{selectedPics.map((pic) => (
							<Span
								className={'inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary'}
								key={pic}
							>
								{pic}
								<button
									className={'ml-1 rounded-sm hover:bg-primary/20'}
									type={'button'}
									onClick={() => handlePicToggle(pic)}
								>
									×
								</button>
							</Span>
						))}
					</Div>
				)}

				{errors.purchase_pic && <Message>{errors.purchase_pic[0]}</Message>}
			</Fieldset>

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
