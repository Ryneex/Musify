import { redirect } from 'next/navigation'
import React from 'react'
import VerifyCard from './VerifyCard'
import auth from '@/config/auth'

export default async function page() {
    const res = await auth.getCurrentUser()
    if (res.verified !== false) redirect('/')
    return <VerifyCard email={res.email} />
}
