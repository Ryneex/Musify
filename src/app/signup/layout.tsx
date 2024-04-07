import authenticateUser from '@/actions/session/authenticateUser'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function AuthProvider({ children }: { children: ReactNode }) {
    const res = await authenticateUser()
    if (res.verified === false) redirect('/verify')
    if (res.success) redirect('/')
    return <>{children}</>
}
