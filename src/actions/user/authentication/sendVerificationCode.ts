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
            from: 'misajidcoc@gmail.com',
            to: res.email,
            subject: 'Musify Verification Code',

            html: getHtml(code),
        })
        const expiresAt = Date.now() + 1000 * 60 * 2
        await User.findOneAndUpdate({ email: res.email }, { verificationCode: { value: code, expiresAt } })
        return { success: expiresAt }
    } catch (error) {
        return { err: 'Something went wrong' }
    }
}

function getHtml(code: number) {
    return `
<div style="width: 100%; height: 100%; display: flex; align-items: center">
    <div style="max-width: 600px; margin: 0 auto; padding: 50px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px">
            <p style="font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 20px; color: #007bff">Your verification code is: <span style="color: #007bff">${code}</span></p>
            <p style="text-align: center; margin-bottom: 30px">Please use this code to verify your email address.</p>
        </div>
        <div style="text-align: center; margin-top: 30px; color: #777">
            <p>This email was sent automatically. Please do not reply.</p>
        </div>
    </div>
</div>
`
}
