const express = require('express');
const router = express.Router();

const inviteModel = require("../models/invite");

// Get invite object
router.get(
    "/:id",
    async (req, res) => {
        const id = req.params.id;
        const result = await inviteModel.getInvite(id);
        
        return res.json({
            data: {
                invite: result
            }
        });
    }
);

// Create invite object
router.post(
    "/",
    async (req, res) => {
        const body = req.body;

        const result = await inviteModel.createInvite(body);

        return res.json({
            data: {
                invite: result
            }
        });
    }
);

// Delete invite object
router.delete(
    "/",
    async (req, res) => {
        const body = req.body;

        const result = await inviteModel.removeInvite(body.id);

        return res.json({
            data: {
                invite: result
            }
        });
    }
);



module.exports = router;
