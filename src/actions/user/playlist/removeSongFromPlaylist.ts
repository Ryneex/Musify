'use server'

import authenticateUser from '@/actions/session/authenticateUser'
import dbconnect from '@/db/dbconnect'
import Playlist from '@/db/models/playlist.model'
import { redirect } from 'next/navigation'

export default async function removeSongFromPlaylist(playlistId: string, songId: string) {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.error) redirect('/login')

    try {
        const playlist = await Playlist.findOne({ _id: playlistId, owner_id: res.user_id })
        const songList = playlist.songs.filter((e: any) => e !== songId)
        await Playlist.findOneAndUpdate({ _id: playlistId, owner_id: res.user_id }, { songs: songList })
        return { success: 'Successfully removed' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
