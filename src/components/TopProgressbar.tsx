'use client'

import React from 'react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export default function TopProgressbar() {
    return <ProgressBar color="#3b82f6" options={{ showSpinner: false }} />
}
