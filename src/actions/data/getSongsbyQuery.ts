'use server'

import { Endpoints } from '@/constants/endpoints'
import FetchJiosaavn from '@/helpers/FetchJiosaavn'
import { formatSong } from '@/helpers/format.song'
import takeFirst from 'lodash/take'

export default async function getSongsbyQuery(query: string, limit = 100) {
    try {
        const { data } = await FetchJiosaavn({
            __call: Endpoints.search.songs,
            q: query,
            n: limit,
        })
        return {
            songs: takeFirst(
                data.results.map((e) => formatSong(e)),
                limit
            ) as any,
        }
    } catch (error) {
        return { error: 'Something went wrong when fetching songs' }
    }
}
