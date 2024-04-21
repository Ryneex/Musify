'use server'

import User from '@/db/models/user.model'
import dbconnect from '@/db/dbconnect'
import signupScema from '@/schemas/signup'
import argon from 'argon2'
import { z } from 'zod'
import createSession from '@/actions/session/createSession'

export default async function Signup(values: z.infer<typeof signupScema>) {
    const db = await dbconnect()
    if (db.error) return { error: db.error }

    const validate = signupScema.safeParse(values)
    if (!validate.success) return { error: 'Invalid request' }
    try {
        const hash = await argon.hash(values.password)
        const user = await User.create({ ...values, password: hash })
        const res = await createSession(user._id)
        if (res.error) return { error: res.error }
        return { success: 'Account created successfully' }
    } catch (error: any) {
        if (error.code === 11000) {
            return { error: 'Email already in use' }
        }
        return { error: 'Something went wrong' }
    }
}
