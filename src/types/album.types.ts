import Song from './song.types'

export default interface Album {
    id: string
    name: string
    description: string
    year: number
    type: string
    playCount: number
    language: string
    explicitContent: boolean
    artists: Artists
    songCount: number
    url: string
    image: Image[]
    songs?: Song[]
}
interface Image {
    quality: string
    url: string
}
interface Artists {
    primary: Primary[]
    featured: Primary[]
    all: Primary[]
}
interface Primary {
    id: string
    name: string
    role: string
    type: string
    image: null[]
    url: string
}
