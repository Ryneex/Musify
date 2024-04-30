import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'
import { BiLogOut } from 'react-icons/bi'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../shadcn/ui/dialog'
import { Input } from '../shadcn/ui/input'
import { Button } from '../button'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import userStore from '@/store/user.store'
import DeleteUser from '@/actions/user/deleteUser'
import logout from '@/actions/user/logout'

export default function ProfileButton() {
    const { user } = useSnapshot(userStore)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (password.length < 5) {
            return setError("Password can't be less than 5 char")
        }
        setLoading(true)
        const res = await DeleteUser(password)
        if (res?.error) setError(res.error)
        setLoading(false)
    }

    return (
        <div className="aspect-square h-full shrink-0 select-none overflow-hidden rounded-full bg-primary text-white">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex h-full w-full cursor-pointer items-center justify-center">
                        {user.name?.slice(0, 1)}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-2">
                    <DropdownMenuItem onClick={() => logout()}>
                        Logout
                        <DropdownMenuShortcut>
                            <BiLogOut className="ml-3 text-lg" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsDialogOpen(true)}
                        className=" text-red-500 hover:!text-red-500 dark:text-red-400 dark:hover:!text-red-400"
                    >
                        Delete Account
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="dark:text-white">Delete my Account</DialogTitle>
                        <DialogDescription>Enter your password below to delete your account</DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your Password"
                            className="dark:text-white/90"
                        />
                        {error && <span className="text-sm text-red-500 dark:text-red-400">{error}</span>}
                    </div>
                    <DialogFooter className="gap-2 sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                onClick={() => {
                                    setPassword('')
                                }}
                                variant="outline"
                                className="w-full dark:text-white"
                            >
                                Close
                            </Button>
                        </DialogClose>
                        <Button
                            loading={loading}
                            disabled={loading}
                            variant="destructive"
                            className="w-full hover:!bg-red-600 dark:bg-red-500"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
