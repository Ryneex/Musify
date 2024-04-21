'use server'

import dbconnect from '@/db/dbconnect'
import Playlist from '@/db/models/playlist.model'
import authenticateUser from '@/actions/session/authenticateUser'
import { redirect } from 'next/navigation'

export default async function removePlaylist(playlistId: string) {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.error) redirect('/login')

    try {
        await Playlist.findOneAndDelete({ _id: playlistId, owner_id: res.user_id })
        return { success: 'Playlist has been deleted' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
