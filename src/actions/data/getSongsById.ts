'use server'

import request from '@/config/ky.config'
import { Endpoints } from '@/constants/endpoints'
import { formatSong } from '@/helpers/format.song'

export default async function getSongsById(ids: string[] | [] = []) {
    if (!ids.length) return { error: 'ID is required' }
    try {
        const data: any = await request
            .get('https://www.jiosaavn.com/api.php', {
                searchParams: {
                    __call: Endpoints.songs.id,
                    pids: ids.join(','),
                },
            })
            .json()
        if (data.status == 'failure') return { error: 'Song not found' }
        return { songs: data.songs.map((e: any) => formatSong(e)) }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
