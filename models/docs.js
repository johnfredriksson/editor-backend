const database = require("../db/database.js");
const ObjectId = require("mongodb").ObjectId;

const docs = {
    getAllDocs: async function getAllDocs() {
        let db;

        try {
            db = await database.getDb();

            const allDocs = await db.collection.find().toArray();

            return allDocs;
        } catch (error) {
            return {
                errors: {
                    message: error.message,
                }
            }
        } finally {
            db.client.close();
        }
    },
    insertDoc: async function insertDoc(newDoc) {
        let db;

        try {
            db = await database.getDb();

            const result = await db.collection.insertOne(newDoc);

            return {
                ...newDoc,
                _id: result.insertedId,
            };
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
    updateDoc: async function updateDoc(doc) {
        let db;

        try {
            db = await database.getDb();

            // console.log("received doc is: " + doc._id)

            const result = await db.collection.updateOne({
                _id: new ObjectId(doc._id)
            }, {
                $set: {
                    title: doc.title,
                    content: doc.content
                }
            })
            return doc;
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
    deleteDoc: async function deleteDoc(id) {
        let db;

        try {
            db = await database.getDb();

            const result = await db.collection.deleteOne({
                _id: new ObjectId(id)
            })
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
};

module.exports = docs;