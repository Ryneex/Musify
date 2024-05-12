'use server'

import auth from '@/auth/auth'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function logout() {
    const res = await auth.getCurrentUser()
    if (res.error) redirect('/login')
    try {
        await auth.deleteCurrentUsersSession()
        cookies().delete('session_id')
        redirect('/login')
    } catch (error) {
        if (isRedirectError(error)) {
            redirect('/login')
        }
        return { error: 'Something went wrong' }
    }
}
