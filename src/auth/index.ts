import { isValidObjectId } from 'mongoose'
import { cookies } from 'next/headers'
import { validate } from 'uuid'
import Session from './session.model'

interface IAuthConstructor {
    dbconnect: () => Promise<any>
    session_cookie_name?: string
}

class Auth {
    private dbconnect: () => Promise<void>
    private session_cookie_name: string

    constructor(options: IAuthConstructor) {
        this.dbconnect = options.dbconnect
        this.session_cookie_name = options.session_cookie_name || 'session_id'
    }

    async createSession({ userId, expiresIn }: { userId: string; expiresIn: number }) {
        if (!isValidObjectId(userId)) return { error: 'Invalid user ID' }
        try {
            await this.dbconnect()
            const session = await Session.create({ user: userId, expiresAt: Date.now() + expiresIn })
            cookies().set(this.session_cookie_name, session._id, {
                httpOnly: true,
                expires: Date.now() + expiresIn,
                secure: process.env.NODE_ENV === 'production',
            })
            return { success: 'Session created successfully', data: session }
        } catch (error) {
            return { error: "Couldn't create Session" }
        }
    }

    async getCurrentSession() {
        return await this.getCurrentUser({ withSession: true })
    }

    async getCurrentUser(option: { withSession: boolean } | undefined = undefined): Promise<any> {
        const session_id = cookies().get(this.session_cookie_name)
        if (!session_id || !validate(session_id.value)) return { error: 'Invalid Session ID' }
        try {
            await this.dbconnect()
            const session = await Session.findById(session_id.value, { __v: false }).populate('user', {
                __v: false,
            })
            if (!session) return { error: 'Session not found' }
            if (session.expiresAt <= new Date() || !session.user) {
                await session.deleteOne()
                return { error: 'Session has expired' }
            }
            return option?.withSession ? session : session.user
        } catch (error) {
            return { error: "Couldn't get Session" }
        }
    }

    async deleteCurrentUsersSession() {
        const session_id = cookies().get(this.session_cookie_name)
        if (!session_id || !validate(session_id.value)) return { error: 'Invalid Session ID' }
        try {
            await this.dbconnect()
            await Session.deleteOne({ _id: session_id.value })
            return { success: 'Deleted current users session' }
        } catch (error) {
            return { error: "Couldn't delete current users session" }
        }
    }

    async deleteCurrentUsersAllSessions() {
        try {
            const res: any = await this.getCurrentUser()
            if (res.error) return { error: res.error }
            await Session.deleteMany({ user: res._id })
            return { success: 'Deleted current users all session' }
        } catch (error) {
            return { error: "Couldn't delete current users session" }
        }
    }

    async deleteSession(filter: { _id?: string; user?: string }) {
        if (!filter._id && !filter.user) {
            return { error: 'Session ID or User ID, at least one is required' }
        }
        try {
            await this.dbconnect()
            const deletedSessions = await Session.deleteMany(filter)
            if (!deletedSessions.deletedCount) return { success: 'Session was not found with provied Session/User ID' }
            return { success: filter.user ? 'Deleted sessions by user id' : 'Deleted session by session id' }
        } catch (error) {
            return { error: "Couldn't delete session" }
        }
    }

    async deleteExpiredSessions() {
        try {
            await this.dbconnect()
            await Session.deleteMany({ expiresAt: { $lte: new Date() } })
            return { success: 'Deleted all expired sessions' }
        } catch (error) {
            return { error: "Couldn't delete expired sessions" }
        }
    }

    async deleteAllSessions() {
        try {
            await this.dbconnect()
            await Session.deleteMany({})
            return { success: 'Deleted all sessions' }
        } catch (error) {
            return { error: "Couldn't delete expired sessions" }
        }
    }
}

export default Auth
