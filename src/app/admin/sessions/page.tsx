import dbconnect from '@/db/dbconnect'
import SessionsTable from './SessionsTable'
import Session from '@/auth/session.model'

export default async function page() {
    try {
        await dbconnect()
        const playlist = await Session.find().populate('user')
        const data = playlist.map((e, i) => ({ ...JSON.parse(JSON.stringify(e.toJSON())), id: i + 1 }))
        return (
            <div className="h-full w-full overflow-hidden px-5 py-3">
                <SessionsTable data={data} />
            </div>
        )
    } catch (error) {
        return <div className="flex h-full w-full items-center justify-center">Something went wrong</div>
    }
}
