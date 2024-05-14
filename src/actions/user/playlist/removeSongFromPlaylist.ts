'use server'

import auth from '@/auth/auth'
import Playlist from '@/db/models/playlist.model'
import { redirect } from 'next/navigation'

export default async function removeSongFromPlaylist(playlistId: string, songId: string) {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error) redirect('/login')

    try {
        const playlist = await Playlist.findOne({ _id: playlistId, owner_id: res._id })
        if (!playlist) return { error: "Playlist couldn't be found" }
        const songList = playlist.songs.filter((e: any) => e !== songId)
        await Playlist.findOneAndUpdate({ _id: playlistId, owner_id: res._id }, { songs: songList })
        return { success: 'Successfully removed' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
