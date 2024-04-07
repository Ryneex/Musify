'use server'

import User from '@/db/models/user.model'
import dbconnect from '@/db/dbconnect'
import signupScema from '@/schemas/signup'
import argon from 'argon2'
import { z } from 'zod'
import createSession from '@/actions/session/createSession'

export default async function Signup(values: z.infer<typeof signupScema>) {
    const db = await dbconnect()
    if (db.err) return { err: db.err }

    const validate = signupScema.safeParse(values)
    if (!validate.success) return { err: 'Invalid request' }
    try {
        const hash = await argon.hash(values.password)
        const user = await User.create({ ...values, password: hash })
        const res = await createSession(user._id)
        if (res.err) return { err: res.err }
        return { success: 'Account created successfully' }
    } catch (err: any) {
        if (err.code === 11000) {
            return { err: 'Email already in use' }
        }
        return { err: 'Something went wrong' }
    }
}
