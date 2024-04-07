'use server'

import request from '@/config/ky.config'

export default async function getSongsbyQuery(query: string) {
    try {
        const data: any = await request
            .get('https://saavn.dev/api/search/songs', {
                searchParams: {
                    query,
                    limit: 1000,
                },
            })
            .json()
        return { songs: data.data.results }
    } catch (err) {
        return { err: 'Something went wrong when fetching Trending Data' }
    }
}
