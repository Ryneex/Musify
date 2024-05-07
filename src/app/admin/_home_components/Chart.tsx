'use client'

import userStore from '@/store/user.store'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LineChart } from '@mui/x-charts/LineChart'
import { useEffect, useMemo, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { useSnapshot } from 'valtio'

interface IProp {
    user: {
        total: number
        date: string
        dates: {
            date: string
            count: number
        }[]
    }[]
    playlist: {
        total: number
        date: string
        dates: {
            date: string
            count: number
        }[]
    }[]
    themeMode: string
}

const lightTheme = createTheme()

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        text: {
            primary: 'rgba(255, 255, 255, 0.7)',
        },
    },
})

export default function Chart({ user, playlist, themeMode }: IProp) {
    const [year, setYear] = useState(new Date().getFullYear())
    const [chartData, setChartData] = useState({ user: [], playlist: [] } as any)
    const Months = useMemo(() => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], [])
    const [chartZoomedIn, setChartZoomedIn] = useState(false)
    const [month, setMonth] = useState(new Date().getMonth())
    const { theme } = useSnapshot(userStore)

    useEffect(() => {
        setChartData(() => {
            if (!chartZoomedIn) {
                const [a, b] = [user, playlist].map((data) => {
                    const returnData = Months.map((_, i) => {
                        const filteredData = data.find((e) => {
                            const date = new Date(e.date)
                            if (date.getMonth() === i && date.getFullYear() === year) return true
                        })
                        if (filteredData) return filteredData.total
                        return 0
                    })
                    if (returnData.reduce((e, a) => e + a) === 0) return []
                    return returnData
                })
                return { user: a, playlist: b }
            }
            const [a, b] = [user, playlist].map((data) => {
                const filteredMonth = data.find((e) => {
                    const date = new Date(e.date)
                    if (date.getMonth() === month && date.getFullYear() === year) return true
                })
                const returnData = new Array(new Date(year, month + 1, 0).getDate()).fill(0).map((_, i) => {
                    const data = filteredMonth?.dates.find((e) => new Date(e.date).getDate() === i + 1)
                    if (data) return data.count
                    return 0
                })
                if (returnData.reduce((e, a) => e + a) === 0) return []
                return returnData
            })
            return { user: a, playlist: b }
        })
    }, [year, user, playlist, month, Months, chartZoomedIn])

    return (
        <div className="flex h-full w-full flex-col overflow-hidden border border-slate-200 bg-white pt-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-600/10">
            <div className="relative flex w-full select-none items-center justify-center gap-4 font-medium">
                <button className="absolute left-5 top-0 border border-slate-300 bg-indigo-500 px-2 py-0.5 text-sm text-white dark:border-zinc-800" onClick={() => setChartZoomedIn(!chartZoomedIn)}>
                    {chartZoomedIn ? 'Expand' : 'Zoom'}
                </button>
                <IoIosArrowBack
                    onClick={() => {
                        if (chartZoomedIn) {
                            if (month === 0) {
                                setMonth(11)
                                return setYear((e) => --e)
                            }
                            return setMonth((e) => --e)
                        }
                        setYear((e) => --e)
                    }}
                    className="size-5 cursor-pointer border border-slate-300 bg-slate-200 p-0.5 dark:border-zinc-600 dark:bg-slate-50/10"
                />
                <span>
                    {chartZoomedIn && Months[month]} {year}
                </span>
                <IoIosArrowForward
                    onClick={() => {
                        if (chartZoomedIn) {
                            if (month === 11) {
                                setMonth(0)
                                return setYear((e) => ++e)
                            }
                            return setMonth((e) => ++e)
                        }
                        setYear((e) => ++e)
                    }}
                    className="size-5 cursor-pointer border border-slate-300 bg-slate-200 p-0.5 dark:border-zinc-600 dark:bg-slate-50/10"
                />
            </div>
            <div className="mt-3 flex w-full items-center justify-center gap-5 text-sm dark:text-white/70">
                <div className="flex items-center gap-2">
                    <div className="size-3 bg-[rgb(2,178,175)]"></div>
                    <span>User Registered</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-3 bg-indigo-500"></div>
                    <span>Playlist Created</span>
                </div>
            </div>
            <div className="h-full w-full">
                <ThemeProvider theme={(theme || themeMode) === 'dark' ? darkTheme : lightTheme}>
                    <LineChart
                        onAxisClick={(_, e) => {
                            if (chartZoomedIn) return
                            setChartZoomedIn(true)
                            e?.dataIndex && setMonth(e?.dataIndex)
                        }}
                        title="Year"
                        className="text-white"
                        xAxis={[{ scaleType: 'point', data: chartZoomedIn ? new Array(new Date(year, month + 1, 0).getDate()).fill(0).map((_, e) => ++e) : Months, label: chartZoomedIn ? 'Days' : '' }]}
                        series={[
                            {
                                data: chartData.user,
                            },
                            {
                                data: chartData.playlist,
                                color: 'rgb(99 102 241)',
                            },
                        ]}
                    />
                </ThemeProvider>
            </div>
        </div>
    )
}
