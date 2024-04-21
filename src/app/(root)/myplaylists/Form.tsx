import { Button } from '@/components/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/ui/dialog'
import { Input } from '@/components/shadcn/ui/input'
import playlistStore from '@/store/playlist.store'
import { FormEvent, useState } from 'react'

export default function Form() {
    const [input, setInput] = useState('My Playlist')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (input.length < 5) {
            setError('Name must be at least 5 characters')
            return
        } else if (input.length > 20) {
            setError('Name must be below 25 characters')
            return
        }
        setLoading(true)
        const res = await playlistStore.createPlaylist(input)
        if (res.error) {
            setError(res.error)
            setLoading(false)
            return
        }
        setIsDialogOpen(false)
        setLoading(false)
        setInput('')
        setError('')
    }
    return (
        <Dialog open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e)}>
            <DialogTrigger asChild>
                <Button className="w-fit">Add New</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="dark:text-white/90">Add new Playlist</DialogTitle>
                <DialogHeader className="dark:text-white/90">Enter a Name</DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <Input className="dark:text-white" value={input} onChange={(e) => setInput(e.target.value)} />
                        {error && <span className="text-sm text-red-400">{error}</span>}
                    </div>
                    <Button disabled={loading} loading={loading}>
                        Create
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
