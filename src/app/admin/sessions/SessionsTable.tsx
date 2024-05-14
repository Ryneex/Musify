'use client'

import React, { useState } from 'react'
import { DateTime } from 'luxon'
import Table, { IColumn } from '@/components/Table'
import { Input } from '@/components/shadcn/ui/input'
import { IoFilterOutline } from 'react-icons/io5'
import { Button } from '@/components/button'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/ui/popover'
import { v4 } from 'uuid'

export default function PlaylistsTable({ data }: { data: any[] }) {
    const [input, setInput] = useState('')
    const [queryField, setQueryField] = useState('name')
    const columns: IColumn[] = [
        {
            name: 'No.',
            fieldValue: '',
            render(_, i) {
                return i + 1
            },
            width: 30,
            className: 'pl-2',
        },
        {
            name: 'id',
            fieldValue: '_id',
            flex: 2,
            className: 'pl-5',
        },
        {
            name: 'User',
            fieldValue: 'user.email',
            flex: 2,
        },
        {
            name: 'Expires At',
            fieldValue: 'expiresAt',
            render(row) {
                return DateTime.fromMillis(Date.parse(row.expiresAt)).toFormat('dd LLL yyyy')
            },
            width: 150,
            className: 'justify-end',
        },
    ]

    return (
        <div className="flex h-full w-full flex-col gap-2">
            <div className="flex items-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="flex cursor-pointer items-center gap-2 text-sm uppercase text-blue-500 hover:bg-slate-200 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400">
                            Filter <IoFilterOutline className="text-base" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-2" align="start">
                        <RadioGroup onValueChange={(e) => setQueryField(e)} value={queryField}>
                            <div className="flex flex-col gap-1">
                                {columns.map((e, i) => {
                                    if (e.fieldValue === '') return
                                    const id = v4()
                                    return (
                                        <label htmlFor={id} key={i} className="flex cursor-pointer gap-3 px-2 py-1 text-sm hover:bg-black/5">
                                            <RadioGroupItem id={id} value={e.fieldValue} key={i} />
                                            {e.name}
                                        </label>
                                    )
                                })}
                            </div>
                        </RadioGroup>
                    </PopoverContent>
                </Popover>
                <Input onChange={(e) => setInput(e.target.value)} placeholder="Search..." className="ml-auto w-fit select-none bg-white dark:bg-black" />
            </div>
            <Table
                options={{
                    search: {
                        query: input,
                        fieldToQuery: queryField,
                    },
                }}
                className="custom-scrollbar rounded-md border bg-white dark:border-white/10 dark:bg-black"
                columns={columns}
                rows={data}
            />
        </div>
    )
}
