const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserConnectionSchema = new Schema({
    sender_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    receiver_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    is_accepted: {
        type: Boolean,
        required: true,
        default: false
    },
    is_checked: {
        type: Boolean,
        required: true,
        default: false
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

module.exports = mongoose.model('users-connection', UserConnectionSchema)
