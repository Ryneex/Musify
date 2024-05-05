import Session from '@/auth/session.model'
import dbconnect from '@/db/dbconnect'
import Playlist from '@/db/models/playlist.model'
import User from '@/db/models/user.model'

export default async function getStorageData() {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }
    try {
        const UserPromise = User.aggregate([
            {
                $group: {
                    _id: null,
                    count: {
                        $count: {},
                    },
                    last_month: {
                        $sum: {
                            $cond: {
                                if: {
                                    $gte: ['$createdAt', new Date(Date.now() - 3600000 * 24 * 30)],
                                },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                },
            },
        ])
        const PlaylistPromise = Playlist.aggregate([
            {
                $group: {
                    _id: null,
                    count: {
                        $count: {},
                    },
                    last_month: {
                        $sum: {
                            $cond: {
                                if: {
                                    $gte: ['$createdAt', new Date(Date.now() - 3600000 * 24 * 30)],
                                },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                },
            },
        ])
        const SessionsPromise = Session.aggregate([
            {
                $group: {
                    _id: null,
                    count: {
                        $count: {},
                    },
                    expired_count: {
                        $sum: {
                            $cond: {
                                if: {
                                    $lte: ['$expiresAt', new Date()],
                                },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                },
            },
        ])

        const result = await Promise.all([UserPromise, PlaylistPromise, SessionsPromise])
        return { user: result[0][0], playlist: result[1][0], session: result[2][0] }
    } catch (error) {
        return { error: "Something wen't wrong" }
    }
}
