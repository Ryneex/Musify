import SongsSlider from '@/components/SongsSlider/SongsSlider'
import getAlbumsbyQuery from '@/actions/data/getAlbumsbyQuery'
import getSongsbyQuery from '@/actions/data/getSongsbyQuery'
import AlbumSlider from '@/components/AlbumSlider/AlbumSlider'

export default async function page({ searchParams }: any) {
    if (!searchParams.query) return <h1 className="flex h-full items-center justify-center font-medium text-red-400">Query is required</h1>
    const songsReq = getSongsbyQuery(searchParams.query)
    const albumsReq = getAlbumsbyQuery(searchParams.query)
    const res = await Promise.all([songsReq, albumsReq])
    if (res[0].error && res[1].error) return <h1 className="flex h-full items-center justify-center font-medium text-red-400">Something went wrong and no reason was provided</h1>

    return (
        <div className="overflow-hidden pl-3 pt-5 sm:pl-5">
            <div className="custom-scrollbar h-full overflow-auto">
                <SongsSlider name="Songs" songs={res[0].songs} />
                <AlbumSlider albums={res[1].albums} name="Albums" />
            </div>
        </div>
    )
}
