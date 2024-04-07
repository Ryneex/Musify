'use client'
import { useState } from 'react'
import SongsTableRow from './SongsTableRow'

type Props = {
    playlist: any
}

export default function SongsTable({ playlist }: Props) {
    const [songs, setSongs] = useState(playlist.songs)
    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md border text-black dark:border-white/10 dark:text-white/60">
            <div className="flex h-12 shrink-0 items-center border-b text-sm font-medium dark:border-white/10 dark:text-white/80 sm:gap-2 ">
                <div className="w-9 shrink-0 text-center sm:w-12">#</div>
                <div className="basis-full sm:basis-1/2">Title</div>
                <div className="hidden basis-1/3 sm:block">Album</div>
                <div className="hidden basis-1/4 md:block">Release Date</div>
                <div className="w-24 shrink-0 pr-2 text-end sm:pr-5">Duration</div>
            </div>
            <div className="custom-scrollbar h-full overflow-auto">
                {!songs.length ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-500 dark:text-slate-300">
                        You don&apos;t have any songs in this playlist
                    </div>
                ) : (
                    <>
                        {songs.map((song: any, i: number) => (
                            <SongsTableRow
                                key={i}
                                i={i + 1}
                                setSongs={setSongs}
                                playlistId={playlist._id}
                                song={song}
                                songList={songs}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}
