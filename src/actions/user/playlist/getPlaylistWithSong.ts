'use server'

import getSongsById from '@/actions/data/getSongsById'
import dbconnect from '@/db/dbconnect'
import Playlist from '@/db/models/playlist.model'
import authenticateUser from '@/actions/session/authenticateUser'
import { redirect } from 'next/navigation'

export default async function getPlaylistWithSong(playlistId: string) {
    const db = await dbconnect()
    if (db.err) return { err: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.err) redirect('/login')

    try {
        const playlist = await Playlist.findOne({ _id: playlistId, owner_id: res.user_id })
        const songs = await getSongsById(playlist.songs)
        return { playlist: { ...JSON.parse(JSON.stringify(playlist)), songs: songs.err ? [] : songs.songs } }
    } catch (error) {
        return { err: 'Something went wrong' }
    }
}
