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

});

app.listen(3000, () =>{
    console.log("The server is listening on port 3000");
});