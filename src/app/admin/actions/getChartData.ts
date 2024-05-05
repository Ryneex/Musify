import dbconnect from '@/db/dbconnect'
import Playlist from '@/db/models/playlist.model'
import User from '@/db/models/user.model'

export default async function getChartData() {
    const db = await dbconnect()
    if (db.error) return { error: 'Something went wrong' }

    try {
        const UserPromise = User.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt',
                        },
                    },
                    count: {
                        $count: {},
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    count: 1,
                },
            },
            {
                $sort: {
                    date: 1,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m',
                            date: {
                                $dateFromString: {
                                    dateString: '$date',
                                },
                            },
                        },
                    },
                    total: {
                        $sum: '$count',
                    },
                    dates: {
                        $push: '$$ROOT',
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    dates: 1,
                    total: 1,
                },
            },
            {
                $sort: {
                    date: 1,
                },
            },
        ])
        const PlaylistPromise = await Playlist.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt',
                        },
                    },
                    count: {
                        $count: {},
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    count: 1,
                },
            },
            {
                $sort: {
                    date: 1,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m',
                            date: {
                                $dateFromString: {
                                    dateString: '$date',
                                },
                            },
                        },
                    },
                    total: {
                        $sum: '$count',
                    },
                    dates: {
                        $push: '$$ROOT',
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    dates: 1,
                    total: 1,
                },
            },
            {
                $sort: {
                    date: 1,
                },
            },
        ])
        const res = await Promise.all([UserPromise, PlaylistPromise])
        return { user: res[0], playlist: res[1] }
    } catch (error) {
        return { error: 'Something went wrong' }
    }
}
