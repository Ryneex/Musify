'use server'

import dbconnect from '@/db/dbconnect'
import User from '@/db/models/user.model'
import authenticateUser from '@/actions/session/authenticateUser'
import nodemailer from 'nodemailer'

export default async function sendVerificationCode() {
    const db = await dbconnect()
    if (db.err) return { err: 'Something went wrong' }
    const res = await authenticateUser()
    if (res.err && res.verified !== false) return { err: res.err }

    try {
        if (res.verificationCode.expiresAt > Date.now()) {
            return {
                err: res.verificationCode.expiresAt,
            }
        }
        const code = Math.floor(Math.random() * 700000 + 200000)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'misajidcoc@gmail.com',
                pass: process.env.EMAIL_PASSWORD,
            },
        })
        await transporter.sendMail({
            from: 'musajidcoc@gmail.com',
            to: res.email,
            subject: 'Confirm your account',
            html: `${code}`,
        })
        const expiresAt = Date.now() + 1000 * 60 * 2
        await User.findOneAndUpdate({ email: res.email }, { verificationCode: { value: code, expiresAt } })
        return { success: expiresAt }
    } catch (error) {
        return { err: 'Something went wrong' }
    }
}
