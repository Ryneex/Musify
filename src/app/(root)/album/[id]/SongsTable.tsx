import Song from '@/types/song.types'
import SongsTableRow from './SongsTableRow'

type Props = {
    songs: Song[] | undefined
}

export default function SongsTable({ songs = [] }: Props) {
    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md border text-black dark:border-white/10 dark:text-white/60">
            <div className="flex h-12 shrink-0 items-center border-b text-sm font-medium dark:border-white/10 dark:text-white/80 sm:gap-2 ">
                <div className="w-9 shrink-0 text-center sm:w-12">#</div>
                <div className="basis-full">Title</div>
                <div className="w-24 shrink-0 pr-2 text-end sm:pr-5">Duration</div>
            </div>
            <div className="custom-scrollbar h-full overflow-auto">
                {!songs.length ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-500 dark:text-slate-300">
                        You don&apos;t have any favourite Song
                    </div>
                ) : (
                    <>
                        {songs.map((song, i) => (
                            <SongsTableRow key={i} i={i + 1} song={song} songList={songs} />
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}
