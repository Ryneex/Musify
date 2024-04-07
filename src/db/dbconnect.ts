import mongoose from 'mongoose'

export default async function dbconnect() {
    try {
        if (mongoose.connection?.readyState === 1) return { success: 'MongoDB connected' }
        await mongoose.connect(process.env.MONGODB_URI as string)
        return { success: 'MongoDB connected' }
    } catch (err) {
        return { err: 'Could not connect to MongoDB' }
    }
}
