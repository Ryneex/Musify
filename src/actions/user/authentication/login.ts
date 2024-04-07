'use server'

import User from '@/db/models/user.model'
import dbconnect from '@/db/dbconnect'
import loginScema from '@/schemas/login'
import argon from 'argon2'
import createSession from '@/actions/session/createSession'

export default async function Login(values: any) {
    const db = await dbconnect()
    if (db.err) return { err: db.err }

    const validate = loginScema.safeParse(values)
    if (!validate.success) return { err: 'Invalid request' }
    try {
        const user = await User.findOne({ email: values.email })
        if (!user) return { err: 'Incorrect email or password' }
        const doesPassMatch = await argon.verify(user.password, values.password)
        if (!doesPassMatch) return { err: 'Incorrect email or password' }
        const res = await createSession(user._id)
        if (res.err) return { err: res.err }
        return { success: 'Successfully logged in' }
    } catch (err) {
        return { err: 'Something went wrong' }
    }
}
