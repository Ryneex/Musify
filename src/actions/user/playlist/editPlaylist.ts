'use server'

import dbconnect from '@/db/dbconnect'
import Playlist from '@/db/models/playlist.model'
import authenticateUser from '@/actions/session/authenticateUser'
import { redirect } from 'next/navigation'

export default async function editPlaylist(playlistId: string, name: string) {
    if (name.length < 5 || name.length > 20) return { error: 'Invalid Name' }
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.error) redirect('/login')

    try {
        await Playlist.findOneAndUpdate({ _id: playlistId, owner_id: res.user_id }, { name: name })
        return { success: 'Name Changed Successfully' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
