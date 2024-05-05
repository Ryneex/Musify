import getTrendingData from '@/actions/data/getTrendingData'
import SongsSlider from '@/components/SongsSlider/SongsSlider'

export default async function page() {
    const { songs, error } = await getTrendingData()
    if (error) return <h1 className="flex h-full items-center justify-center font-medium text-red-400">{error || 'Something went wrong and no reason was provided'}</h1>
    return (
        <div className="overflow-hidden pl-2 pt-2 sm:pl-5 sm:pt-5">
            <div className="custom-scrollbar h-full overflow-auto">
                <SongsSlider name="Top Songs" lockExpanded songs={songs} />
            </div>
        </div>
    )
}
