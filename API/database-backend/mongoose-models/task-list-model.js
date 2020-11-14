const mongoose = require('mongoose');

const TaskListSchema = new mongoose.Schema({
    // Definitions for this schema
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true //trime away excess white space
    }
})

const TaskList = mongoose.model('TaskList', TaskListSchema);

// Export TaskList mongoose model
module.exports = { TaskList }