'use server'

import dbconnect from '@/db/dbconnect'
import User from '@/db/models/user.model'
import authenticateUser from '@/actions/session/authenticateUser'
import { redirect } from 'next/navigation'

export default async function getUserInfo() {
    const db = await dbconnect()
    if (db.err) return { err: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.err) redirect('/login')

    try {
        const user = await User.findById(res.user_id)
        if (!user) return { err: 'User not found' }
        const { name, email, favourites } = user
        return { user: { name, email, favourites } }
    } catch (err) {
        return { err: 'Something went wrong' }
    }
}
