'use server'

import dbconnect from '@/db/dbconnect'
import Playlist from '@/db/models/playlist.model'
import authenticateUser from '@/actions/session/authenticateUser'
import { redirect } from 'next/navigation'

export default async function createPlaylist(name: string) {
    if (name.length < 5 || name.length > 20) return { error: 'Invalid Name' }
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.error) redirect('/login')

    try {
        const doesPlayListExists = await Playlist.find({ name, owner_id: res.user_id })
        if (doesPlayListExists.length) return { error: 'Playlist already exists' }
        const playlist = await Playlist.create({ name, owner_id: res.user_id })
        return { playlist: JSON.parse(JSON.stringify(playlist)) }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
