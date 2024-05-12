'use server'

import { Endpoints } from '@/constants/endpoints'
import FetchJiosaavn from '@/helpers/FetchJiosaavn'
import { formatSong } from '@/helpers/format.song'

export default async function getSongsById(ids: string[] | [] = []) {
    if (!ids.length) return { error: 'ID is required' }
    try {
        const { data } = await FetchJiosaavn({
            __call: Endpoints.songs.id,
            pids: ids.join(','),
        })
        if (data.status == 'failure') return { error: 'Song not found' }
        return { songs: data.songs.map((e: any) => formatSong(e)) }
    } catch (error) {
        return { error: 'Something went wrong when fetching songs' }
    }
}
