'use client'

import userStore from '@/store/user.store'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { TooltipProvider } from '@/components/shadcn/ui/tooltip'
import playlistStore from '@/store/playlist.store'
import { Toaster } from '@/components/shadcn/ui/sonner'

export default function AuthClientProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    useEffect(() => {
        router.refresh()
    }, [pathname, router])

    useEffect(() => {
        userStore.setUser()
        playlistStore.setPlaylists()
    }, [])

    return (
        <TooltipProvider>
            <Toaster />
            {children}
        </TooltipProvider>
    )
}
