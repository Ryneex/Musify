import dbconnect from '@/db/dbconnect'
import Playlist from '@/db/models/playlist.model'
import PlaylistsTable from './PlaylistsTable'

export default async function page() {
    try {
        await dbconnect()
        const playlist = await Playlist.find().populate('owner_id')
        const data = playlist.map((e, i) => ({ ...JSON.parse(JSON.stringify(e.toJSON())), id: i + 1 }))
        return (
            <div className="h-full w-full overflow-hidden px-5 py-3">
                <PlaylistsTable data={data} />
            </div>
        )
    } catch (error) {
        return <div className="flex h-full w-full items-center justify-center">Something went wrong</div>
    }
}
