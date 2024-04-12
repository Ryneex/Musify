'use client'

import { Toaster } from '@/components/shadcn/ui/sonner'
import { useEffect, useState } from 'react'
import { Button } from '@/components/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/shadcn/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import sendVerificationCode from '@/actions/user/authentication/sendVerificationCode'
import { Duration } from 'luxon'
import { toast } from 'sonner'
import verifyAccount from '@/actions/user/authentication/verifyAccount'
import { useRouter } from 'next-nprogress-bar'
import { MdNightsStay, MdOutlineLightMode } from 'react-icons/md'
import userStore from '@/store/user.store'

export default function VerifyCard({ email }: any) {
    const [loading, setLoading] = useState(false)
    const [sendNowClicked, setSendNowClicked] = useState(false)
    const [expiresAt, setExpiresAt] = useState(0)
    const [timer, setTimer] = useState(0)
    const [code, setCode] = useState('')
    const router = useRouter()

    async function sendCode() {
        const toastId = toast.loading('Sending Verification Code', { position: 'top-center' })
        setLoading(true)
        const res = await sendVerificationCode()
        setLoading(false)
        if (typeof res.err === 'string') {
            toast.error(res.err, { position: 'top-center', id: toastId })
            return
        }
        if (res?.success) {
            setExpiresAt(res.success)
            toast.success('Email has been sent. Please confirm it', { position: 'top-center', id: toastId })
            setTimer(res.success - Date.now())
        }
        if (res?.err) {
            setExpiresAt(res.err)
            toast.error('Please wait before sending another one', { position: 'top-center', id: toastId })
            setTimer(res.err - Date.now())
        }
    }

    async function handleVerify() {
        setLoading(true)
        const res = await verifyAccount(Number(code))
        if (res?.err) {
            setLoading(false)
            toast.error(res.err, { position: 'top-center' })
        }
        if (res.success) router.replace('/')
    }

    useEffect(() => {
        if (!expiresAt) return
        const interval = setInterval(() => {
            const timeLeft = expiresAt - Date.now()
            setTimer(() => (timeLeft > 0 ? timeLeft : 0))
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [expiresAt])

    return (
        <div className="flex h-screen items-center justify-center dark:bg-zinc-950 sm:bg-slate-50">
            <div
                onClick={() => userStore.toggleTheme()}
                className="fixed right-2 top-2 aspect-square h-full max-h-9 cursor-pointer select-none rounded-full bg-black/5 text-2xl hover:bg-black/10 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
            >
                <div className="flex h-full w-full items-center justify-center">
                    <MdNightsStay className="hidden dark:block" />
                    <MdOutlineLightMode className="block dark:hidden" />
                </div>
            </div>
            <div className="fixed">
                <Toaster />
            </div>
            <div className="w-full max-w-[640px] rounded-xl bg-white p-10 dark:bg-zinc-900 sm:shadow-md">
                {sendNowClicked ? (
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-sm dark:text-white">Enter your verification code</h2>
                        <div className="flex flex-col gap-1">
                            <InputOTP
                                value={code}
                                onChange={(e) => setCode(e)}
                                maxLength={6}
                                pattern={REGEXP_ONLY_DIGITS}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot className="h-12 w-12 dark:text-white sm:w-16 dark:border-white/20" index={0} />
                                    <InputOTPSlot className="h-12 w-12 dark:text-white sm:w-16 dark:border-white/20" index={1} />
                                    <InputOTPSlot className="h-12 w-12 dark:text-white sm:w-16 dark:border-white/20" index={2} />
                                    <InputOTPSlot className="h-12 w-12 dark:text-white sm:w-16 dark:border-white/20" index={3} />
                                    <InputOTPSlot className="h-12 w-12 dark:text-white sm:w-16 dark:border-white/20" index={4} />
                                    <InputOTPSlot className="h-12 w-12 dark:text-white sm:w-16 dark:border-white/20" index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <div className="flex justify-between text-xs">
                                <span
                                    className={`${!(timer == 0 || loading) && 'pointer-events-none opacity-70  dark:opacity-80'} dark:text-white`}
                                >
                                    Didn&apos;t receive it?
                                    <span
                                        onClick={sendCode}
                                        className="cursor-pointer text-blue-600 dark:text-blue-400"
                                    >
                                        {' '}
                                        Resend
                                    </span>
                                </span>
                                {timer !== 0 && (
                                    <span className="dark:text-white">
                                        Resend in {Duration.fromMillis(timer).toFormat('m:ss')}
                                    </span>
                                )}
                            </div>
                            <Button
                                disabled={loading || code.length !== 6}
                                loading={loading}
                                onClick={handleVerify}
                                className="mt-2"
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-5">
                        <h1 className="text-center text-xl font-bold text-black/80 dark:text-white/80">
                            Verify your Email Address
                        </h1>
                        <p className="text-center text-sm dark:text-white/80">
                            A verification email will be sent to{' '}
                            <span className="text-indigo-600 dark:text-indigo-400">{email}</span>. make sure to check
                            spam mail. Please click on verify now to proceed
                        </p>
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
                    </div>
                )}
            </div>
        </div>
    )
}
