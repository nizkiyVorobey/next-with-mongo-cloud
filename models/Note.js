const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a name'],
        unigue: false,
        maxlength: [40, 'Decription cannot be more than 40 characters']
    },
    message: {
        type: String,
        required: [true, 'Please add a email'],
        unigue: false,
        maxlength: [140, 'Decription cannot be more than 140 characters']
    }
})

module.exports = mongoose.models.users || mongoose.model('users', NoteSchema)