export default interface Song {
    id: string
    name: string
    type: string
    year: number
    releaseDate: string
    duration: number
    label: string
    explicitContent: boolean
    playCount: number
    language: string
    hasLyrics: boolean
    lyricsId: string
    lyrics: Lyrics
    url: string
    copyright: string
    album: Album
    artists: Artists
    image: Image[]
    download_url: string
    downloadUrl: DownloadUrl[]
}

export interface Lyrics {
    lyrics: string
    copyright: string
    snippet: string
}

export interface Album {
    id: string
    name: string
    url: string
}

export interface Artists {
    primary: any[]
    featured: any[]
    all: any[]
}

export interface Image {
    quality: any
    url: any
}

export interface DownloadUrl {
    quality: any
    url: any
}
