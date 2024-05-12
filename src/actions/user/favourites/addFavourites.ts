'use server'

import User from '@/db/models/user.model'
import { redirect } from 'next/navigation'
import auth from '@/auth/auth'

export default async function AddFavourite(songId: string) {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error) redirect('/login')

    try {
        if (res.favourites.includes(songId)) return { error: 'This song is already added' }
        await User.findByIdAndUpdate(res._id, { favourites: [...res.favourites, songId] })
        return { success: 'Successfully added' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
