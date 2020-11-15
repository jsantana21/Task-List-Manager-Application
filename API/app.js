const express = require('express');
const app = express();

const { mongoose } = require('./database-backend/mongoose');


const bodyParser = require('body-parser');

// Loading in Mongoose Models
const { TaskList, Task } = require('./database-backend/mongoose-models');

// Loading in middleware
app.use(bodyParser.json()); // Passes req body of http request

/* ROUTE HANDLERS */

/* TASK LIST ROUTES */

/**
 * GET /tasklists (all task lists)
 */
app.get('/tasklists', (req, res)=>{
    //res.send("Hello World!");
    // Return an array of all the tasklists that belong to the authenticated user 
    TaskList.find({}).then((tasklists) => {
        res.send(tasklists);
    });

})

/**
 * POST /tasklists (creates a list)
 */
app.post('/tasklists', (req, res) => {
    // Creates a new task list and return new list document back to the user (includes the id)
    // List information (fields) is passed in using JSON request body
    let title = req.body.title;

    let newTaskList = new TaskList({
        title
    });

    newTaskList.save().then((tasklistDoc) => {
        // entire task list document is returned w/id
        res.send(tasklistDoc);
    })

});

/**
 * PATCH: Updates a specified list
 */
app.patch('/tasklists/:id', (req, res) => {
    // Update the specified list (list document w/ id in the URL) with new values specified in JSON body of the request
    TaskList.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body  
    }).then(() => {
        res.send(200);
    });
});

/**
 * DELETE: Deletes a list
 */
app.delete('/tasklists/:id', (req, res) => {
    // Delete specified list (document w/ id in URL)
    TaskList.findOneAndRemove({
        _id: req.params.id
    }).then((removedTaskListDoc) => {
        res.send(removedTaskListDoc);
    })
});

/**
 * GET /tasklists/:tasklistId/tasks (Gets all tasks in a list)
 */
app.get('/tasklists/:tasklistId/tasks', (req, res) => {
    // Return all tasks that belong to a  list (specified by tasklistId)
    Task.find({
        _tasklistId: req.params.tasklistId
    }).then((tasks) => {
        res.send(tasks);
    })
});

/**
 * POST /lists/:tasklistId/tasks (Create a new task in a list)
 */
app.post('/tasklists/:tasklistId/tasks', (req, res) => {
    // Create a new task in a list specified by tasklistId

    let newTask = new Task({
        title: req.body.title,
        _tasklistId: req.params.tasklistId
    });
    newTask.save().then((newTaskDoc) =>{
        res.send(newTaskDoc);
    })
})

/**
 * PATCH /tasklists/:tasklistId/tasks/:taskId (Update an existing task)
 */
app.patch('/tasklists/:tasklistId/tasks/:taskId', (req, res) => {
    // Update an existing task (specified by taskId)
    Task.findByIdAndUpdate({ 
        _id: req.params.taskId,
        _tasklistId: req.body.tasklistId
    }, {
        $set: req.body  
    }).then(() => {
        res.send(200);
    });
});

/**
 * DELETE /tasklists/:tasklistId/tasks/:taskId (Deletes a task)
 */
app.delete('/tasklists/:tasklistId/tasks/:taskId', (req, res) => {

    Task.findByIdAndDelete({
        _id: req.params.taskId,
        _tasklistId: req.params.tasklistId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
});

app.listen(3000, () =>{
    console.log("The server is listening on port 3000");
});