'use client'

import userStore from '@/store/user.store'
import React from 'react'
import { MdNightsStay, MdOutlineLightMode } from 'react-icons/md'

export default function ForgotPassword() {
    return (
        <div>
            <div
                onClick={() => userStore.toggleTheme()}
                className="fixed right-2 top-2 aspect-square h-full max-h-9 cursor-pointer select-none rounded-full bg-black/5 text-2xl hover:bg-black/10 dark:bg-white/20 dark:hover:bg-white/30"
            >
                <div className="flex h-full w-full items-center justify-center">
                    <MdNightsStay className="hidden dark:block" />
                    <MdOutlineLightMode className="block dark:hidden" />
                </div>
            </div>
        </div>
    )
}
