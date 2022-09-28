const express = require('express');
const router = express.Router();

const authModel = require("../models/auth");

// Register a new user
router.post(
    "/register",
    async (req, res) => {
        const body = req.body;

        await authModel.register(res, body);
    }
);

// Login with an existing user
router.post(
    "/login",
    async (req, res) => {
        const body = req.body;

        await authModel.login(res, body);
    }
);

module.exports = router;
