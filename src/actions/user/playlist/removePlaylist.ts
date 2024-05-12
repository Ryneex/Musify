'use server'

import auth from '@/auth/auth'
import Playlist from '@/db/models/playlist.model'
import { redirect } from 'next/navigation'

export default async function removePlaylist(playlistId: string) {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error) redirect('/login')

    try {
        await Playlist.findOneAndDelete({ _id: playlistId, owner_id: res._id })
        return { success: 'Playlist has been deleted' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
