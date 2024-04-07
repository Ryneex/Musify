import mongoose from 'mongoose'

const userScema = new mongoose.Schema({
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
} as mongoose.SchemaDefinitionProperty)

const User = mongoose.models.User || mongoose.model('User', userScema)

export default User
