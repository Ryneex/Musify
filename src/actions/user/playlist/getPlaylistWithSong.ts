'use server'

import getSongsById from '@/actions/data/getSongsById'
import auth from '@/auth/auth'
import Playlist from '@/db/models/playlist.model'
import { redirect } from 'next/navigation'

export default async function getPlaylistWithSong(playlistId: string) {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error) redirect('/login')

    try {
        const playlist = await Playlist.findOne({ _id: playlistId, owner_id: res._id })
        if (!playlist) return { error: "Playlist couldn't be found" }
        const songs = await getSongsById(playlist.songs)
        return { playlist: { ...JSON.parse(JSON.stringify(playlist)), songs: songs.error ? [] : songs.songs } }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
