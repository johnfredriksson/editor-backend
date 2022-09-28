const database        = require("../db/database.js");
const ObjectId        = require("mongodb").ObjectId;
const jwt             = require("jsonwebtoken");
const validator       = require("email-validator");
const bcrypt          = require("bcryptjs");
const saltRounds      = 10;
const collectionName  = "auth";

const auth = {
    /**
     * Register a new user
     * 
     * @param {object} res   Res object
     * @param {object} body  Body, containing an email and password
     * @returns 
     */
    register: async function register(res, body) {
        const email     = body.email;
        const password  = body.password;

        // Check if both fields are filled
        if (!email || !password) {
            return res.status(400).json({
                errors: {
                    status:  400,
                    message: "Email or password missing",
                }
            });
        }

        // Check if received email is valid
        if (!validator.validate(email)) {
            return res.status(400).json({
                errors: {
                    status:  400,
                    message: "Email is not valid",
                }
            });
        }

        // LÄGG TILL KONTROLL IFALL EMAIL REDAN FINNS REGISTRERAD //

        // Hash the received password and continue with registration
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status:  500,
                        message: "Could not hash password",
                    }
                });
            }

            let db = await database.getDb(collectionName);

            try {
                const doc = {
                    email:    email,
                    password: hash,
                };

                await db.collection.insertOne(doc);

                return res.status(201).json({
                    data: {
                        message: "User successfully created"
                    }
                });
            } catch (error) {
                return res.status(500).json({
                    errors: {
                        status:  500,
                        message: "Could not create user",
                    }
                });
            } finally {
                await db.client.close();
            }
        });
    },

    /**
     * Login with an existing user
     * 
     * @param {object} res   Res object
     * @param {object} body  Body object containing email and password
     * @returns 
     */
    login: async function login (res, body) {
        const email    = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(400).json({
                errors: {
                    status:  400,
                    message: "Email or password missing",
                }
            }); 
        }

        let db = await database.getDb(collectionName);

        try {
            const user = await db.collection.findOne({email: email});

            if (user) {
                return auth.comparePassword(res, user, password)
            }


            return res.status(401).json({
                data: {
                    message: "User does not exist",
                }
            });
        } catch (error) {
            return res.status(500).json({
                errors: {
                    status:  500,
                    message: "Could not find user",
                }
            });
        } finally {
            await db.client.close();
        }
    },

    /**
     * Compare received password with hashed one, upon success, user logs in
     * 
     * @param {object} res       Res object
     * @param {object} user      User object containing email and hashed password
     * @param {string} password  Received password to compare
     */
    comparePassword: async function comparePassword(res, user, password) {
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        message: "Could not decrypt password"
                    }
                });
            }


            if (result) {
                const payload = { email: user.email };
                const secret = process.env.JWT_SECRET;

                const token = jwt.sign(payload, secret, { expiresIn: '1h' });

                return res.status(201).json({
                    data: {
                        _id: user["_id"],
                        email: user.email,
                        token: token,
                    }
                });
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    message: "Password not correct"
                }
            });
        });
    },

    /**
     * Validate received token
     * 
     * @param {object} req    Req object
     * @param {object} res    Res object
     * @param {object} next   Next object
     */
    checkToken: function checkToken(req, res, next) {
        const token = req.headers['x-access-token'];

        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        message: "Token is not valid."
                    }
                });
            }

            // Valid token send on the request
            next();
        });
    }
};

module.exports = auth;
