'use server'

import dbconnect from '@/db/dbconnect'
import Playlist from '@/db/models/playlist.model'
import authenticateUser from '@/actions/session/authenticateUser'
import { redirect } from 'next/navigation'

export default async function getAllPlaylist() {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.error) redirect('/login')

    try {
        const playlists = await Playlist.find({ owner_id: res.user_id })
        return { playlists: JSON.parse(JSON.stringify(playlists)) }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
