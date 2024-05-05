import AlbumType from '@/types/album.types'
import { useRouter } from 'next-nprogress-bar'
import { memo } from 'react'

function Album({ album, expanded }: { album: AlbumType; expanded: boolean }) {
    const router = useRouter()
    return (
        <div key={album.id} className={`group relative flex w-28 ${expanded && '!w-full'} shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/10 p-2 backdrop-blur-lg transition duration-300 hover:bg-black/[0.08] dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] sm:w-32 sm:gap-1 md:w-36 md:p-3 lg:w-40 xl:w-44`} onClick={() => router.push(`/album/${album.id}`)}>
            <div className="relative w-full select-none overflow-hidden rounded-xl">
                <img className="aspect-square w-full object-cover" src={album.image[album.image.length - 1].url || ''} alt={album?.name} />
            </div>
            <span className="truncate px-1 pt-1 text-sm text-black/90 dark:text-white/90 sm:pt-3">{album.name}</span>
            {album.artists.primary.length !== 0 && <span className="truncate pl-1 text-xs text-black/70 dark:text-white/70">By {album.artists.primary[0]?.name || album.artists.all[0]?.name}</span>}
        </div>
    )
}

export default memo(Album)
