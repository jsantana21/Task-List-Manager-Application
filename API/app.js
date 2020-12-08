const express = require('express');
const app = express();

const { mongoose } = require('./database-backend/mongoose');

const bodyParser = require('body-parser');

// Loading in Mongoose Models
const { TaskList, Task, User } = require('./database-backend/mongoose-models');

const jwt = require('jsonwebtoken');

/* MIDDLEWARE BEGINS */

var cors = require('cors')

app.use(cors()) // Use this after the variable declaration

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

// check if request has valid JWT access token
let authentication = (req, res, next) => {
    let token = req.header('x-access-token');

    // verify JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // ERROR detected; JWT is INVALID = DON'T AUTHENTICATE 
            res.status(401).send(err);
        } else {
            // JWT is VALID
            req.user_id = decoded._id;
            next();
        }
    });
}

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
app.get('/tasklists', authentication, (req, res)=>{
    // Return an array of all the tasklists that belong to authenticated user 
    TaskList.find({
        _userId: req.user_id
    }).then((lists) => {
        res.send(lists);
    }).catch((e) => {
        res.send(e);
    });
})


/**
 * POST /tasklists (creates a tasklist)
 */
app.post('/tasklists', authentication, (req, res) => {
    // Creates a new task list and return new list document back to the user (includes the id)
    // List information (fields) is passed in using JSON request body
    let title = req.body.title;

    let newTaskList = new TaskList({
        title,
        _userId: req.user_id
    });

    newTaskList.save().then((tasklistDoc) => {
        // entire task list document is returned w/id
        res.send(tasklistDoc);
    })

});

/**
 * PATCH: Updates a specified list
 */
app.patch('/tasklists/:id', authentication, (req, res) => {
    // Update the specified list (list document w/ id in the URL) with new values specified in JSON body of request
    TaskList.findByIdAndUpdate({ _id: req.params.id, _userId: req.user_id}, {
        $set: req.body  
    }).then(() => {
        res.send(200);
    });
});

/**
 * DELETE: Deletes a list
 */
app.delete('/tasklists/:id', authentication, (req, res) => {
    // Delete specified list (document w/ id in URL)
    TaskList.findByIdAndRemove({
        _id: req.params.id,
        _userId: req.user_id
    }).then((removedTaskListDoc) => {
        res.send(removedTaskListDoc);

        // delete all tasks that are in deleted list
        deleteTasksFromList(removedTaskListDoc._id);
    })
});

// Helper Method for Delete
let deleteTasksFromList = (_tasklistId) => {
    Task.deleteMany({
        _tasklistId
    }).then(() => {
        console.log("All tasks from Tasklist ID: " + _tasklistId + " were deleted!");
    })
}

/**
 * GET /tasklists/:tasklistId/tasks (Gets all tasks in a list)
 */
app.get('/tasklists/:tasklistId/tasks', authentication, (req, res) => {
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
app.post('/tasklists/:tasklistId/tasks', authentication, (req, res) => {
    // Create a new task in a list specified by tasklistId

    TaskList.findOne({
        _id: req.params.tasklistId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // if list object with specified conditions was found -> authenticated user can create new tasks
            return true;
        }

        // else -> list object is undefined
        return false;
    }).then((canCreateTask) => {
        if (canCreateTask) {
            let newTask = new Task({
                title: req.body.title,
                _tasklistId: req.params.tasklistId
            });
            newTask.save().then((newTaskDoc) => {
                res.send(newTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
    
})


/**
 * PATCH /tasklists/:tasklistId/tasks/:taskId (Update an existing task)
 */
app.patch('/tasklists/:tasklistId/tasks/:taskId', authentication, (req, res) => {
    // Update an existing task (specified by taskId)

    TaskList.findOne({
        _id: req.params.tasklistId,
        _userId: req.user_id
    }).then((tasklist) => {
        if (tasklist) {
            // if list object with specified conditions is found -> authenticated user can make updates to tasks within list
            return true;
        }

        // else -> list object is undefined
        return false;
    }).then((canUpdateTasks) => {
        if (canUpdateTasks) {
            // authenticated user can update tasks
            Task.findByIdAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.tasklistId
            }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({ message: 'Updated successfully.' })
            })
        } else {
            res.sendStatus(404);
        }
    })
    
});

/**
 * DELETE /tasklists/:tasklistId/tasks/:taskId (Deletes a task)
 */
app.delete('/tasklists/:tasklistId/tasks/:taskId', authentication, (req, res) => {
    TaskList.findOne({
        _id: req.params.tasklistId,
        _userId: req.user_id
    }).then((tasklist) => {
        if (tasklist) {
            // if list object with specified conditions is found -> authenticated user can delete tasks within list
            return true;
        }

        // else -> list object is undefined
        return false;
    }).then((canDeleteTasks) => {
        if (canDeleteTasks) {
            Task.findByIdAndRemove({
                _id: req.params.taskId,
                _tasklistId: req.params.tasklistId
            }).then((removedTaskDoc) => {
                res.send(removedTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    });
    
});

/*
Task.findByIdAndDelete({
        _id: req.params.taskId,
        _tasklistId: req.params.tasklistId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
*/

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

