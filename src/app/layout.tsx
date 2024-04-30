import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TopProgressbar from '@/components/TopProgressbar'
import { cookies } from 'next/headers'
import Script from 'next/script'

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
        <html lang="en" className={`${theme?.value || 'dark'} h-full`}>
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-S2CP8XQH93"></Script>
            <Script
                id="googleAnalytics"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S2CP8XQH93');
            `,
                }}
            ></Script>
            <body className={`${inter.className} h-full dark:bg-zinc-950 dark:text-white`}>
                <TopProgressbar />
                {children}
            </body>
        </html>
    )
}
