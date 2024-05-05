'use client'
import Link from 'next/link'
import { IoMusicalNotes } from 'react-icons/io5'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/shadcn/ui/dropdown-menu'
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi'
import { ResetIcon } from '@radix-ui/react-icons'
import { BiEdit } from 'react-icons/bi'
import { useState } from 'react'
import { LuTrash } from 'react-icons/lu'
import playlistStore from '@/store/playlist.store'

export default function PlaylistCard({ playlist, setEditFormPlaylistId, setIsEditFormOpen, setEditFormName }: any) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    return (
        <Link href={`/myplaylists/${playlist._id}`} className="relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/10 p-2 backdrop-blur-lg transition duration-300 hover:bg-black/[0.08] dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] sm:gap-1 md:p-3">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl">
                <IoMusicalNotes className="text-6xl text-black/30 dark:text-white/30" />
            </div>
            <DropdownMenu open={isDropdownOpen} onOpenChange={(e) => setIsDropdownOpen(e)}>
                <DropdownMenuTrigger asChild>
                    <div className="absolute right-2 top-3 text-black/70 dark:text-white/80">
                        <PiDotsThreeOutlineVerticalFill />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark:bg-zinc-900">
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.preventDefault()
                            setEditFormPlaylistId(playlist._id)
                            setEditFormName(playlist.name)
                            setIsEditFormOpen(true)
                            setIsDropdownOpen(false)
                        }}
                    >
                        Edit Name
                        <DropdownMenuShortcut>
                            <BiEdit />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="justify-between text-red-500 hover:!text-red-500 dark:text-red-400 dark:hover:!text-red-400"
                        onClick={(e) => {
                            e.preventDefault()
                            setIsDropdownOpen(false)
                            playlistStore.deletePlaylist(playlist._id)
                        }}
                    >
                        Delete
                        <DropdownMenuShortcut>
                            <LuTrash className="text-red-500 dark:text-red-400" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsDropdownOpen(false)}>
                        Cancel
                        <DropdownMenuShortcut>
                            <ResetIcon />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <span className="truncate px-1 pt-1 text-sm text-black/90 dark:text-white/90 sm:pt-3">{playlist.name}</span>
        </Link>
    )
}
