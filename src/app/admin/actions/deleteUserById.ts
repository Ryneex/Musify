'use server'

import auth from '@/auth/auth'
import Playlist from '@/db/models/playlist.model'
import User from '@/db/models/user.model'
import { redirect } from 'next/navigation'

export default async function deleteUserById(id: string) {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error || !res.isAdmin) redirect('/login')

    try {
        await auth.deleteSession({ _id: id })
        await Playlist.deleteMany({ owner_id: id })
        const user = await User.findByIdAndDelete(id)
        return { success: `Successfully Deleted ${user?.name}`, id: user?._id.toJSON() }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
