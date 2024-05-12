'use server'

import { Endpoints } from '@/constants/endpoints'
import FetchJiosaavn from '@/helpers/FetchJiosaavn'
import { formatAlbum } from '@/helpers/format.album'

export default async function getAlbumsDetails(id: string) {
    try {
        const { data } = await FetchJiosaavn({
            __call: Endpoints.albums.id,
            albumid: id,
            limit: 1000,
        })
        return { album: formatAlbum(data) }
    } catch (error) {
        return { error: 'Something went wrong when fetching Album details' }
    }
}
