'use client'

import Form from './Form'
import PlaylistCard from './PlaylistCard'
import { useSnapshot } from 'valtio'
import Loader from '@/components/spinner/loader'
import playlistStore from '@/store/playlist.store'
import EditForm from './EditForm'
import { useState } from 'react'

export default function Page() {
    const { playlists } = useSnapshot(playlistStore)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [editFormName, setEditFormName] = useState('')
    const [editFormPlaylistId, setEditFormPlaylistId] = useState('')
    return (
        <div className="overflow-hidden pl-2 pt-0 sm:pl-5 sm:pt-5">
            <div className="flex h-full flex-col gap-3 overflow-hidden pb-5">
                <div className="flex shrink-0 flex-col justify-center overflow-hidden">
                    <h1 className="overflow-hidden truncate text-lg font-bold sm:text-2xl md:text-3xl lg:text-4xl">My Playlists</h1>
                </div>
                <Form />
                <EditForm editFormPlaylistId={editFormPlaylistId} editFormName={editFormName} setEditFormName={setEditFormName} isEditFormOpen={isEditFormOpen} setIsEditFormOpen={setIsEditFormOpen} />
                <div className="custom-scrollbar mt-5 h-full overflow-auto pr-2 sm:pr-5">
                    {playlists ? (
                        <>{!playlists.length ? <div className="flex h-full w-full items-center justify-center text-slate-500 dark:text-slate-300">You don&apos;t have any Playlist</div> : <div className="grid grid-cols-2 gap-4 overflow-auto xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">{playlists?.map((e, i) => <PlaylistCard setEditFormPlaylistId={setEditFormPlaylistId} setEditFormName={setEditFormName} setIsEditFormOpen={setIsEditFormOpen} key={i} playlist={e} />)}</div>}</>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Loader />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
