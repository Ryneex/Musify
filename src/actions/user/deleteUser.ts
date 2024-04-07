'use server'

import dbconnect from '@/db/dbconnect'
import Playlist from '@/db/models/playlist.model'
import User from '@/db/models/user.model'
import argon from 'argon2'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import authenticateUser from '@/actions/session/authenticateUser'

export default async function DeleteUser(password: string) {
    const db = await dbconnect()
    if (db.err) return { err: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.err) redirect('/login')

    try {
        const user = await User.findById(res.user_id)
        if (!user) return { err: 'User not found' }
        const doesPassMatch = await argon.verify(user.password, password)
        if (!doesPassMatch) return { err: 'Incorrect password' }
        await Playlist.deleteMany({ owner_id: res.user_id })
        await User.findByIdAndDelete(res.user_id)
        cookies().delete('auth_token')
        cookies().delete('token_exists')
        redirect('/login')
    } catch (err) {
        if (isRedirectError(err)) redirect('/login')
        return { err: 'Something went wrong' }
    }
}
