const express = require('express');
const app = express();

// Loading in Mongoose Models
const { TaskList, Task } = require('./database-backend/mongoose-models');

/* ROUTE HANDLERS */

/* LIST ROUTES */

/**
 * GET /lists (all lists)
 */
app.get('/lists', (req, res)=>{
    //res.send("Hello World!");
    // Return an array of all the lists that belong to the authenticated user 


})

/**
 * POST /lists (creates a list)
 */
app.post('/lists', (req, res) => {
    // Creates a new list and return new list document back to the user (includes the id)
    // List information (fields) is passed in using JSON request body

});

/**
 * PATCH: Updates a specified list
 */
app.patch('/lists/:id', (req, res) => {
    // Update the specified list (list document w/ id in the URL) with new values specified in JSON body of the request

});

/**
 * DELETE: Deletes a list
 */
app.delete('/lists/:id', (req, res) => {
    // Delete specified list (document w/ id in URL)

});

app.listen(3000, () =>{
    console.log("The server is listening on port 3000");
});