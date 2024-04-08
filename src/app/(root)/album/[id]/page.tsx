import getAlbumsDetails from '@/actions/data/getAlbumDetails'
import SongsTable from './SongsTable'
import { Metadata } from 'next'

export async function generateMetadata({ params }: any) {
    const { err, album } = await getAlbumsDetails(params.id)
    if (err)
        return {
            title: 'Musify',
        } as Metadata
    else
        return {
            title: `Album - ${album?.name}`,
            description: album?.description,
            authors: album?.artists.all,
        } as Metadata
}

export default async function page({ params }: any) {
    const { err, album } = await getAlbumsDetails(params.id)
    if (err) return <div></div>
    return (
        <div className="overflow-hidden px-2 pt-0 sm:px-5 sm:pt-5">
            <div className="flex h-full flex-col overflow-hidden pb-5">
                <div className="mb-3 flex gap-2 sm:mb-10">
                    <div className="aspect-square w-20 shrink-0 overflow-hidden rounded-lg sm:w-28 md:w-32 lg:w-36">
                        <img
                            src={Array.isArray(album?.image) ? album?.image[album?.image.length - 1].url : ''}
                            alt=""
                        />
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                        <span className="mb-1 overflow-hidden truncate text-xs text-black/80 dark:text-white/80 sm:mt-2 sm:text-sm">
                            Album
                        </span>
                        <h1 className="overflow-hidden truncate text-lg font-bold dark:text-white sm:text-2xl md:text-3xl lg:text-4xl">
                            {album?.name}
                        </h1>
                        <span className="overflow-hidden truncate text-xs text-black/80 dark:text-white/80 sm:mt-2 sm:text-sm">
                            By {album?.artists.primary[0]?.name || album?.artists.all[0]?.name} |{' '}
                            {album?.songCount || 0} songs
                        </span>
                    </div>
                </div>
                <SongsTable songs={album?.songs} />
            </div>
        </div>
    )
}
