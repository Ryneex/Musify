import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import AuthClientProvider from './AuthClientProvider'
import auth from '@/auth/auth'

export default async function AuthProvider({ children }: { children: ReactNode }) {
    const res = await auth.getCurrentUser()
    if (res.verified === false) redirect('/verify')
    if (res.error) redirect('/login')
    return <AuthClientProvider>{children}</AuthClientProvider>
}
