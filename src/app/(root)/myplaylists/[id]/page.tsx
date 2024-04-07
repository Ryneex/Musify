import SongsTable from './SongsTable'
import getPlaylistWithSong from '@/actions/user/playlist/getPlaylistWithSong'
import { redirect } from 'next/navigation'

export default async function page({ params }: any) {
    const { playlist, err } = await getPlaylistWithSong(params.id)
    if (err) redirect('/myplaylists')
    return (
        <div className="overflow-hidden px-2 pt-0 sm:px-5 sm:pt-5">
            <div className="flex h-full flex-col overflow-hidden pb-5">
                <div className="mb-3 flex shrink-0 flex-col justify-center overflow-hidden sm:mb-10">
                    <h1 className="overflow-hidden truncate text-lg font-bold dark:text-white sm:text-2xl md:text-3xl lg:text-4xl">
                        {playlist.name}
                    </h1>
                </div>
                <SongsTable playlist={playlist} />
            </div>
        </div>
    )
}
