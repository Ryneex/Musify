import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Musify - My Playlists',
}

export default async function layout({
    children,
}: Readonly<{
    children: React.ReactElement
}>) {
    return children
}
