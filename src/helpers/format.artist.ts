import createImageLinks from './image_links'

export const createArtistMap = (artist: any) => ({
    id: artist.id,
    name: artist.name,
    role: artist.role,
    image: createImageLinks(artist.image),
    type: artist.type,
    url: artist.perma_url,
})
