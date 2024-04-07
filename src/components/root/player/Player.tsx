'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Slider } from '@/components/root/player/slider'
import { IoPlayOutline, IoShuffle } from 'react-icons/io5'
import { MdSkipNext, MdSkipPrevious, MdVolumeOff, MdVolumeUp } from 'react-icons/md'
import { IoIosPause } from 'react-icons/io'
import { Duration } from 'luxon'
import { useSnapshot } from 'valtio'
import player from '@/store/player.store'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn/ui/tooltip'

export default function Player() {
    const audioRef = useRef(null as unknown as HTMLAudioElement)
    const audio = audioRef.current
    const [sliderValue, setSliderValue] = useState(0)
    const [isPointerDown, setIsPointerDown] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const { currentSong, Playing, volume, shuffle } = useSnapshot(player)

    // Formats song Duration
    const duration = useMemo(() => {
        const time = Duration.fromObject({ second: Number(currentSong.duration) || 0 }).toFormat('mm:ss')
        return time
    }, [currentSong])

    // Formats currentTime
    const formattedCurrentTime = useMemo(() => {
        const time = Duration.fromObject({ second: currentTime }).toFormat('mm:ss')
        return time
    }, [currentTime])

    // Handles Playback
    useEffect(() => {
        if (!audio) return
        Playing && isPointerDown === false ? audio.play().catch(() => null) : audio.pause()
    }, [Playing, audio, isPointerDown, currentSong])

    // Resets currentTime , SliderValue and plays the song when currentSong changes
    useEffect(() => {
        if (!currentSong.downloadUrl) return
        setSliderValue(0)
        setCurrentTime(0)
        player.Playing = true
    }, [currentSong])

    // Syncs Slider position based on songs currentTime
    function updateSliderValue() {
        if (isPointerDown || !audio?.duration) return
        setSliderValue((audio.currentTime / audio.duration) * 100)
        setCurrentTime(audio.currentTime)
    }

    // Updates songs currentTime when slider value changes
    function updateCurrentTime([e]: any) {
        if (!audio?.duration) return
        setSliderValue(e)
        audio.currentTime = (e / 100) * audio.duration
        setCurrentTime(audio.currentTime)
    }

    //Volume controls
    useEffect(() => {
        if (audio?.volume === undefined) return
        audio.volume = volume
    }, [volume, audio])

    useEffect(() => {
        player.volume = Number(localStorage.getItem('volume') || 1)
    }, [])

    return (
        <div className="col-span-2 flex select-none items-center justify-center gap-2 border-t border-black/20 px-2 dark:border-white/20 md:px-5 lg:justify-between">
            {/* Hidden audio element */}
            <audio
                onTimeUpdate={updateSliderValue}
                ref={audioRef}
                src={
                    Array.isArray(currentSong.downloadUrl)
                        ? currentSong.downloadUrl[currentSong.downloadUrl.length - 1].url
                        : ''
                }
                onEnded={() => {
                    player.addToPlayedSong(currentSong.id)
                    player.songEnded()
                }}
                onError={() => {
                    audio?.load()
                    Playing && isPointerDown === false && audio.play().catch(() => null)
                }}
            ></audio>
            {/* Information About Current Song */}
            <div className="hidden basis-1/6 items-center gap-2 overflow-hidden lg:flex">
                <div className="aspect-square h-9 shrink-0 overflow-hidden rounded-md bg-gray-400">
                    <img
                        src={
                            Array.isArray(currentSong.image) ? currentSong.image[currentSong.image.length - 1].url : ''
                        }
                        alt=""
                    />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium text-black/90 dark:font-normal dark:text-white/90">
                        {currentSong.name || 'No Name'}
                    </span>
                    <span className="truncate text-xs text-black/80 dark:text-white/60">
                        {Array.isArray(currentSong?.artists?.primary) ? currentSong?.artists?.all[0]?.name : 'unknown'}
                    </span>
                </div>
            </div>
            {/* Main audio Player with controls */}
            <div className="flex max-w-lg basis-full flex-col gap-2 lg:max-w-xl lg:flex-row lg:gap-6 xl:max-w-2xl">
                {/* Controls */}
                <div className="flex justify-between">
                    {/* Playback controls */}
                    <div className="flex items-center gap-2 text-2xl text-black/90 dark:text-white/90 md:gap-3">
                        <MdSkipPrevious onClick={() => player.playPrevSong()} className="cursor-pointer" />
                        <div
                            className="flex aspect-square w-6 cursor-pointer items-center justify-center  overflow-hidden rounded-full text-[20px]"
                            onClick={() => currentSong.downloadUrl && player.togglePlay()}
                        >
                            {Playing ? <IoIosPause /> : <IoPlayOutline className="ml-1" />}
                        </div>
                        <MdSkipNext onClick={() => player.playNextSong()} className="cursor-pointer" />
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger onClick={(e) => e.preventDefault()}>
                                <IoShuffle
                                    onClick={() => player.toggleShuffle()}
                                    className={`cursor-pointer text-2xl ${shuffle && 'text-blue-600 dark:text-blue-400'}`}
                                />
                            </TooltipTrigger>
                            <TooltipContent onPointerDownOutside={(e) => e.preventDefault()} side="top">
                                Shuffle
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    {/* Volume control : hidden until 1024px */}
                    <div className="flex grow basis-1/6 items-center justify-end gap-2 text-black dark:text-white lg:hidden">
                        <div className="cursor-pointer text-2xl" onClick={() => player.toggleVolume()}>
                            {volume === 0 ? <MdVolumeOff /> : <MdVolumeUp />}
                        </div>
                        <Slider
                            className="w-20 sm:w-24"
                            onValueChange={([e]) => {
                                localStorage.setItem('volume', String(e))
                                player.volume = e
                            }}
                            value={[volume]}
                            max={1}
                            min={0}
                            step={0.01}
                        />
                    </div>
                </div>
                {/* Main audio Slider */}
                <div className="flex basis-full items-center gap-3">
                    <span className="text-xs text-black/90 dark:text-white/50">{formattedCurrentTime}</span>
                    <Slider
                        onPointerDown={(e) => e.button === 0 && setIsPointerDown(true)}
                        onPointerUp={(e) => e.button === 0 && setIsPointerDown(false)}
                        onValueChange={updateCurrentTime}
                        value={[sliderValue]}
                        max={100}
                        step={0.1}
                    />
                    <span className="text-xs text-black/90 dark:text-white/50">{duration}</span>
                </div>
            </div>
            {/* Volume control : visible until 1024px */}
            <div className="hidden basis-1/6 items-center justify-end gap-2 text-black dark:text-white lg:flex">
                <div className="cursor-pointer text-2xl" onClick={() => player.toggleVolume()}>
                    {volume === 0 ? <MdVolumeOff /> : <MdVolumeUp />}
                </div>
                <Slider
                    className="w-24"
                    onValueChange={([e]) => {
                        localStorage.setItem('volume', String(e))
                        player.volume = e
                    }}
                    value={[volume]}
                    max={1}
                    min={0}
                    step={0.01}
                />
            </div>
        </div>
    )
}
