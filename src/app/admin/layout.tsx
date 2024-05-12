import auth from '@/auth/auth'
import { redirect } from 'next/navigation'
import Sidenav from './Sidenav'
import Nav from './Nav'

export default async function layout({ children }) {
    const user = await auth.getCurrentUser()
    if (user.error || !user.isAdmin) redirect('/')
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-black">
            <Sidenav />
            <div className="flex w-full flex-col">
                <Nav />
                {children}
            </div>
        </div>
    )
}
