'use server'

import auth from '@/auth/auth'
import User from '@/db/models/user.model'
import { redirect } from 'next/navigation'

export default async function deleteUnverifiedUsers() {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error || !res.isAdmin) redirect('/login')

    try {
        await User.deleteMany({ verified: false })
        return { success: 'Successfully Deleted Unverified Users' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
