import authenticateUser from '@/actions/session/authenticateUser'
import { redirect } from 'next/navigation'
import React from 'react'
import VerifyCard from './VerifyCard'

export default async function page() {
    const res = await authenticateUser()
    if (res.verified !== false) redirect('/')
    return <VerifyCard email={res.email} />
}
