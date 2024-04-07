'use server'

import request from '@/config/ky.config'
import { Endpoints } from '@/constants/endpoints'
import { formatSong } from '@/helpers/format.song'

export default async function getSongsById(ids: string[] | [] = []) {
    if (!ids.length) return { err: 'ID is required' }
    try {
        const data: any = await request
            .get('https://www.jiosaavn.com/api.php', {
                searchParams: {
                    __call: Endpoints.songs.id,
                    pids: ids.join(','),
                },
            })
            .json()
        return { songs: data.songs.map((e: any) => formatSong(e)) }
    } catch (err) {
        return { err: 'Something went wrong' }
    }
}
