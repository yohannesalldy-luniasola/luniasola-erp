'use client'

import { useSearchParams } from 'next/navigation'

import { useState, useCallback } from 'react'

import { ToolbarFilter as ToolbarFilterRoot, useToolbarFilter }                                        from '@/app/system/component/toolbar/filter'
import { SVG, Path }                                                                                   from '@/component/canggu/block'
import { Fieldset, Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/component/canggu/form'
import { useTableFilter, useTableFilterClear }                                                         from '@/component/hook/table'

export function ToolbarFilter() {
	const searchParams 				 	  = useSearchParams()
	const [ filterChannel, setFilterChannel ] = useState<string>(searchParams.get('channel') ?? '')
	const toolbarFilter 	 	 	 	  = useToolbarFilter()
	const tableFilter 	 	 	 	 	  = useTableFilter()

	const performChannelChange = useCallback((value: string) => {
		const channel = value === 'all' ? '' : value

		setFilterChannel(channel)

		tableFilter.perform({ 
			channel : channel || null, 
		})
	}, [ tableFilter ])

	const performClear  = useTableFilterClear({ filterChannel : setFilterChannel })
	const performFilter = useCallback(() => tableFilter.perform({ channel : filterChannel || null }), [ tableFilter, filterChannel ])

	return (
		<ToolbarFilterRoot filters={[ 'channel' ]} open={toolbarFilter.open} pending={tableFilter.pending} title={'Filter'} onClear={performClear} onFilter={performFilter} onOpenChange={toolbarFilter.setOpen}>
			<Fieldset>
				<Label>Channel</Label>
				<Select defaultValue={String(filterChannel ?? 'Google Ads')} value={filterChannel || 'all'} onValueChange={performChannelChange}>
					<SelectTrigger className={'w-full'}>
						<SelectValue placeholder={'All Channel'} />
					</SelectTrigger>

					<SelectContent align={'start'} position={'popper'} sideOffset={5}>
						<SelectItem value={'all'}>All Channel</SelectItem>
						<SelectGroup>
							<SelectItem value={'Google Ads'}>
								<SVG className={'-mr-1 size-3.5'} height={18.000} viewBox={'0 0 256 256'} width={18.000}>
									<Path d={'M87.1164 40.4642C89.5908 33.9663 92.9931 27.9842 98.0449 23.1366C118.252 3.43679 151.656 8.38753 165.368 33.1412C175.678 51.9128 186.607 70.2718 197.226 88.837C214.959 119.676 232.898 150.515 250.425 181.457C265.168 207.345 249.188 240.041 219.908 244.476C201.968 247.157 185.163 238.906 175.884 222.816C160.317 195.69 144.646 168.565 129.078 141.542C128.768 140.923 128.356 140.407 127.944 139.892C126.294 138.551 125.572 136.591 124.541 134.838C117.634 122.667 110.52 110.6 103.612 98.5322C99.179 90.6936 94.5395 82.958 90.1063 75.1194C86.0854 68.1058 84.2297 60.4734 84.4359 52.4285C84.7452 48.3029 85.2607 44.1772 87.1164 40.4642Z'} fill={'#155dfc'} />
									<Path d={'M87.1157 40.4639C86.1879 44.1769 85.3631 47.89 85.1569 51.8093C84.8476 60.4731 87.0126 68.518 91.3428 76.0473C102.684 95.5408 114.025 115.138 125.262 134.734C126.293 136.488 127.118 138.241 128.149 139.891C121.963 150.618 115.777 161.241 109.488 171.968C100.828 186.923 92.1676 201.982 83.4042 216.937C82.9918 216.937 82.8887 216.731 82.7856 216.421C82.6825 215.596 82.9918 214.874 83.198 214.049C87.425 198.578 83.9197 184.86 73.3005 173.102C66.8053 165.986 58.5574 161.963 49.0723 160.622C36.7004 158.869 25.772 162.066 15.9776 169.802C14.2249 171.143 13.0908 173.102 11.0288 174.134C10.6164 174.134 10.4102 173.928 10.3071 173.618C15.2559 165.057 20.1015 156.497 25.0503 147.936C45.4638 112.456 65.8774 76.9756 86.394 41.5984C86.6002 41.1859 86.9095 40.8764 87.1157 40.4639Z'} fill={'#FABC04'} />
									<Path d={'M10.72 173.928C12.6789 172.174 14.5346 170.318 16.5966 168.668C41.6496 148.865 79.2807 163.201 84.7449 194.556C86.0852 202.085 85.3635 209.305 83.0954 216.525C82.9923 217.144 82.8892 217.659 82.683 218.278C81.7551 219.928 80.9303 221.682 79.8993 223.332C70.7235 238.494 57.2176 246.023 39.4846 244.888C19.1741 243.444 3.19378 228.18 0.410113 207.964C-0.930172 198.166 1.02871 188.986 6.08055 180.529C7.11154 178.672 8.34872 177.022 9.48281 175.165C9.9983 174.753 9.7921 173.928 10.72 173.928Z'} fill={'#34A852'} />
								</SVG> Google Ads
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</Fieldset>
		</ToolbarFilterRoot>
	)
}

export { ToolbarFilterFallback } from '@/app/system/component/toolbar/filter'
