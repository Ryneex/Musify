'use server'

import auth from '@/auth/auth'
import Playlist from '@/db/models/playlist.model'
import { redirect } from 'next/navigation'

export default async function createPlaylist(name: string) {
    if (name.length < 5 || name.length > 20) return { error: 'Invalid Name' }
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error) redirect('/login')

    try {
        const doesPlayListExists = await Playlist.find({ name, owner_id: res._id })
        if (doesPlayListExists.length) return { error: 'Playlist already exists' }
        const playlist = await Playlist.create({ name, owner_id: res._id })
        return { playlist: JSON.parse(JSON.stringify(playlist)) }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
