'use client'

import { Toaster } from '@/components/shadcn/ui/sonner'
import { useState } from 'react'
import { Button } from '@/components/button'
import { Duration } from 'luxon'
import { toast } from 'sonner'
import { MdNightsStay, MdOutlineLightMode } from 'react-icons/md'
import userStore from '@/store/user.store'
import { Input } from '@/components/shadcn/ui/input'
import sendPasswordResetToken from '@/actions/authentication/password-reset/sendPasswordResetToken'
import { z } from 'zod'

export default function VerifyCard() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const verifyEmail = z.string().email()

    async function sendEmail() {
        const isEmail = verifyEmail.safeParse(email)
        if (!isEmail.success) {
            return toast.error('Invalid email address', { position: 'top-center' })
        }
        const toastId = toast.loading('Sending Recovery email', { position: 'top-center' })
        setLoading(true)
        const res = await sendPasswordResetToken(email)
        setLoading(false)
        if (typeof res.error === 'string') {
            return toast.error(res.error, { position: 'top-center', id: toastId })
        }
        if (res?.success) {
            toast.success(res.success, { position: 'top-center', id: toastId })
        }
        if (res?.error) {
            toast.error(
                `Please wait ${Duration.fromMillis(Date.parse(res.error.toString()) - Date.now()).toFormat('m:ss')} minute before sending another one`,
                { position: 'top-center', id: toastId }
            )
        }
    }

    return (
        <div className="flex h-screen items-center justify-center dark:bg-zinc-950 sm:bg-slate-50">
            <div
                onClick={() => userStore.toggleTheme()}
                className="fixed right-2 top-2 aspect-square h-full max-h-9 cursor-pointer select-none rounded-full bg-black/5 text-2xl hover:bg-black/10 dark:bg-white/20 dark:hover:bg-white/30"
            >
                <div className="flex h-full w-full items-center justify-center">
                    <MdNightsStay className="hidden dark:block" />
                    <MdOutlineLightMode className="block dark:hidden" />
                </div>
            </div>
            <div className="fixed">
                <Toaster />
            </div>
            <div className="w-full max-w-md rounded-xl bg-white p-10 dark:bg-zinc-900 sm:shadow-md">
                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-sm">Enter your email address</h2>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                        placeholder="john@example.com"
                    />
                    <Button loading={loading} onClick={sendEmail} className="mt-2 w-full">
                        Reset Password
                    </Button>
                </div>
            </div>
        </div>
    )
}
