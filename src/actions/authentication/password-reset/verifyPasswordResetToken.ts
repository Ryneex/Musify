'use server'

import dbconnect from '@/db/dbconnect'
import User from '@/db/models/user.model'

export default async function verifyPasswordResetToken(token: string) {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }

    try {
        const user = await User.findOne({ 'passwordReset.token': token })
        if (!user) return { error: 'Invalid token or expired' }
        if (Date.parse(String(user?.passwordReset?.expiresAt)) < Date.now()) {
            return { error: 'Invalid token or expired' }
        }
        return { success: 'Valid token' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
