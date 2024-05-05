'use client'

import { Button } from '@/components/button'
import { Input } from '@/components/shadcn/ui/input'
import { useRouter } from 'next-nprogress-bar'
import { useSearchParams } from 'next/navigation'
import { FormEvent, useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'

export default function Searchbar() {
    const searchParams = useSearchParams()
    const [input, setInput] = useState('')
    const router = useRouter()

    useMemo(() => {
        setInput(searchParams.get('query') || '')
    }, [searchParams])

    function Search(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (input.trim() === '') return
        router.push('/search?query=' + encodeURIComponent(input.trim()))
    }

    return (
        <form onSubmit={Search} className="relative flex w-full gap-2">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60 dark:text-white/60" />
            <Input className="max-w-sm rounded-lg pl-10 dark:text-slate-200" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search..." />
            <Button className="rounded-md" type="submit">
                Search
            </Button>
        </form>
    )
}
