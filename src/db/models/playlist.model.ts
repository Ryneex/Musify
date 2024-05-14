import mongoose, { Model } from 'mongoose'
import User, { IUser } from './user.model'

export interface IPlaylist {
    name: string
    owner_id: string | IUser
    songs: string[]
}

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        owner_id: {
            type: mongoose.Schema.ObjectId,
            ref: User,
            required: true,
        },
        songs: {
            type: Array,
            default: [],
        },
    } as { [key: string]: mongoose.SchemaDefinitionProperty },
    { timestamps: true }
)

const Playlist: Model<IPlaylist> = mongoose.models.Playlist || mongoose.model('Playlist', schema)

export default Playlist
