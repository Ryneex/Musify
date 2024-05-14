'use server'

import Playlist from '@/db/models/playlist.model'
import { redirect } from 'next/navigation'
import auth from '@/auth/auth'

export default async function addSongInPlaylist(playlistId: string, songId: string) {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error) redirect('/login')

    try {
        const playlist = await Playlist.findOne({ _id: playlistId, owner_id: res._id })
        if (!playlist) return { error: "Playlist couldn't be found" }
        if (playlist.songs.includes(songId)) return { error: 'This song is already added' }
        await Playlist.findByIdAndUpdate(playlistId, { songs: [...playlist.songs, songId] })
        return { success: 'Successfully added' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
