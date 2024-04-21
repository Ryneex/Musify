import authenticateUser from '@/actions/session/authenticateUser'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import AuthClientProvider from './AuthClientProvider'

export default async function AuthProvider({ children }: { children: ReactNode }) {
    const res = await authenticateUser()
    if (res.verified === false) redirect('/verify')
    if (res.error) redirect('/login')
    return <AuthClientProvider>{children}</AuthClientProvider>
}
