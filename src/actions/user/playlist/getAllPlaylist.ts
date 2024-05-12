'use server'

import auth from '@/auth/auth'
import Playlist from '@/db/models/playlist.model'
import { redirect } from 'next/navigation'

export default async function getAllPlaylist() {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error) redirect('/login')

    try {
        const playlists = await Playlist.find({ owner_id: res._id })
        return { playlists: JSON.parse(JSON.stringify(playlists)) }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
