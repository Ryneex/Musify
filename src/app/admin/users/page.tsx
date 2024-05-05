import UsersTable from './UsersTable'

export default function page() {
    try {
        return (
            <div className="h-full w-full overflow-hidden px-5 py-3">
                <UsersTable />
            </div>
        )
    } catch (error) {
        return <div className="flex h-full w-full items-center justify-center">Something went wrong</div>
    }
}
