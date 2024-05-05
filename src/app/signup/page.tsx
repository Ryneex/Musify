'use client'

import Signup from '@/actions/authentication/signup'
import { Button } from '@/components/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/ui/form'
import { Input } from '@/components/shadcn/ui/input'
import signupScema from '@/schemas/signup'
import userStore from '@/store/user.store'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoAlertCircleOutline } from 'react-icons/io5'
import { MdNightsStay, MdOutlineLightMode } from 'react-icons/md'
import { z } from 'zod'

export default function Page() {
    const [error, setError] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof signupScema>>({
        resolver: zodResolver(signupScema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    })

    async function handleSubmit(values: z.infer<typeof signupScema>) {
        setError('')
        setLoading(true)
        const res = await Signup(values)
        if (res.error) {
            setError(res.error)
            setLoading(false)
            return
        }
        setError('')
        window.location.href = '/verify'
    }

    return (
        <div className="flex h-screen w-full items-center justify-center dark:bg-black">
            <div onClick={() => userStore.toggleTheme()} className="fixed right-2 top-2 aspect-square h-full max-h-9 cursor-pointer select-none rounded-full bg-black/5 text-2xl hover:bg-black/10 dark:bg-white/20 dark:hover:bg-white/30">
                <div className="flex h-full w-full items-center justify-center">
                    <MdNightsStay className="hidden dark:block" />
                    <MdOutlineLightMode className="block dark:hidden" />
                </div>
            </div>
            <div className="w-full space-y-5 rounded-xl p-5 dark:border-white/10 sm:max-w-[350px] sm:border">
                <h1 className="text-center text-xl font-bold dark:text-white">Sign-Up</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 ">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-3">
                                        <FormLabel className="!text-black dark:!text-white">Name</FormLabel>
                                        <FormMessage className="grow dark:text-red-400" />
                                    </div>
                                    <FormControl>
                                        <Input className="dark:text-slate-200" autoComplete="name" placeholder="John Doe" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-3">
                                        <FormLabel className="!text-black dark:!text-white">Email</FormLabel>
                                        <FormMessage className="grow dark:text-red-400" />
                                    </div>
                                    <FormControl>
                                        <Input className="dark:text-slate-200" autoComplete="email" placeholder="mail@example.com" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-3">
                                        <FormLabel className="!text-black dark:!text-white">Password</FormLabel>
                                        <FormMessage className="grow dark:text-red-400" />
                                    </div>
                                    <FormControl>
                                        <Input className="dark:text-slate-200" type="password" autoComplete="current-password" placeholder="Password" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {error && (
                            <div className="flex items-center gap-3 rounded-md bg-red-100 px-3 py-3 text-sm font-medium text-red-400 dark:bg-red-300/10">
                                <IoAlertCircleOutline className="text-base" /> {error}
                            </div>
                        )}
                        <Button disabled={loading} loading={loading} type="submit" className="w-full gap-2">
                            Create Account
                        </Button>
                    </form>
                </Form>
                <Link href="/login" className="mx-auto block w-fit text-sm font-medium text-blue-500 hover:underline dark:text-blue-400">
                    Already have an account?
                </Link>
            </div>
        </div>
    )
}
