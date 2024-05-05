import { Button } from '@/components/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/ui/dialog'
import { Input } from '@/components/shadcn/ui/input'
import playlistStore from '@/store/playlist.store'
import { FormEvent, useState } from 'react'

export default function EditForm({ editFormPlaylistId, editFormName, setEditFormName, isEditFormOpen, setIsEditFormOpen }: any) {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (editFormName.length < 5) {
            setError('Name must be at least 5 characters')
            return
        } else if (editFormName.length > 20) {
            setError('Name must be below 20 characters')
            return
        }
        setLoading(true)
        const res = await playlistStore.editPlaylist(editFormPlaylistId, editFormName)
        if (res.error) {
            setError(res.error)
            setLoading(false)
            return
        }
        setIsEditFormOpen(false)
        setLoading(false)
        setEditFormName('')
        setError('')
    }
    return (
        <Dialog open={isEditFormOpen} onOpenChange={(e) => setIsEditFormOpen(e)}>
            <DialogContent>
                <DialogTitle className="dark:text-white/90">Rename this Playlist</DialogTitle>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <Input className="dark:text-white" value={editFormName} onChange={(e) => setEditFormName(e.target.value)} />
                        {error && <span className="text-sm text-red-400">{error}</span>}
                    </div>
                    <Button disabled={loading} loading={loading}>
                        Update
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
