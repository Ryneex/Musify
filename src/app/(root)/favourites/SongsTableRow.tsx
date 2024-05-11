'use client'

import playerStore from '@/store/player.store'
import Song from '@/types/song.types'
import { Duration } from 'luxon'
import Link from 'next/link'
import { useMemo, useState } from 'react'
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
            <tr
                className="h-14 cursor-pointer select-none border-b text-sm hover:bg-gray-700/5 dark:border-white/10 dark:hover:bg-white/5 sm:gap-2"
                key={song.id}
                onPointerEnter={() => setIsMouseOver(true)}
                onPointerLeave={() => setIsMouseOver(false)}
                onClick={(e: any) => {
                    if (e.target.localName === 'a') return
                    playerStore.changeCurrentSong(song)
                    playerStore.SongList = songList
                }}
            >
                <td className="text-center text-black/70 dark:text-white/60">
                    {currentSong.id === song.id || isMouseOver ? (
                        <div
                            className={`flex cursor-pointer select-none items-center justify-center ${currentSong.id === song.id && '!text-blue-600 dark:!text-blue-400'}`}
                            onClick={() => {
                                playerStore.togglePlay()
                            }}
                        >
                            {isAudioPlaying && currentSong.id === song.id ? (
                                isMouseOver ? (
                                    <IoIosPause className="text-[20px]" />
                                ) : (
                                    <div className="p-[15px]">
                                        <img className="h-full w-full" src="/sound_wave.gif" alt="" />
                                    </div>
                                )
                            ) : (
                                <IoPlayOutline className="text-[20px]" />
                            )}
                        </div>
                    ) : (
                        <span className="text-xs sm:text-sm">{i}</span>
                    )}
                </td>
                <td>
                    <div className="flex h-full items-center gap-2 leading-[15px]">
                        <div className="aspect-square h-9 shrink-0 overflow-hidden rounded-md">
                            <img className="h-full w-full object-cover" loading="lazy" src={song.image[song.image.length - 1].url} alt={song.name} />
                        </div>
                        <div className="flex flex-col gap-[2px] overflow-hidden">
                            <span className={`truncate font-medium text-black/80 dark:font-normal dark:text-white/90 ${currentSong.id === song.id && '!text-blue-600 dark:!text-blue-400'}`}>{song.name}</span>
                            <span className="truncate text-xs opacity-90 dark:font-light">{song.artists.primary[0]?.name || song.artists.all[0]?.name}</span>
                        </div>
                    </div>
                </td>
                <td className="hidden overflow-hidden sm:table-cell">
                    <Link href={`/album/${song.album.id}`} className="block w-fit truncate text-xs hover:underline">
                        {song.album.name}
                    </Link>
                </td>
                <td className="hidden text-xs md:table-cell">{song.releaseDate}</td>
                <td className="pr-2 text-end text-xs sm:pr-5 sm:text-sm">{duration}</td>
            </tr>
        </SongContext>
    )
}
