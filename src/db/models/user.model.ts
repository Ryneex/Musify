import mongoose, { Model } from 'mongoose'

interface IUser {
    name: string
    email: string
    verified: boolean
    favourites: string[]
    password: string
    verificationCode: {
        value: number
        expiresAt: Date
    }
}

const schema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        favourites: {
            type: Array,
            default: [],
        },
        password: {
            required: true,
            type: String,
        },
        verificationCode: {
            value: Number,
            expiresAt: Date,
        },
    } as { [key: string]: mongoose.SchemaDefinitionProperty },
    { timestamps: true }
)

const User: Model<IUser> = mongoose.models.User || mongoose.model('User', schema)

export default User
