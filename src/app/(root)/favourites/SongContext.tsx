'use client'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from '@/components/shadcn/ui/context-menu'
import downloadSong from '@/helpers/downloadSong'
import playlistStore from '@/store/playlist.store'
import userStore from '@/store/user.store'
import Song from '@/types/song.types'
import { ResetIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { ReactNode } from 'react'
import { LuTrash } from 'react-icons/lu'
import { MdOutlineFileDownload } from 'react-icons/md'
import { useSnapshot } from 'valtio'

export default function SongContext({ children, song }: { children: ReactNode; song: Song }) {
    const { playlists } = useSnapshot(playlistStore)
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className="dark:bg-zinc-900">
                <ContextMenuItem className="p-0">
                    <Link className="h-full w-full px-2 py-1.5" href={`http://localhost:3000/album/${song.album.id}`}>
                        Go to Album
                    </Link>
                </ContextMenuItem>
                {playlists?.length !== 0 && (
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            <span className="pr-5">Add to Playlist</span>
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className="dark:bg-zinc-900">
                            {playlists?.map((e, i) => (
                                <ContextMenuItem
                                    key={i}
                                    onClick={() => {
                                        playlistStore.addSongInPlaylist(e._id, song.id)
                                    }}
                                >
                                    {e.name}
                                </ContextMenuItem>
                            ))}
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                )}
                <ContextMenuItem onClick={() => downloadSong({ name: song.name, song })}>
                    Download
                    <ContextMenuShortcut>
                        <MdOutlineFileDownload className="text-lg" />
                    </ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                    onClick={() => userStore.removeFavouriteSong(song.id)}
                    className="justify-between text-red-500 hover:!text-red-500 dark:text-red-400 dark:hover:!text-red-400"
                >
                    Remove
                    <ContextMenuShortcut>
                        <LuTrash className="text-red-500 dark:text-red-400" />
                    </ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                    Cancel
                    <ContextMenuShortcut>
                        <ResetIcon />
                    </ContextMenuShortcut>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
