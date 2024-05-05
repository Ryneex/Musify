'use client'

import resetPassword from '@/actions/authentication/password-reset/resetPassword'
import { Button } from '@/components/button'
import { Input } from '@/components/shadcn/ui/input'
import userStore from '@/store/user.store'
import { useState } from 'react'
import { MdNightsStay, MdOutlineLightMode } from 'react-icons/md'
import { z } from 'zod'

export default function ResetPasswordCard({ token }: { token: string }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const scema = z
        .string()
        .min(5, {
            message: 'At least 5 characters required',
        })
        .max(5000, {
            message: 'Maximum length is 5000 characters',
        })

    async function handleSubmit() {
        setLoading(true)
        const result = scema.safeParse(password)
        if (!result.success) {
            return setError(result.error.issues[0].message)
        }
        const res = await resetPassword({ token, password })
        if (res.error) {
            setLoading(false)
            return setError(res.error)
        }
        window.location.href = '/'
    }

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div onClick={() => userStore.toggleTheme()} className="fixed right-2 top-2 aspect-square h-full max-h-9 cursor-pointer select-none rounded-full bg-black/5 text-2xl hover:bg-black/10 dark:bg-white/20 dark:hover:bg-white/30">
                <div className="flex h-full w-full items-center justify-center">
                    <MdNightsStay className="hidden dark:block" />
                    <MdOutlineLightMode className="block dark:hidden" />
                </div>
            </div>
            <div className="flex w-full max-w-xs flex-col gap-3">
                <span className="text-sm">Enter your new password</span>
                <div>
                    <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="*******" />
                    <span className="text-xs font-medium text-red-500 dark:text-red-300">{error}</span>
                </div>
                <Button onClick={handleSubmit} loading={loading}>
                    Change Password
                </Button>
            </div>
        </div>
    )
}
