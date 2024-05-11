'use client'

import playerStore from '@/store/player.store'
import Song from '@/types/song.types'
import { Duration } from 'luxon'
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
                    <span className={`truncate font-medium text-black/80 dark:font-normal dark:text-white/90 ${currentSong.id === song.id && '!text-blue-600 dark:!text-blue-400'}`}>{song.name}</span>
                </td>
                <td className="pr-2 text-end text-xs sm:pr-5 sm:text-sm">{duration}</td>
            </tr>
        </SongContext>
    )
}
