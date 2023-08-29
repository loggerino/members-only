const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

messageSchema.virtual("url").get(function () {
    return `/messages/message/${this._id}`;
});

module.exports = mongoose.model('Message', messageSchema);
