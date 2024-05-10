import Song from '@/types/song.types'
import SongsTableRow from './SongsTableRow'
import Loader from '@/components/spinner/loader'

type Props = {
    songs: Song[] | null
}

export default function SongsTable({ songs }: Props) {
    return (
        <div className="custom-scrollbar flex h-full w-full flex-col overflow-auto rounded-md border dark:border-white/10 dark:text-white/60">
            {songs ? (
                <>
                    {!songs.length ? (
                        <div className="flex h-full w-full items-center justify-center text-slate-500 dark:text-slate-300">You don&apos;t have any favourite Song</div>
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
                                {songs.map((song, i) => (
                                    <SongsTableRow key={i} i={i + 1} song={song} songList={songs} />
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <Loader />
                </div>
            )}
        </div>
    )
}
