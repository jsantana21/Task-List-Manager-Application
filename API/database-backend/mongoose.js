// Handles connection logic to MongoDB

const mongoose = require('mongoose');

// Use JS global promise instead
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TaskListManagerApp', { useNewUrlParser: true }).then(() => {
    console.log("Connected to MongoDB!!!");
}).catch((e) => {
    console.log("ERROR: Unable to connect to MongoDB");
    console.log(e);
});

// Prevent deprectation warnings
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// Export mongoose object
module.exports = { mongoose };