import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TopProgressbar from '@/components/TopProgressbar'
import { cookies } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Musify',
    description: 'Free music streaming service',
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const theme = cookies().get('theme')
    return (
        <html lang="en" className={theme?.value || 'light'}>
            <body className={inter.className}>
                <TopProgressbar />
                {children}
            </body>
        </html>
    )
}
