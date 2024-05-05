'use client'

import SongsTable from './SongsTable'
import { useSnapshot } from 'valtio'
import userStore from '@/store/user.store'
import DownloadButton from '@/components/DownloadButton'

export default function Page() {
    const { user, favourites } = useSnapshot(userStore) as typeof userStore
    return (
        <div className="overflow-hidden px-2 pt-0 sm:px-5 sm:pt-5">
            <div className="flex h-full flex-col overflow-hidden pb-5">
                <div className="relative flex shrink-0 flex-col justify-center overflow-hidden pb-3 sm:pb-10">
                    <h1 className="overflow-hidden truncate text-lg font-bold sm:text-2xl md:text-3xl lg:text-4xl">Favourite Songs</h1>
                    {favourites?.length !== 0 && <DownloadButton name="favourites" songs={favourites || []} />}
                    <span className="overflow-hidden truncate text-xs text-black/80 dark:text-white/80 sm:mt-2 sm:text-sm">
                        By {user?.name} | {favourites?.length || 0} songs
                    </span>
                </div>
                <SongsTable songs={favourites} />
            </div>
        </div>
    )
}
