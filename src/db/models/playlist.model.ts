import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner_id: {
        type: String,
        required: true,
    },
    songs: {
        type: Array,
        default: [],
    },
} as { [key: string]: mongoose.SchemaDefinitionProperty })

const Playlist = mongoose.models.Playlist || mongoose.model('Playlist', schema)

export default Playlist
