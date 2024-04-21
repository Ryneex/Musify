'use server'

import getSongsById from '@/actions/data/getSongsById'
import dbconnect from '@/db/dbconnect'
import Playlist from '@/db/models/playlist.model'
import authenticateUser from '@/actions/session/authenticateUser'
import { redirect } from 'next/navigation'

export default async function getPlaylistWithSong(playlistId: string) {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.error) redirect('/login')

    try {
        const playlist = await Playlist.findOne({ _id: playlistId, owner_id: res.user_id })
        const songs = await getSongsById(playlist.songs)
        return { playlist: { ...JSON.parse(JSON.stringify(playlist)), songs: songs.error ? [] : songs.songs } }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
