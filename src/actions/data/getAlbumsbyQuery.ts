'use server'

import { Endpoints } from '@/constants/endpoints'
import FetchJiosaavn from '@/helpers/FetchJiosaavn'
import { formatAlbum } from '@/helpers/format.album'

export default async function getAlbumsbyQuery(query: string) {
    try {
        const { data } = await FetchJiosaavn({
            __call: Endpoints.search.albums,
            q: query,
            limit: 1000,
        })
        return { albums: data.results.map((e) => formatAlbum(e)) }
    } catch (error) {
        return { error: 'Something went wrong when fetching Albums' }
    }
}
