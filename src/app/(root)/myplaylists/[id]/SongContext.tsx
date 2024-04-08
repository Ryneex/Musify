'use client'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from '@/components/shadcn/ui/context-menu'
import downloadSong from '@/helpers/downloadSong'
import playlistStore from '@/store/playlist.store'
import Song from '@/types/song.types'
import { ResetIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { ReactNode } from 'react'
import { LuTrash } from 'react-icons/lu'
import { MdOutlineFileDownload } from 'react-icons/md'

export default function SongContext({
    children,
    song,
    playlistId,
    setSongs,
}: {
    children: ReactNode
    song: Song
    playlistId: string
    setSongs: any
}) {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem className="p-0">
                    <Link className="h-full w-full px-2 py-1.5" href={`/album/${song.album.id}`}>
                        Go to Album
                    </Link>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => downloadSong({ name: song.name, song })}>
                    Download
                    <ContextMenuShortcut>
                        <MdOutlineFileDownload className="text-lg" />
                    </ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                    onClick={async () => {
                        setSongs((prev: Song[]) => {
                            return prev.filter((e) => e.id !== song.id)
                        })
                        playlistStore.removeSongFromPlaylist(playlistId, song.id)
                    }}
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
