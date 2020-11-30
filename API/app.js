const express = require('express');
const app = express();

const { mongoose } = require('./database-backend/mongoose');

const bodyParser = require('body-parser');

// Loading in Mongoose Models
const { TaskList, Task, User } = require('./database-backend/mongoose-models');

/* MIDDLEWARE BEGINS */

// Loading in middleware
app.use(bodyParser.json()); // Passes req body of http request

// Sets COR HEADERS on responses
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //if (req.method === 'OPTIONS') {
        //res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        //return res.status(200).json({});
    //};
    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );
    next();
});

// Verify Refresh Token Middleware (verifies the session)
let sessionVerification = (req, res, next) => {
    // grabs refresh token from  request header
    let refreshToken = req.header('x-refresh-token');

    // grabs _id from request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user can't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct...'
            });
        }


        // the user was found so refresh token exists in database 
        // still have to check if refresh token has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token hasn't expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // session is valid; call next() to continue with processing web request
            next();
        } else {
            // session isn't valid
            return Promise.reject({
                'error': 'Refresh token has expired or session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
};



/* MIDDLEWARE ENDS */

/* ROUTE HANDLERS */

/* TASK LIST ROUTES */

/**
 * GET /tasklists (all task lists)
 */
app.get('/tasklists', (req, res)=>{
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
        res.send({message: 'Updated successfully'});
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

/* USER ROUTES */

/**
 * POST /users (Signs up as a user)
 */
app.post('/users', (req, res) => {
    // User signs up
    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully = refreshToken returned.
        // Geneates access auth token for user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now returns object containing auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})


/**
 * POST /users/login 
 */
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully = refreshToken returned.
            // Geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Construct and sends response to the user with their auth tokens in the header and user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

/**
 * GET /users/me/access-token (Generates and returns access token)
 */
app.get('/users/me/access-token', sessionVerification, (req, res) => {
    // user/caller is authenticated and the user_id and user object are available

    // Two ways for client to get access token either through request header or req body; just to be sure
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.listen(3000, () =>{
    console.log("The server is listening on port 3000");
});

