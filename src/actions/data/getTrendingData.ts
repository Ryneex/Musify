'use server'

import getSongsById from './getSongsById'

export default async function getTrendingData() {
    try {
        // prettier-ignore
        const trendingSongsId = ['HtWvQ-bx','S3dGvXSb','fy8dN2I_','4Yw5C7IZ','8Ti1DvzG','Z7ZefLyC','wJB6BG9f','QC7UN4ir','nvuKtACx','yqoewXHr','zIuXF49R','80F_M72h','_J5iTI6U','-oaKR00K','Paem2Kf1','YH2P-m-b','RqzofSsS','nsMAIFmD','mfj3H8OL','drvhW8ob','hFBYbIcf','t5VBOdjn','TMfQzhNu','1c-VGSyw','qSsPwP8L','1xqHQw3J','kd8JSDbB','WS-4RA65']
        const { songs } = await getSongsById(trendingSongsId)
        return { songs: songs || [] }
    } catch (error) {
        return { error: 'Something went wrong when fetching Trending Data' }
    }
}
