import Song from '@/types/song.types'
import JSZip from 'jszip'
import { toast } from 'sonner'

type Prop = {
    name: string
    songs: Song[]
}

export default async function downloadSongs({ name, songs }: Prop) {
    const zip = new JSZip()
    const songFolder = zip.folder(name || 'songs')
    let counter = 0
    const toastId = toast.loading(`${0}/${songs.length} songs downloaded`, {
        position: 'top-center',
        cancel: {
            label: 'Hide',
            onClick: () => null,
        },
    })

    const res = await Promise.all(
        songs.map(async (song) => {
            const res = await fetch(song.downloadUrl[song.downloadUrl.length - 1].url)
            const blob = await res.blob()
            toast.loading(`${++counter}/${songs.length} songs downloaded`, { id: toastId, position: 'top-center' })
            return { name: `${song.name}.m4a`, blob }
        })
    )

    res.forEach((e) => songFolder!.file(e.name, e.blob))
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = name || 'download'
    toast.success('Download Complete', { id: toastId, position: 'top-center' })
    a.click()
}
