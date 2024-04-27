import Player from '@/components/root/player/Player'
import Sidebar from '@/components/root/Sidebar'
import TopNavigation from '@/components/root/TopNavigation'
import { ReactNode } from 'react'
import AuthProvider from '@/components/AuthProvider/AuthProvider'

export default async function layout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <div className="grid h-full grid-cols-[45px_1fr] grid-rows-[50px_1fr_65px] supports-[h:100dvh]:h-[100dvh] sm:grid-rows-[60px_1fr_65px] lg:grid-cols-[250px_1fr]">
                <Sidebar />
                <TopNavigation />
                {children}
                <Player />
            </div>
        </AuthProvider>
    )
}
