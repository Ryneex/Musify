'use client'

import { MdOutlineFileDownload } from 'react-icons/md'
import downloadSongs from '../helpers/downloadSongs'
import Song from '@/types/song.types'

export default function DownloadButton({ name, songs }: { name: string; songs: Song[] }) {
    return <MdOutlineFileDownload className="absolute bottom-2 right-0 cursor-pointer rounded-full p-1 text-4xl text-black/70 hover:bg-slate-200 dark:text-white/80 dark:hover:bg-white/20" onClick={() => downloadSongs({ name, songs })} />
}
