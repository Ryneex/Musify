import Song from '@/types/song.types'
import { toast } from 'sonner'

type Prop = {
    name: string
    song: Song
}

export default async function downloadSong({ name, song }: Prop) {
    const toastId = toast.loading(`Downloading ${name}`, {
        position: 'top-center',
        cancel: {
            label: 'Hide',
            onClick: () => null,
        },
    })

    const res = await fetch(song.downloadUrl[song.downloadUrl.length - 1].url)
    const songBlob = await res.blob()

    const url = URL.createObjectURL(songBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = name || 'download'
    toast.success('Download Complete', { id: toastId, position: 'top-center' })
    a.click()
}
