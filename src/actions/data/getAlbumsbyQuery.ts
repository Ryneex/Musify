'use server'

import request from '@/config/ky.config'

export default async function getAlbumsbyQuery(query: string) {
    try {
        const res: any = await request
            .get('https://saavn.dev/api/search/albums', {
                searchParams: {
                    query: query,
                    limit: 1000,
                },
            })
            .json()
        return { albums: res.data.results }
    } catch (err) {
        return { err: 'Something went wrong when fetching Album Queries' }
    }
}
