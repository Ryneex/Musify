'use server'

import dbconnect from '@/db/dbconnect'
import User from '@/db/models/user.model'
import authenticateUser from '@/actions/session/authenticateUser'

export default async function verifyAccount(code: number) {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.verified !== false) return { error: res.error }

    try {
        if (res.verificationCode.value === code && res.verificationCode?.expiresAt > Date.now()) {
            await User.findByIdAndUpdate(res.user_id, { verified: true, verificationCode: {} })
            return { success: 'Verification successful' }
        } else return { error: 'Invalid verification code' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
