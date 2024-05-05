import React from 'react'
import getChartData from '../actions/getChartData'
import Chart from './Chart'
import { cookies } from 'next/headers'

export default async function ChartWrapper() {
    const theme = cookies().get('theme')
    const { error, user, playlist } = await getChartData()

    if (error) return <div className="h-full w-full">Something went wrong</div>
    return <Chart themeMode={theme?.value || 'dark'} user={user!} playlist={playlist!} />
}
