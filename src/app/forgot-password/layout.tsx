import auth from '@/auth/auth'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function layout({ children }: { children: ReactNode }) {
    const res = await auth.getCurrentUser()
    if (res.email) redirect('/')
    return children
}
