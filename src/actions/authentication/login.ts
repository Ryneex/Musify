'use server'

import User from '@/db/models/user.model'
import dbconnect from '@/db/dbconnect'
import loginScema from '@/schemas/login'
import argon from 'argon2'
import createSession from '@/actions/session/createSession'

export default async function Login(values: any) {
    const db = await dbconnect()
    if (db.error) return { error: db.error }

    const validate = loginScema.safeParse(values)
    if (!validate.success) return { error: 'Invalid request' }
    try {
        const user = await User.findOne({ email: values.email })
        if (!user) return { error: 'Incorrect email or password' }
        const doesPassMatch = await argon.verify(user.password, values.password)
        if (!doesPassMatch) return { error: 'Incorrect email or password' }
        const res = await createSession(user._id)
        if (res.error) return { error: res.error }
        return { success: 'Successfully logged in' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
