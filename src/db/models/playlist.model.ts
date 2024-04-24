import mongoose from 'mongoose'

const playlistScema = new mongoose.Schema({
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

const Playlist = mongoose.models.Playlist || mongoose.model('Playlist', playlistScema)

export default Playlist
