import getSongsById from '@/actions/data/getSongsById'
import Song from '@/types/song.types'
import PlayButton from './PlayButton'

export default async function page({ params }: any) {
    const { error, songs } = await getSongsById([params.id])
    if (error) return <div className="flex h-full w-full items-center justify-center text-black/70 dark:text-white/70">{error}</div>

    const song: Song = songs[0]
    return (
        <div className="overflow-auto px-2 pt-0 sm:px-5 sm:pt-5">
            <div className="mb-3 flex flex-col gap-5 xs:flex-row sm:mb-10">
                <div className="aspect-video w-full shrink-0 overflow-hidden rounded-lg xs:aspect-square xs:w-32 sm:w-44 md:w-52 lg:w-60">
                    <img className="h-full w-full object-cover" src={Array.isArray(song?.image) ? song?.image[song?.image.length - 1].url : ''} alt={song.name} />
                </div>
                <div className="flex flex-col justify-center gap-1 overflow-hidden">
                    <h1 className="overflow-hidden truncate text-lg font-bold sm:text-2xl md:text-3xl lg:text-4xl">{song?.name}</h1>
                    <span className="overflow-hidden truncate text-xs text-black/80 dark:text-white/80 sm:text-sm">Artist : {song?.artists.primary[0]?.name || song?.artists.all[0]?.name}</span>
                    <span className="overflow-hidden truncate text-xs text-black/80 dark:text-white/80 sm:text-sm">Release Date : {song.releaseDate}</span>
                    <span className="overflow-hidden truncate text-xs text-black/80 dark:text-white/80 sm:text-sm">Played : {song.playCount} times</span>
                    <span className="overflow-hidden truncate text-xs text-black/80 dark:text-white/80 sm:text-sm">Language : {song.language}</span>
                    <div className="mt-4">
                        <PlayButton song={song} />
                    </div>
                </div>
            </div>
        </div>
    )
}
