import type { ColumnLabels, ColumnDefinition } from '@/component/hook/table'

import { jsPDF } from 'jspdf'
import autotable from 'jspdf-autotable'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

type Filters = Record<string, string | undefined>

type ProduceExcel<T extends string, R extends Record<string, unknown>> = {
	readonly data       : readonly R[]
	readonly visibility : Record<T, boolean>
	readonly label      : ColumnLabels<T>
	readonly filename   : string
}

type ProduceCSV<T extends string, R extends Record<string, unknown>> = {
	readonly data       : readonly R[]
	readonly visibility : Record<T, boolean>
	readonly label      : ColumnLabels<T>
	readonly filename   : string
}

type ProducePDF<T extends string, R extends Record<string, unknown>> = {
	readonly data       : readonly R[]
	readonly visibility : Record<T, boolean>
	readonly label      : ColumnLabels<T>
	readonly filters    : Filters
	readonly filename   : string
	readonly title      : string
}

function columnVisibility<T extends string>(visibility: Record<T, boolean>, label: ColumnLabels<T>): readonly ColumnDefinition<T>[] {
	const columns = [] as ColumnDefinition<T>[]

	(Object.keys(visibility) as unknown as readonly T[]).forEach((key: T) => (visibility[key] && label[key]) && columns.push({ key, label : label[key] }))

	return columns
}

function format(value: unknown): string {
	if (value === null || value === undefined)
		return '—'

	return String(value)
}

export const produceExcel = <T extends string, R extends Record<string, unknown>>({ data, visibility, label, filename }: ProduceExcel<T, R>): void => {
	const columns   = columnVisibility<T>(visibility, label)
	const headers   = columns.map((column) => column.label)
	const rows      = data.map((record) => columns.map((column) => format(record[column.key])))
	const worksheet = XLSX.utils.aoa_to_sheet([ headers, ...rows ])

	worksheet['!cols'] = columns.map((column, index) => {
		const lengthHeader = column.label.length
		const lengthData   = Math.max(...rows.map((row) => String(row[index] ?? '').length), 0)

		return { wch : Math.max(lengthHeader, lengthData, 10) }
	})

	const workbook = XLSX.utils.book_new()

	XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
	XLSX.writeFile(workbook, filename + '.' + 'xlsx')
}

export const produceCSV = <T extends string, R extends Record<string, unknown>>({ data, visibility, label, filename }: ProduceCSV<T, R>): void => {
	const columns = columnVisibility<T>(visibility, label)
	const headers = columns.map((column) => column.label).join(',')

	const rows = data.map((record) => columns.map((column) => {
		const value = format(record[column.key])

		return '"' + value.replace(/"/g, '""') + '"'
	}).join(','))

	const content = [ headers, ...rows ].join('\n')
	const blob    = new Blob([ content ], { type : 'text/csv; charset=utf-8;' })
	const url     = URL.createObjectURL(blob)
	const link    = document.createElement('a')
    
	link.href          = url
	link.download      = filename + '.' + 'csv'
	link.style.display = 'none'
    
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)

	URL.revokeObjectURL(url)
}

export const producePDF = <T extends string, R extends Record<string, unknown>>({ data, visibility, label, filters, filename, title }: ProducePDF<T, R>): void => {
	const columns = columnVisibility<T>(visibility, label)

	const document = new jsPDF({ 
		orientation : 'landscape',
		unit        : 'mm',
		format      : 'a4',
	})

	const image = new Image()
	image.src = '/asset/static/brand/luniasola/main.png'
	document.addImage(image, 'png', 14.000, 11.000, 10.000, 10.000)

	document.setFontSize(12.000)
	document.setFont('helvetica', 'bold')
	document.text(title, 27.000, 15.000)

	document.setFontSize(8.000)
	document.setFont('helvetica', 'normal')
	document.setTextColor(100)
	document.text('Date of Generation: ' + new Date().toLocaleDateString('en-US', { year : 'numeric', month : 'long', day : 'numeric' }), 27.000, 20.000)

	document.setFontSize(8.000)
	document.setFont('helvetica', 'normal')
	document.setTextColor(100)
	document.text('Impact-Driven Software Artistry', document.internal.pageSize.width - 14.000, 20.000, { align : 'right' })

	let position = 21.000
	const active = Object.entries(filters).filter(([ , value ]) => value)

	if (active.length > 0) {
		document.setFontSize(8.750)
		document.setFont('helvetica', 'italic')
        
		active.forEach(([ key, value ]) => {
			const label = key.charAt(0).toUpperCase() + key.slice(1)

			document.text(label + ': "' + value + '"', 14.000, position)
			position += 5.000
		})
	}

	const headers = columns.map((column) => column.label)
	const body    = data.map((record) => columns.map((column) => format(record[column.key])))

	autotable(document, {
		head       : [ headers ],
		body       : body,
		startY     : position + 5.000,
		theme      : 'grid',
		styles     : { fontSize : 8.000, cellPadding : 3.000 },
		headStyles : { lineColor : [ 189, 195, 199 ], lineWidth : 0.100, fillColor : [ 250.000, 250.000, 250.000 ], textColor : [ .000, .000, .000 ]  },
		margin     : { top : 10.000, right : 14.000, bottom : 15.000, left : 14.000 },
	})

	const count = document.getNumberOfPages()

	for (let index = 1; index <= count; index++) {
		document.setPage(index)
		document.setFontSize(8.000)
		document.setTextColor(150)
		document.text('Page' + ' ' + index + ' ' + 'of' + ' ' + count, document.internal.pageSize.width - 14.000, document.internal.pageSize.height - 10.000, { align : 'right' })
		
		document.setFontSize(8.000)
		document.setFont('helvetica', 'normal')
		document.setTextColor(150)
		document.text('PT Luniasola Internasional Indonesia', 14.000, document.internal.pageSize.height - 10.000, { align : 'left' })
	}

	document.save(filename + '.' + 'pdf')
}

export const produceValidation = <T>(data: readonly T[]): void => {
	if (data.length === 0) {
		toast.error('No data', { description : 'No data available to produce' })

		throw new Error('No data')
	}
}

export const produceExtraction = (searchParams: URLSearchParams, keys: string[]): Record<string, string | undefined> => {
	const filters: Record<string, string | undefined> = {}

	keys.forEach((key) => filters[key] = searchParams.get(key) ?? undefined)

	return filters
}
