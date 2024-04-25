'use server'

import dbconnect from '@/db/dbconnect'
import User from '@/db/models/user.model'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { z } from 'zod'

export default async function sendPasswordResetToken(email: string) {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }
    const verifyEmail = z.string().email().toLowerCase()
    const isEmail = verifyEmail.safeParse(email)
    if (!isEmail.success) return { error: 'Invalid email address' }

    try {
        const user = await User.findOne({ email: isEmail.data })
        if (!user) return { error: 'User not found' }
        if (Date.parse(String(user.passwordReset?.expiresAt)) > Date.now()) {
            return { error: user.passwordReset?.expiresAt }
        }
        const token = crypto.randomBytes(64).toString('hex')
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        })
        console.log(`${process.env.HOST_URI}/forgot-password/${token}`)
        await transporter.sendMail({
            from: `Musify <${process.env.EMAIL}>`,
            to: email,
            subject: 'Musify Verification Code',
            html: getHtml(token),
        })
        user.passwordReset = {
            token,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5),
        }
        await user.save()
        return { success: 'Recovery email has been sent. Check your email' }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}

function getHtml(token: string) {
    return `
<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center">
    <div style="max-width: 28rem; padding: 1.25rem; border-radius: 0.375rem; background-color: #f9fafb; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05)">
        <span style="color: black">You recently requested to reset your password for your Musify account. <strong>This password reset is only valid for the next 5 minutes.</strong></span>
        <div style="display: flex; margin: 30px 0px">
            <a href="${process.env.HOST_URI}/forgot-password/${token}" style="border-radius: 0.25rem; background-color: #6366f1; color: #ffffff; padding: 0.5rem 1rem; text-decoration: none; display: inline-block; margin: 0 auto">Reset Your Password</a>
        </div>
        <span style="font-size: 0.875rem; color: black">If you did not request a password reset, please ignore this email</span>
    </div>
</div>
`
}
