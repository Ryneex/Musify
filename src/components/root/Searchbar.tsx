'use client'

import getSongsbyQuery from '@/actions/data/getSongsbyQuery'
import { Button } from '@/components/button'
import { Input } from '@/components/shadcn/ui/input'
import Song from '@/types/song.types'
import { useRouter } from 'next-nprogress-bar'
import { useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import throttle from 'lodash/throttle'
import playerStore from '@/store/player.store'
import { useSnapshot } from 'valtio'
import { LuPauseCircle } from 'react-icons/lu'
import { FaRegCirclePlay } from 'react-icons/fa6'

export default function Searchbar() {
    const searchParams = useSearchParams()
    const [input, setInput] = useState('')
    const router = useRouter()
    const [focus, setFocus] = useState(false)
    const [searchedSongs, setSearchedSongs] = useState<Song[] | null>(null)
    const form = useRef<HTMLFormElement>(null)
    const { currentSong, isAudioPlaying } = useSnapshot(playerStore)

    useMemo(() => {
        setInput(searchParams.get('query') || '')
        setFocus(false)
    }, [searchParams])

    function Search(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (input.trim() === '') return
        router.push('/search?query=' + encodeURIComponent(input.trim()))
    }

    async function searchSongs(input: string) {
        const data = await getSongsbyQuery(input, 5)
        if (data.error) return setSearchedSongs(null)
        setSearchedSongs(data.songs)
    }

    const setSongs = useRef(throttle(searchSongs, 2000))

    useEffect(() => {
        if (!input) return setSearchedSongs(null)
        setSongs.current(input)
    }, [input])

    function hideSongsSuggestion(e: MouseEvent) {
        !form.current?.contains(e.target as Node) && setFocus(false)
    }
    
    useEffect(() => {
        document.addEventListener('click', hideSongsSuggestion)
        return () => document.removeEventListener('click', hideSongsSuggestion)
    }, [])

    return (
        <form ref={form} onSubmit={Search} className="relative flex w-full gap-2">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60 dark:text-white/60" />
            <Input onClick={() => setFocus(true)} className="max-w-sm rounded-lg pl-10 focus-visible:ring-indigo-500 dark:text-slate-200 dark:focus-visible:ring-indigo-500" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search..." />
            <Button className="rounded-md" type="submit">
                Search
            </Button>
            {focus && searchedSongs?.length && (
                <div className="absolute top-[calc(100%+10px)] z-20 flex w-full max-w-4xl flex-col gap-2 rounded-md bg-slate-100 p-2 shadow-md ring-1 ring-indigo-500 dark:bg-zinc-900">
                    {searchedSongs.map((song, i) => (
                        <div
                            key={i}
                            className="flex shrink-0 cursor-pointer items-center gap-3 px-2 py-1 text-sm hover:bg-black/5 hover:dark:bg-white/10"
                            onClick={() => {
                                setFocus(false)
                                router.push(`/song/${song.id}`)
                            }}
                        >
                            <div className="size-8 overflow-hidden rounded-md">
                                <img className="h-full w-full object-cover" src={song.image[0].url} alt="" />
                            </div>
                            <div className="flex w-full flex-col truncate">
                                <span>{song.name}</span>
                                <span className="text-xs">{song.artists.primary[0]?.name || song.artists.all[0]?.name}</span>
                            </div>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation()
                                    playerStore.changeCurrentSong(song)
                                    playerStore.SongList = searchedSongs
                                    playerStore.togglePlay()
                                }}
                                className="flex aspect-square w-10 cursor-pointer items-center justify-center overflow-hidden text-blue-400"
                            >
                                {currentSong.id === song.id && isAudioPlaying ? <LuPauseCircle className="size-7" /> : <FaRegCirclePlay className="size-[25px]" />}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </form>
    )
}
