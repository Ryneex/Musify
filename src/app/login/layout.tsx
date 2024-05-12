import auth from '@/auth/auth'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function AuthProvider({ children }: { children: ReactNode }) {
    const res = await auth.getCurrentUser()
    if (res.verified === false) redirect('/verify')
    if (!res.error) redirect('/')
    return <>{children}</>
}
