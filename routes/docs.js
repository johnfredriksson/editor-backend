const express = require('express');
const router = express.Router();

const docsModel = require("../models/docs");

// Get all docs
router.get(
    "/documents",
    async (req, res) => {
        const wines = await winesModel.getAllDocs();

        return res.json({
            data: wines
        });
    }
);

// Get single doc
router.get(
    "/document",
    async (req, res) => {
        const wines = await winesModel.getSingleDoc();

        return res.json({
            data: wines
        });
    }
);

// Create doc
router.post(
    "/create",
    async (req, res) => {
        const newWine = req.body;

        const result = await winesModel.createDoc(newWine);

        return res.status(201).json({ data: result});
    }
);

// Update doc
router.put(
    "/update",
    async (req, res) => {
        const newWine = req.body;

        const result = await winesModel.updateDoc(newWine);

        return res.status(201).json({ data: result});
    }
);

module.exports = router;