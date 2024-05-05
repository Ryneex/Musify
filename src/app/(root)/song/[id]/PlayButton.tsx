'use client'

import playerStore from '@/store/player.store'
import userStore from '@/store/user.store'
import Song from '@/types/song.types'
import { useMemo } from 'react'
import { BiHeart } from 'react-icons/bi'
import { FaHeart, FaRegCirclePlay } from 'react-icons/fa6'
import { useSnapshot } from 'valtio'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/shadcn/ui/dropdown-menu'
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi'
import { MdOutlineFileDownload } from 'react-icons/md'
import Link from 'next/link'
import playlistStore from '@/store/playlist.store'
import downloadSong from '@/helpers/downloadSong'
import { ResetIcon } from '@radix-ui/react-icons'
import { LuPauseCircle } from 'react-icons/lu'

export default function PlayButton({ song }: { song: Song }) {
    const { currentSong, isAudioPlaying } = useSnapshot(playerStore)
    const { user } = useSnapshot(userStore)
    const { playlists } = useSnapshot(playlistStore)
    const isFavourite = useMemo(() => user.favourites.includes(song.id), [user.favourites, song])
    return (
        <div className="flex items-center gap-3">
            <div
                onClick={() => {
                    playerStore.changeCurrentSong(song)
                    playerStore.SongList = []
                    playerStore.togglePlay()
                }}
                className="flex aspect-square w-8 cursor-pointer items-center justify-center overflow-hidden text-blue-400"
            >
                {currentSong.id === song.id && isAudioPlaying ? <LuPauseCircle className="size-8" /> : <FaRegCirclePlay className="size-[30px]" />}
            </div>
            <div
                className="cursor-pointer text-3xl text-pink-400"
                onClick={() => {
                    if (isFavourite) {
                        userStore.removeFavouriteSong(song.id)
                    } else {
                        userStore.addFavouriteSong(song)
                    }
                }}
            >
                {isFavourite ? <FaHeart className="fill-red-400" /> : <BiHeart className="fill-black/70 dark:fill-white" />}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="text-xl text-black/60 dark:text-white">
                    <div className="cursor-pointer">
                        <PiDotsThreeOutlineVerticalFill />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark:bg-zinc-900">
                    <DropdownMenuItem onClick={() => downloadSong({ name: song.name, song })}>
                        Download
                        <DropdownMenuShortcut>
                            <MdOutlineFileDownload className="text-lg" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0">
                        <Link className="h-full w-full px-2 py-1.5" href={`/album/${song.album.id}`}>
                            Go to Album
                        </Link>
                    </DropdownMenuItem>
                    {playlists && playlists?.length !== 0 && (
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <span className="pr-5">Add to Playlist</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="dark:bg-zinc-900">
                                {playlists?.map((e, i) => (
                                    <DropdownMenuItem
                                        key={i}
                                        onClick={() => {
                                            playlistStore.addSongInPlaylist(e._id, song.id)
                                        }}
                                    >
                                        {e.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        Cancel
                        <DropdownMenuShortcut>
                            <ResetIcon />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
