'use server'

import dbconnect from '@/db/dbconnect'
import Playlist from '@/db/models/playlist.model'
import authenticateUser from '@/actions/session/authenticateUser'
import { redirect } from 'next/navigation'

export default async function addSongInPlaylist(playlistId: string, songId: string) {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.error) redirect('/login')
    try {
        const playlist = await Playlist.findOne({ _id: playlistId, owner_id: res.user_id })
        if (playlist.songs.includes(songId)) return { error: 'This song is already added' }
        await Playlist.findByIdAndUpdate(playlistId, { songs: [...playlist.songs, songId] })
        return { success: 'Successfully added' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
