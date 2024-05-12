'use server'

import dbconnect from '@/db/dbconnect'
import verifyPasswordResetToken from './verifyPasswordResetToken'
import User from '@/db/models/user.model'
import argon from 'argon2'
import { z } from 'zod'
import auth from '@/auth/auth'

export default async function resetPassword({ token, password }: { [key: string]: string }) {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }

    const scema = z
        .string()
        .min(5, {
            message: 'At least 5 characters required',
        })
        .max(5000, {
            message: 'Maximum length is 5000 characters',
        })
    const result = scema.safeParse(password)
    if (!result.success) return { error: result.error.issues[0].message }

    try {
        const res = await verifyPasswordResetToken(token)
        if (res.error) return { error: res.error }
        const hash = await argon.hash(password)
        const user = await User.findOneAndUpdate({ 'passwordReset.token': token }, { password: hash })
        if (!user) return { error: 'Token has expired' }
        user?.set('passwordReset', undefined, { strict: false })
        await user?.save()
        await auth.createSession({ userId: user._id.toString(), expiresIn: 1000 * 60 * 60 * 24 * 30 })
        return { success: 'Password updated successfully' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
