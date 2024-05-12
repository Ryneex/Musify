'use server'

import Playlist from '@/db/models/playlist.model'
import User from '@/db/models/user.model'
import argon from 'argon2'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import auth from '@/auth/auth'

export default async function DeleteUser(password: string) {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error) redirect('/login')

    try {
        const doesPassMatch = await argon.verify(res.password, password)
        if (!doesPassMatch) return { error: 'Incorrect password' }
        await auth.deleteCurrentUsersAllSessions()
        await Playlist.deleteMany({ owner_id: res._id })
        await User.findByIdAndDelete(res._id)
        cookies().delete('session_id')
        redirect('/login')
    } catch (error) {
        if (isRedirectError(error)) redirect('/login')
        return { error: 'Something went wrong' }
    }
}
