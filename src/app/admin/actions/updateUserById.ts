'use server'

import auth from '@/auth/auth'
import User from '@/db/models/user.model'
import { redirect } from 'next/navigation'

export default async function updateUserById(id: string, updateObject: object) {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error || !res.isAdmin) redirect('/login')

    try {
        const res = await User.findByIdAndUpdate(id, updateObject)
        return { success: `Successfully updated ${res?.name}`, id: res?._id.toJSON() }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
