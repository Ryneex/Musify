'use server'
import auth from '@/auth/auth'
import { redirect } from 'next/navigation'

export default async function getUserInfo() {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error) redirect('/login')
    const { name, email, favourites } = res
    return { user: { name, email, favourites } }
}
