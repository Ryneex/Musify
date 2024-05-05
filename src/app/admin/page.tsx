import { TbUsers } from 'react-icons/tb'
import getStorageData from './actions/getStorageData'
import { Suspense } from 'react'
import { Skeleton } from '@/components/shadcn/ui/skeleton'
import ChartWrapper from './_home_components/ChartWrapper'

export default async function page() {
    const { error, user, playlist, session } = await getStorageData()
    if (error) return <div className="flex h-full w-full items-center justify-center">Something wen&apos;t wrong</div>

    const bars = [
        {
            title: 'Total Users',
            data: `+${user.count}`,
            small_data: `+${user.last_month} last month`,
            icon: TbUsers,
        },
        {
            title: 'Total Playlists',
            data: `+${playlist.count}`,
            small_data: `+${playlist.last_month} last month`,
            icon: TbUsers,
        },
        {
            title: 'Total Sessions',
            data: `+${session.count}`,
            small_data: `+${session.expired_count} sessions has expired`,
            icon: TbUsers,
        },
    ]

    return (
        <div className="flex h-full flex-col gap-5 overflow-hidden p-5">
            <div className="flex h-36 shrink-0 gap-5">
                {bars.map((e, i) => (
                    <div key={i} className="flex h-full w-full flex-col justify-between rounded-md border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-600/10">
                        <h2 className="flex justify-between text-sm font-medium">
                            {e.title} <e.icon />
                        </h2>
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold">{e.data}</span>
                            <span className="text-xs text-black/80 dark:text-white/70">{e?.small_data}</span>
                        </div>
                    </div>
                ))}
            </div>
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <ChartWrapper />
            </Suspense>
        </div>
    )
}
