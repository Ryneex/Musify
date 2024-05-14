import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { twMerge } from 'tailwind-merge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './shadcn/ui/dropdown-menu'
import GNP from '@/utils/getNestedProperty'

export interface IColumn {
    name?: string
    fieldValue: string
    flex?: number
    width?: number
    className?: string
    headingCellClass?: string
    rowCellClass?: string
    // eslint-disable-next-line no-unused-vars
    searchValueFormatter?: (e) => string | number
    // eslint-disable-next-line no-unused-vars
    render?: (row: any, i: number) => ReactNode
}

export interface IOptions {
    rowClass?: string
    headingClass?: string
    search?: {
        query: string
        fieldToQuery: string
    }
    checkbox?: boolean
    // eslint-disable-next-line no-unused-vars
    rowWrapper?: ({ children, row }) => ReactNode
}

export interface IEventListeners {
    // eslint-disable-next-line no-unused-vars
    onCheckedDataChange?: (data) => void
}

interface IProp {
    columns: IColumn[]
    rows: any[]
    options?: IOptions
    eventListeners?: IEventListeners
    className?: string
}

export default function Table({ columns, rows, options, eventListeners, className }: IProp) {
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [data, setData] = useState(rows)
    const rowsContainer = useRef<HTMLDivElement>(null)

    const getDataBasedOnPage = useCallback(() => data.filter((_, i) => i < rowsPerPage * page && i >= rowsPerPage * (page - 1)), [data, rowsPerPage, page])
    const isAllRowChecked = useMemo(() => !!!data.find((e) => !e.isRowChecked), [data])
    const selectedRowCount = useMemo(() => data.filter((e) => e.isRowChecked).length, [data])

    // Filters and Sorts the Data by the query user puts
    useEffect(() => {
        const query = options?.search?.query
        const fieldToQuery = options?.search?.fieldToQuery
        if (!query || !fieldToQuery) return setData(rows)
        const formatter = columns.find((e) => e.fieldValue === fieldToQuery)?.searchValueFormatter || ((e) => (e === undefined || e === null ? '' : e))

        const filteredColumns = rows.filter((e) => formatter(GNP(e, fieldToQuery)).toLowerCase().indexOf(query.toLowerCase()) > -1)
        const searched = filteredColumns.sort((a, b) => {
            if (formatter(GNP(a, fieldToQuery)).toLowerCase().indexOf(query.toLowerCase()) <= formatter(GNP(b, fieldToQuery)).toLowerCase().indexOf(query.toLowerCase())) return -1
            return 1
        })
        setData(searched)
    }, [options?.search, rows, columns])

    useEffect(() => {
        if (eventListeners?.onCheckedDataChange) eventListeners?.onCheckedDataChange(data.filter((e) => e.isRowChecked))
    }, [data, eventListeners])

    return (
        <div className={twMerge('relative flex h-full w-full flex-col overflow-hidden', className)}>
            <div className={twMerge('sticky top-0 flex h-10 w-full shrink-0 items-center border-b px-3 text-sm font-medium dark:border-white/10 dark:text-white/90', options?.headingClass)}>
                {options?.checkbox && (
                    <label htmlFor="table-checkbox" className="flex h-full w-4 cursor-pointer items-center justify-center">
                        <input onChange={(e) => setData(data.map((j) => ({ ...j, isRowChecked: e.target.checked })))} id="table-checkbox" className="cursor-pointer" type="checkbox" checked={isAllRowChecked} />
                    </label>
                )}
                {columns.map((e, i) => (
                    <div key={i} style={{ flex: e.flex || (e.width ? 'unset' : 1), width: e.width }} className={twMerge('flex h-full items-center truncate', e.className, e.headingCellClass)}>
                        {e.name || e.fieldValue}
                    </div>
                ))}
            </div>
            <div ref={rowsContainer} className="custom-scrollbar h-full w-full overflow-auto">
                {getDataBasedOnPage().map((row, i) => {
                    const returnElement = (
                        <div key={i} className={twMerge('flex h-10 w-full items-center border-b px-3 text-sm text-black/90 dark:border-white/10 dark:text-white/70', options?.rowClass)}>
                            {options?.checkbox && (
                                <label htmlFor={row.id} className="flex h-full w-4 cursor-pointer items-center justify-center">
                                    <input
                                        id={row.id}
                                        checked={row.isRowChecked || false}
                                        onChange={(e) => {
                                            const tempArr = [...data]
                                            const obj = tempArr.find((e) => e.id == row.id)
                                            obj.isRowChecked = e.target.checked
                                            setData(tempArr)
                                        }}
                                        className="cursor-pointer"
                                        type="checkbox"
                                    />
                                </label>
                            )}
                            {columns.map((e, _i) => (
                                <div key={_i} style={{ flex: e.flex || (e.width ? 'unset' : 1), width: e.width }} className={twMerge('flex h-full items-center truncate', e.className, e.rowCellClass)}>
                                    {e.render ? e.render(row, i) : GNP(row, e.fieldValue)}
                                </div>
                            ))}
                        </div>
                    )
                    return options?.rowWrapper ? (
                        <options.rowWrapper row={row} key={i}>
                            {returnElement}
                        </options.rowWrapper>
                    ) : (
                        returnElement
                    )
                })}
            </div>
            <div className="flex h-14 select-none items-center border-t px-3 dark:border-white/10">
                {options?.checkbox && <div className="text-sm">{selectedRowCount} Rows Selected</div>}
                <div className="ml-auto flex items-center gap-5 text-sm">
                    <div className="flex items-center gap-2">
                        <span>Rows per page:</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="cursor-pointer rounded-sm border px-4 py-0.5 dark:border-white/20">{rowsPerPage}</div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {[25, 50, 100].map((e, i) => (
                                    <DropdownMenuItem
                                        key={i}
                                        onClick={() => {
                                            setRowsPerPage(e)
                                            // when user is on the last page and increases the rowPerPage value, we need to reduce the page value
                                            if (page * e > data.length) {
                                                if (data.length % e === 0) return setPage(data.length / e)
                                                return setPage(Math.floor(data.length / e + 1))
                                            }
                                        }}
                                    >
                                        {e}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <span>
                        {rowsPerPage * (page - 1) + 1}-{rowsPerPage * page} of {data.length}
                    </span>
                    <div className="flex items-center gap-3">
                        <IoIosArrowBack className={`cursor-pointer text-base ${page === 1 && 'opacity-50'}`} onClick={() => setPage((e) => (e === 1 ? e : --e))} />
                        <IoIosArrowForward className={`cursor-pointer text-base ${page * rowsPerPage >= data.length && 'opacity-50'}`} onClick={() => setPage((e) => (page * rowsPerPage >= data.length ? e : ++e))} />
                    </div>
                </div>
            </div>
        </div>
    )
}
