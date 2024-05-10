import playerStore from '@/store/player.store'
import userStore from '@/store/user.store'
import SongType from '@/types/song.types'
import { memo, useEffect, useMemo, useState } from 'react'
import { BiHeart } from 'react-icons/bi'
import { FaHeart, FaRegCirclePlay } from 'react-icons/fa6'
import { MdOutlineFileDownload, MdOutlinePauseCircle } from 'react-icons/md'
import { useSnapshot } from 'valtio'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/shadcn/ui/dropdown-menu'
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi'
import { ResetIcon } from '@radix-ui/react-icons'
import playlistStore from '@/store/playlist.store'
import downloadSong from '@/helpers/downloadSong'
import Link from 'next/link'

function Song({ song, songs, expanded }: { song: SongType; songs: SongType[]; expanded: boolean }) {
    const { currentSong, isAudioPlaying } = useSnapshot(playerStore)
    const { user } = useSnapshot(userStore)
    const { playlists } = useSnapshot(playlistStore)
    const isFavourite = useMemo(() => user.favourites.includes(song.id), [user.favourites, song])
    const [isMobile, setIsMobile] = useState(false)
    // prettier-ignore

    useEffect(() => {
        setIsMobile(/Mobile|iP(hone|od|ad)|Android|BlackBerrory|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(navigator.userAgent))
    }, [])

    return (
        <div key={song.id} className={`group relative flex w-28 ${expanded && '!w-full'} shrink-0 flex-col overflow-hidden rounded-2xl border border-black/10 p-2 backdrop-blur-lg transition duration-300 hover:bg-black/[0.08] dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] sm:w-32 sm:gap-1 md:w-36 md:p-3 lg:w-40 xl:w-44`}>
            <div className="relative w-full select-none overflow-hidden rounded-xl">
                <img className="aspect-square w-full object-cover" src={song.image[song.image.length - 1].url || ''} alt={song?.name} />
                <div
                    className={`absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center bg-black/70 opacity-0 transition duration-300 group-hover:opacity-100 ${currentSong.id === song.id && 'opacity-100'}`}
                    onClick={() => {
                        playerStore.changeCurrentSong(song)
                        playerStore.SongList = songs
                        playerStore.togglePlay()
                    }}
                >
                    <div className="text-3xl text-blue-400 transition duration-300 hover:scale-110 md:text-4xl">{currentSong.id === song.id && isAudioPlaying ? <MdOutlinePauseCircle /> : <FaRegCirclePlay />}</div>
                </div>
                <div className="absolute bottom-0 left-0 size-10 rounded-full bg-black blur-xl"></div>
                <div
                    className={`absolute bottom-2 left-2 cursor-pointer text-lg ${isMobile ? 'opacity-100' : 'opacity-0'} transition duration-300 group-hover:opacity-100 sm:text-xl md:text-2xl`}
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
            </div>
            <Link href={`song/${song.id}`} className="truncate px-1 pt-1 text-sm text-black/90 dark:text-white/90 sm:pt-3">
                {song.name}
            </Link>
            <span className="truncate pl-1 text-xs text-black/70 dark:text-white/70">By {song.artists.primary[0]?.name || song.artists.all[0]?.name}</span>
            <DropdownMenu>
                <DropdownMenuTrigger className="absolute bottom-3 right-2 text-black/60 dark:text-white">
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
                        <Link className="h-full w-full px-2 py-1.5" href={`/song/${song.id}`}>
                            View Details
                        </Link>
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

export default memo(Song)
