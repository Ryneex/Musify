'use server'

import User from '@/db/models/user.model'
import { redirect } from 'next/navigation'
import auth from '@/auth/auth'

export default async function RemoveFavourites(songId: string) {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error) redirect('/login')

    try {
        const favouriteList = res.favourites.filter((e: any) => !(e === songId))
        await User.findByIdAndUpdate(res._id, { favourites: favouriteList })
        return { success: 'Successfully removed' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
