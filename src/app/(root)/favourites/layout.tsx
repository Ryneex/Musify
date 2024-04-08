import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Musify - Favourites',
}

export default async function layout({
    children,
}: Readonly<{
    children: React.ReactElement
}>) {
    return children
}
