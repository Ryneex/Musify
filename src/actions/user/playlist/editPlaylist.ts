'use server'

import Playlist from '@/db/models/playlist.model'
import { redirect } from 'next/navigation'
import auth from '@/auth/auth'

export default async function editPlaylist(playlistId: string, name: string) {
    if (name.length < 5 || name.length > 20) return { error: 'Invalid Name' }
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error) redirect('/login')

    try {
        await Playlist.findOneAndUpdate({ _id: playlistId, owner_id: res._id }, { name: name })
        return { success: 'Name Changed Successfully' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
