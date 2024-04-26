'use client'

import playerStore from '@/store/player.store'
import Song from '@/types/song.types'
import { Duration } from 'luxon'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import { IoIosPause } from 'react-icons/io'
import { IoPlayOutline } from 'react-icons/io5'
import { useSnapshot } from 'valtio'
import SongContext from './SongContext'
type Props = {
    song: Song
    i: number
    songList: Song[]
}
export default function SongsTableRow({ song, i, songList = [] }: Props) {
    const { currentSong, isAudioPlaying } = useSnapshot(playerStore)
    const [isMouseOver, setIsMouseOver] = useState(false)
    const duration = useMemo(() => {
        const time = Duration.fromObject({ second: Number(song?.duration) || 0 }).toFormat('mm:ss')
        return time
    }, [song])
    return (
        <SongContext song={song}>
            <div
                className="flex h-14 shrink-0 cursor-pointer select-none items-center border-b text-sm hover:bg-gray-700/5 dark:border-white/10 dark:hover:bg-white/5 sm:gap-2"
                key={song.id}
                onPointerEnter={() => setIsMouseOver(true)}
                onPointerLeave={() => setIsMouseOver(false)}
                onClick={(e: any) => {
                    if (e.target.localName === 'a') return
                    playerStore.changeCurrentSong(song)
                    playerStore.SongList = songList
                }}
            >
                <div className="flex w-9 shrink-0 items-center justify-center text-black/70 dark:text-white/60 sm:w-12">
                    {currentSong.id === song.id || isMouseOver ? (
                        <div
                            className={`flex cursor-pointer select-none items-center justify-center ${currentSong.id === song.id && '!text-blue-600 dark:!text-blue-400'}`}
                            onClick={() => {
                                playerStore.togglePlay()
                            }}
                        >
                            {isAudioPlaying && currentSong.id === song.id ? (
                                <IoIosPause className="text-[20px]" />
                            ) : (
                                <IoPlayOutline className="text-[20px]" />
                            )}
                        </div>
                    ) : (
                        <span className="text-xs sm:text-sm">{i}</span>
                    )}
                </div>
                <div className="flex h-full basis-full items-center gap-2 overflow-hidden leading-[15px] sm:basis-1/2">
                    <div className="aspect-square h-9 shrink-0 overflow-hidden rounded-md">
                        <img
                            className="h-full w-full object-cover"
                            loading="lazy"
                            src={song.image[song.image.length - 1].url}
                            alt={song.name}
                        />
                    </div>
                    <div className="flex flex-col gap-[2px] overflow-hidden">
                        <span
                            className={`truncate font-medium text-black/80 dark:font-normal dark:text-white/90 ${currentSong.id === song.id && '!text-blue-600 dark:!text-blue-400'}`}
                        >
                            {song.name}
                        </span>
                        <span className="truncate text-xs opacity-90 dark:font-light">
                            {song.artists.primary[0]?.name || song.artists.all[0]?.name}
                        </span>
                    </div>
                </div>
                <div className="hidden basis-1/3 overflow-hidden sm:flex">
                    <Link href={`/album/${song.album.id}`} className="truncate text-xs hover:underline">
                        {song.album.name}
                    </Link>
                </div>
                <div className="hidden basis-1/4 text-xs md:block">{song.releaseDate}</div>
                <div className="w-16 shrink-0 pr-2 text-end text-xs text-black/80 dark:text-white/60 sm:w-24 sm:pr-5 sm:text-sm">
                    {duration}
                </div>
            </div>
        </SongContext>
    )
}
