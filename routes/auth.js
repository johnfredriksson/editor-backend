const express = require('express');
const router = express.Router();

const authModel = require("../models/auth");

// Register a new user
router.post(
    "/register",
    async (req, res) => {
        const body = req.body;

        const result = await authModel.register(res, body);

        return result
    }
);

// Login with an existing user
router.post(
    "/login",
    async (req, res) => {
        const body = req.body;

        const result = await authModel.login(res, body);

        return result
    }
);

// Validate jwt token
router.get(
    "/token",
    (req, res, next) => authModel.checkToken(req, res, next),
    async (req, res) => {
        const result = authModel.checkToken(req, res, next);

        console.log(result)

        return result
    }
);


module.exports = router;
