const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const bcrypt = require('bcryptjs');

// JWT Secret
const jwtSecret = "4le6e0ivh9wtrrgbp911j53t41e3ssyixlef13g4rw379z1pzra9oc8niq8w";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    sessions: [{ // Session objects contain refresh token and its expiry DateTime
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
});

// Instance Methods

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    // Returns the doc except password and sessions (password and sessions should be priavte)
    return _.omit(userObject, ['password', 'sessions']);
}

// Generates access token

UserSchema.methods.generateAccessAuthToken = function () {
    const user = this;
    return new Promise((resolve, reject) => {
        // Creates JSON Web Token
        jwt.sign({ _id: user._id.toHexString() }, jwtSecret, { expiresIn: "15m" }, (err, token) => {
            if (!err) { // returns JSON Web Token
                resolve(token);
            } else {
                // rejects webtoken; there is an error
                reject();
            }
        })
    })
}

UserSchema.methods.generateRefreshAuthToken = function () {
    // Generates 64byte hex string; Doesn't save it to the database; saveSessionToDatabase() does that.
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                // no error; gets token from the buffer in hex format
                let token = buf.toString('hex');

                return resolve(token);
            }
        })
    })
}

UserSchema.methods.createSession = function () {
    let user = this;

    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        // saved to database successfully
        // now return the refresh token
        return refreshToken;
    }).catch((e) => {
        return Promise.reject('Failed to save session to database.\n' + e);
    })
}

// Model/Static Methods

UserSchema.statics.getJWTSecret = () => {
    return jwtSecret;
}

UserSchema.statics.findByIdAndToken = function (_id, token) {
    // Used in Auth Middleware (sessionVerfication)

    const User = this;

    return User.findOne({
        _id,
        'sessions.token': token
    });
}

UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) return Promise.reject();

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                }
                else {
                    reject();
                }
            })
        })
    })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000; // to get seconds
    if (expiresAt > secondsSinceEpoch) {
        // not expired
        return false;
    } else {
        // expired
        return true;
    }
}


// Middleware; this is ran before the user doc is saved
UserSchema.pre('save', function (next) {
    let user = this;
    let costFactor = 10; // 10 = # of hashing rounds aka how long it takes to hash password

    if (user.isModified('password')) {
        // if password has been edited/changed then run this

        // Generates salt & hash password
        bcrypt.genSalt(costFactor, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
});




// Helper Methods

let saveSessionToDatabase = (user, refreshToken) => {
    // Saves session to database
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime();

        user.sessions.push({ 'token': refreshToken, expiresAt });

        user.save().then(() => {
            // Session is successfully saved
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        });
    })
}

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10"; //10 days until refresh token expires
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    return ((Date.now() / 1000) + secondsUntilExpire);
}

const User = mongoose.model('User', UserSchema);

module.exports = { User }