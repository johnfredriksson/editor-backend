const express = require('express');
const router = express.Router();

const docsModel = require("../models/docs");

// Get all documents
router.get(
    "/",
    async (req, res) => {
        const docs = await docsModel.getAllDocs();

        return res.json({
            data: docs
        });
    }
);

// Create document
router.post(
    "/",
    async (req, res) => {
        const newDoc = req.body;

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

module.exports = router;
