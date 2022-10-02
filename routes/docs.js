const express = require('express');
const router = express.Router();

const docsModel = require("../models/docs");
const authModel = require("../models/auth");

// Get all documents
router.get(
    "/:user",
    (req, res, next) => authModel.checkToken(req, res, next),
    async (req, res) => {
        console.log("fetching docs")

        const user = req.params.user;
        const myDocs = await docsModel.getMyDocs(user);
        const sharedDocs = await docsModel.getSharedDocs(user);

        return res.json({
            data: {
                myDocs: myDocs,
                sharedDocs: sharedDocs
            }
        });
    }
);

// Create document
router.post(
    "/",
    async (req, res) => {
        const newDoc = req.body;
        newDoc.allowed = [];

        const result = await docsModel.insertDoc(newDoc);

        return res.status(201).json({ data: result });
    }
);

// Update document
router.put(
    "/",
    async (req, res) => {
        const doc = req.body;

        const result = await docsModel.updateDoc(doc);

        return res.status(204).json({ data: result });
    }
);

// Delete document
router.delete(
    "/",
    async (req, res) => {
        const doc = req.body;

        const result = await docsModel.deleteDoc(doc._id);

        return res.status(204).json({ data: result });
    }
);

// Invite user to document
router.put(
    "/invite",
    (req, res, next) => authModel.checkToken(req, res, next),
    async (req, res) => {
        const doc = req.body._id;
        const newUser = req.body.newUser;
        const result = await docsModel.invite(res, doc, newUser);

        return result
    }
);

// Remove user from document
router.put(
    "/remove",
    (req, res, next) => authModel.checkToken(req, res, next),
    async (req, res) => {
        const doc = req.body._id;
        const user = req.body.user;
        const result = await docsModel.remove(doc, user);

        return res.status(204).json({ data: result })
    }
);

module.exports = router;
