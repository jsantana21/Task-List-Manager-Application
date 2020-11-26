// Easier to import models to other files by combining them here 

const { TaskList } = require('./task-list-model');
const { Task } = require('./task-model');
const { User } = require('./user.model');

module.exports = {
   TaskList,
    Task,
    User
}