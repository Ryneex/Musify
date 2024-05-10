'use client'
import { useState } from 'react'
import SongsTableRow from './SongsTableRow'

type Props = {
    playlist: any
}

export default function SongsTable({ playlist }: Props) {
    const [songs, setSongs] = useState(playlist.songs)
    return (
        <div className="custom-scrollbar flex h-full w-full flex-col overflow-auto rounded-md border dark:border-white/10 dark:text-white/60">
            {!songs.length ? (
                <div className="flex h-full w-full items-center justify-center text-slate-500 dark:text-slate-300">You don&apos;t have any songs in this playlist</div>
            ) : (
                <table className="w-full table-fixed">
                    <thead className="sticky top-0 z-10 h-12 bg-white text-sm after:absolute after:bottom-0 after:h-[1px] after:w-full after:bg-black/[0.1] dark:bg-zinc-950 dark:after:bg-white/[0.1]">
                        <tr className="font-medium dark:text-white/80">
                            <td className="w-9 text-center sm:w-12">#</td>
                            <td>Title</td>
                            <td className="hidden sm:table-cell">Album</td>
                            <td className="hidden md:table-cell">Release Date</td>
                            <td className="w-20 pr-2 text-end sm:pr-5">Duration</td>
                        </tr>
                    </thead>
                    <tbody>
                        {songs.map((song: any, i: number) => (
                            <SongsTableRow key={i} i={i + 1} setSongs={setSongs} playlistId={playlist._id} song={song} songList={songs} />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
