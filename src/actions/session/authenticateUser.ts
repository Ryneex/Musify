'use server'

import dbconnect from '@/db/dbconnect'
import { cookies } from 'next/headers'
import User from '@/db/models/user.model'
import jwt from 'jsonwebtoken'

export default async function authenticateUser() {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }

    try {
        const token = cookies().get('auth_token')
        const token_exists = cookies().get('token_exists')
        if (!token || !token_exists) return { error: "User isn't logged in" }

        const tokenData: any = jwt.verify(token?.value, process.env.JWT_SECRET as string)
        const user = await User.findById(tokenData.user_id)
        if (!user) return { error: 'User not found' }
        if (!user.verified)
            return {
                error: 'User is not verified',
                verified: false,
                user_id: user._id,
                email: user.email,
                verificationCode: user.verificationCode,
            }
        return { success: 'Authenticated Successfully', user_id: user._id, email: user.email }
    } catch (error: any) {
        return { error: 'Something went wrong' }
    }
}
