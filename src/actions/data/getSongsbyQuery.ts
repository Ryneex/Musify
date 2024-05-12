'use server'

import { Endpoints } from '@/constants/endpoints'
import FetchJiosaavn from '@/helpers/FetchJiosaavn'
import { formatSong } from '@/helpers/format.song'

export default async function getSongsbyQuery(query: string) {
    try {
        const { data } = await FetchJiosaavn({
            __call: Endpoints.search.songs,
            q: query,
            n: 100,
        })
        return { songs: data.results.map((e) => formatSong(e)) }
    } catch (error) {
        return { error: 'Something went wrong when fetching songs' }
    }
}
