const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSuggestionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    suggested_user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('users-suggestions', UserSuggestionSchema)
