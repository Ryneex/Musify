'use client'

import userStore from '@/store/user.store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { GoHome } from 'react-icons/go'
import { MdNightsStay, MdOutlineLightMode } from 'react-icons/md'

function toUpperCase(string: string) {
    const e = string?.split('')
    if (!e) return
    e[0] = e[0].toUpperCase()
    return e
}

export default function Nav() {
    const pathname = usePathname()

    return (
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-300 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-600/5">
            <h1 className="font-bold">{toUpperCase(pathname.split('/')[2]) || 'Home'}</h1>
            <div className="flex items-center gap-3 text-2xl">
                <div onClick={() => userStore.toggleTheme()} className="hidden aspect-square h-full max-h-9 cursor-pointer select-none items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/30 sm:flex">
                    <MdNightsStay className="hidden dark:block" />
                    <MdOutlineLightMode className="block dark:hidden" />
                </div>
                <Link href="/">
                    <GoHome />
                </Link>
            </div>
        </div>
    )
}
