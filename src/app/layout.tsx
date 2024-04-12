import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TopProgressbar from '@/components/TopProgressbar'
import { cookies } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

//prettier-ignore
export const metadata: Metadata = {
    title: 'Musify - Download songs for free',
    description: 'Discover and organize your favorite tunes effortlessly with Musify. Download songs and playlists to enjoy your music anytime, anywhere, even offline.',
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
