'use server'

import auth from '@/config/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function logout() {
    const res = await auth.getCurrentUser()
    if (!res.verified || res.error) redirect('/login')

    cookies().delete('session_id')
    redirect('/login')
}
