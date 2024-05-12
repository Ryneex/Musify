'use server'

import dbconnect from '@/db/dbconnect'
import User from '@/db/models/user.model'
import auth from '@/auth/auth'
import { redirect } from 'next/navigation'

export default async function verifyAccount(code: number) {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }
    const res = await auth.getCurrentUser()
    if (res.verified === true) return redirect('/')
    try {
        if (res.verificationCode.value === code && res.verificationCode?.expiresAt > Date.now()) {
            await User.findByIdAndUpdate(res._id, { verified: true, $unset: { verificationCode: true } }, { strict: false })
            return { success: 'Verification successful' }
        } else return { error: 'Invalid verification code' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
