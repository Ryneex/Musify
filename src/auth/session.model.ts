import User from '@/db/models/user.model'
import { Schema, model, models, SchemaDefinitionProperty, type Model } from 'mongoose'
import { v4 } from 'uuid'

interface ISessionModel {
    _id: string
    user: string
    expiresAt: Date
}

const scema = new Schema({
    _id: {
        type: String,
        default: v4,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    expiresAt: Date,
} as SchemaDefinitionProperty)

const Session: Model<ISessionModel> = models.Session || model('Session', scema)

export default Session
