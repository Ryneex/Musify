'use client'

import { Toaster } from '@/components/shadcn/ui/sonner'
import { useEffect, useState } from 'react'
import { Button } from '@/components/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/shadcn/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import sendVerificationCode from '@/actions/authentication/verify/sendVerificationCode'
import { Duration } from 'luxon'
import { toast } from 'sonner'
import verifyAccount from '@/actions/authentication/verify/verifyAccount'
import { MdNightsStay, MdOutlineLightMode } from 'react-icons/md'
import userStore from '@/store/user.store'
import logout from '@/actions/user/logout'

export default function VerifyCard({ email }: any) {
    const [loading, setLoading] = useState(false)
    const [sendNowClicked, setSendNowClicked] = useState(false)
    const [timer, setTimer] = useState(0)
    const [code, setCode] = useState('')

    async function sendCode() {
        const toastId = toast.loading('Sending Verification Code', { position: 'top-center' })
        setLoading(true)
        const res = await sendVerificationCode()
        setLoading(false)
        if (typeof res.error === 'string') {
            return toast.error(res.error, { position: 'top-center', id: toastId })
        }
        if (res?.success) {
            toast.success('Email has been sent. Please confirm it', { position: 'top-center', id: toastId })
            setTimer(res.success - Date.now())
        }
        if (res?.error) {
            toast.error('Please wait before sending another one', { position: 'top-center', id: toastId })
            setTimer(res.error - Date.now())
        }
    }

    async function handleVerify() {
        setLoading(true)
        const res = await verifyAccount(Number(code))
        if (res?.error) {
            setLoading(false)
            toast.error(res.error, { position: 'top-center' })
        }
        window.location.href = '/'
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev - 1000 <= 0) return 0
                return prev - 1000
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex h-screen items-center justify-center dark:bg-zinc-950 sm:bg-slate-50">
            <div onClick={() => userStore.toggleTheme()} className="fixed right-2 top-2 aspect-square h-full max-h-9 cursor-pointer select-none rounded-full bg-black/5 text-2xl hover:bg-black/10 dark:bg-white/20 dark:hover:bg-white/30">
                <div className="flex h-full w-full items-center justify-center">
                    <MdNightsStay className="hidden dark:block" />
                    <MdOutlineLightMode className="block dark:hidden" />
                </div>
            </div>
            <div className="fixed">
                <Toaster />
            </div>
            <div className="mx-3 w-full max-w-2xl rounded-xl bg-white p-5 dark:bg-zinc-900 sm:p-10 sm:shadow-md">
                {sendNowClicked ? (
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-sm">Enter your verification code</h2>
                        <div className="flex flex-col gap-1">
                            <InputOTP value={code} onChange={(e) => setCode(e)} maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                                <InputOTPGroup>
                                    <InputOTPSlot className="h-12 w-12 dark:border-white/20 sm:w-16" index={0} />
                                    <InputOTPSlot className="h-12 w-12 dark:border-white/20 sm:w-16" index={1} />
                                    <InputOTPSlot className="h-12 w-12 dark:border-white/20 sm:w-16" index={2} />
                                    <InputOTPSlot className="h-12 w-12 dark:border-white/20 sm:w-16" index={3} />
                                    <InputOTPSlot className="h-12 w-12 dark:border-white/20 sm:w-16" index={4} />
                                    <InputOTPSlot className="h-12 w-12 dark:border-white/20 sm:w-16" index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <div className="flex justify-between text-xs">
                                <span className={`${!(timer == 0 || loading) && 'pointer-events-none opacity-70  dark:opacity-80'}`}>
                                    Didn&apos;t receive it?
                                    <span onClick={sendCode} className="cursor-pointer text-blue-600 dark:text-blue-400">
                                        {' '}
                                        Resend
                                    </span>
                                </span>
                                {timer !== 0 && <span className="dark:text-white">Resend in {Duration.fromMillis(timer).toFormat('m:ss')}</span>}
                            </div>
                            <Button disabled={loading || code.length !== 6} loading={loading} onClick={handleVerify} className="mt-2">
                                Submit
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-5">
                        <h1 className="text-center text-xl font-bold text-black/80 dark:text-white/80">Verify your Email Address</h1>
                        <p className="text-center text-sm dark:text-white/80">
                            A verification email will be sent to <span className="text-blue-600 dark:text-blue-400">{email}</span>. make sure to check spam mail. Please click on verify now to proceed
                        </p>
                        <div className="w-full">
                            <Button
                                disabled={loading}
                                loading={loading}
                                onClick={() => {
                                    sendCode()
                                    setSendNowClicked(true)
                                }}
                                className="w-full"
                            >
                                Send Now
                            </Button>
                            <span onClick={async () => await logout()} className="cursor-pointer text-xs text-blue-600 hover:underline dark:text-blue-400">
                                Logout
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
