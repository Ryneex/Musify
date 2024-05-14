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
import callServerActionWithToast from '@/helpers/callServerActionWithToast'
import deleteUnverifiedUsers from '../actions/deleteUnverifiedUsers'
import { BsThreeDots } from 'react-icons/bs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/shadcn/ui/dropdown-menu'
import { FiTrash } from 'react-icons/fi'
import updateUserById from '../actions/updateUserById'
import deleteUserById from '../actions/deleteUserById'

export default function UsersTable({ data }: { data: any[] }) {
    const [input, setInput] = useState('')
    const [queryField, setQueryField] = useState('name')
    const [dataToShow, setDataToShow] = useState(data)
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
            name: 'Name',
            fieldValue: 'name',
            flex: 2,
            className: 'pl-5',
        },
        {
            name: 'Email',
            fieldValue: 'email',
            flex: 2,
        },
        {
            name: 'Verified',
            fieldValue: 'verified',
            flex: 2,
            searchValueFormatter(e) {
                return JSON.stringify(e)
            },
            render(row) {
                if (row.verified) return <span className={`rounded-full bg-green-500/20 px-3 text-green-600 dark:bg-green-500/20 dark:text-green-400`}>{JSON.stringify(row.verified)}</span>
                return <span className={`darkbg-green-500/10 rounded-full bg-red-500/20 px-3 text-red-600 dark:text-red-400`}>{JSON.stringify(row.verified)}</span>
            },
        },
        {
            name: 'Created At',
            fieldValue: 'createdAt',
            render(row) {
                return DateTime.fromMillis(Date.parse(row.createdAt)).toFormat('dd LLL yyyy')
            },
        },
        {
            name: 'Action',
            fieldValue: '',
            render(row) {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="cursor-pointer">
                                <BsThreeDots />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mr-5">
                            <DropdownMenuItem
                                onClick={async () => {
                                    const res = await callServerActionWithToast(updateUserById(row._id, { verified: !row.verified }))
                                    if (res.success) {
                                        setDataToShow((e) => {
                                            return e.map((e) => {
                                                if (e._id !== res.id) return e
                                                return { ...e, verified: !row.verified }
                                            })
                                        })
                                    }
                                }}
                            >
                                Manually {row.verified ? 'Unverify' : 'Verify'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={async () => {
                                    const res = await callServerActionWithToast(deleteUserById(row._id))
                                    if (res.success) {
                                        setDataToShow((e) => e.filter((e) => e._id !== res.id))
                                    }
                                }}
                                className="text-red-500 dark:text-red-400"
                            >
                                Delete
                                <DropdownMenuShortcut>
                                    <FiTrash className="text-base" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
            width: 50,
            className: 'justify-center',
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
                <Button
                    onClick={async () => {
                        await callServerActionWithToast(deleteUnverifiedUsers())
                    }}
                    variant="ghost"
                    className="flex cursor-pointer items-center gap-2 text-sm uppercase text-red-500 hover:bg-slate-200 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400"
                >
                    Delete Unverified Users <FiTrash className="text-base" />
                </Button>
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
                rows={dataToShow}
            />
        </div>
    )
}
