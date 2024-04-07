'use server'

import dbconnect from '@/db/dbconnect'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export default async function createSession(user_id: string) {
    const db = await dbconnect()
    if (db.err) return { err: 'Something went wrong' }

    try {
        const token = jwt.sign({ user_id }, process.env.JWT_SECRET as string, {
            expiresIn: 60 * 60 * 24,
        })
        cookies().set('auth_token', token, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
        })
        // It's used so that when user requests for logout, we can just remove this cookie, because  he can't login without it
        cookies().set('token_exists', 'true')
        return { success: 'Session created successfully' }
    } catch (err) {
        return { err: 'Something went wrong' }
    }
}
