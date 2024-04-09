'use client'

import { Button } from '@/components/button'
import playerStore from '@/store/player.store'
import userStore from '@/store/user.store'
import Song from '@/types/song.types'
import { useMemo } from 'react'
import { BiHeart } from 'react-icons/bi'
import { FaHeart } from 'react-icons/fa6'
import { useSnapshot } from 'valtio'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi'
import { MdOutlineFileDownload } from 'react-icons/md'
import Link from 'next/link'
import playlistStore from '@/store/playlist.store'
import downloadSong from '@/helpers/downloadSong'
import { ResetIcon } from '@radix-ui/react-icons'

export default function PlayButton({ song }: { song: Song }) {
    const { currentSong, Playing } = useSnapshot(playerStore)
    const { user } = useSnapshot(userStore)
    const { playlists } = useSnapshot(playlistStore)
    const isFavourite = useMemo(() => user.favourites.includes(song.id), [user.favourites, song])
    return (
        <div className="flex items-center gap-3">
            <Button
                onClick={() => {
                    playerStore.changeCurrentSong(song)
                    playerStore.SongList = []
                    playerStore.togglePlay()
                }}
                className="cursor-pointer rounded-full px-7"
            >
                {Playing && currentSong.id === song.id ? 'Pause' : 'Play'}
            </Button>
            <div
                className="cursor-pointer text-4xl"
                onClick={() => {
                    if (isFavourite) {
                        userStore.removeFavouriteSong(song.id)
                    } else {
                        userStore.addFavouriteSong(song)
                    }
                }}
            >
                {isFavourite ? <FaHeart className="fill-pink-400" /> : <BiHeart className="fill-white" />}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger className="text-black/60 text-xl dark:text-white">
                    <PiDotsThreeOutlineVerticalFill />
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
