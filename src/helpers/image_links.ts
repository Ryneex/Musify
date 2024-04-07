const createImageLinks = (link: string) => {
    if (!link) return []

    const qualities = ['50x50', '150x150', '500x500']
    const regex = /150x150|50x50/

    return qualities.map((quality) => ({
        quality,
        url: link.replace(regex, quality),
    }))
}

export default createImageLinks
