'use server'

import User from '@/db/models/user.model'
import authenticateUser from '@/actions/session/authenticateUser'
import dbconnect from '@/db/dbconnect'
import { redirect } from 'next/navigation'

export default async function AddFavourite(songId: string) {
    const db = await dbconnect()
    if (db.err) return { err: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.err) redirect('/login')
    try {
        const user = await User.findOne({ _id: res.user_id })
        if (user.favourites.includes(songId)) return { err: 'This song is already added' }
        await User.findByIdAndUpdate(res.user_id, { favourites: [...user.favourites, songId] })
        return { success: 'Successfully added' }
    } catch (error) {
        return { err: 'Something went wrong' }
    }
}
