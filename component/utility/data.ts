import { z } from 'zod'

export function number(value: unknown): number {
	if (value === null || value === undefined || value === '') 
		return 0

	return Number.isFinite(Number(value)) ? Number(value) : 0
}

export function numberSchema({ field, min = 0, max = Infinity, mandatory = true }: { field : string, min : number, max : number, mandatory : boolean }) {
	if (mandatory)
		return z.string({ error : field + ' ' + 'is a mandatory field' }).trim().min(1, { message : field + ' ' + 'is a mandatory field' }).transform((value) => Number(value)).refine((value) => !isNaN(value), { message : field + ' ' + 'is malformed' }).refine((value) => value >= min, { message : field + ' ' + 'must be ' + min + + ' ' + 'or greater' }).refine((value) => value <= max, { message : field + ' ' + 'exceeds maximum limit' })

	return z.string().trim().optional().transform((value) => (value == null || value === '' ? undefined : Number.isNaN(+value) ? undefined : +value)).pipe(z.number().min(min, { message : field + ' ' + 'must be at least' + ' ' + min }).max(max, { message : field + ' ' + 'exceeds maximum limit' }).optional())
}

export function numberCurrency(value: string | number | undefined | null): string {
	if (value === '' || value === undefined || value === null)
		return ''

	const [ integer, decimal ] = String(value).split('.')

	if (isNaN(Number(integer)))
		return ''

	const format = new Intl.NumberFormat('en-US').format(Number(integer))

	if (decimal !== undefined)
		return format + '.' + decimal

	return format
}

export function numberCurrencyParse(value: string): string {
	return value.replace(/,/g, '')
}
