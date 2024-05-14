import dbconnect from '@/db/dbconnect'
import UsersTable from './UsersTable'
import User from '@/db/models/user.model'

export default async function page() {
    try {
        await dbconnect()
        const users = await User.find()
        const data = users.map((e, i) => ({ ...JSON.parse(JSON.stringify(e.toJSON())), id: i + 1 }))

        return (
            <div className="h-full w-full overflow-hidden px-5 py-3">
                <UsersTable data={data} />
            </div>
        )
    } catch (error) {
        return <div className="flex h-full w-full items-center justify-center">Something went wrong</div>
    }
}
