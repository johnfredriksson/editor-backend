const database = require("../db/database.js");

const docs = {
    getAllDocs: async function getAllDocs() {
        let db;
        console.log("starting");

        try {
            console.log("trying");
            db = await database.getDb();

            const allDocs = await db.collection.find().toArray();
            console.log("collection is: " + allDocs);

            return allDocs;
        } catch (error) {
            console.log("catching");
            return {
                errors: {
                    message: error.message,
                }
            }
        } finally {
            console.log("closing");
            db.client.close();
        }
    },
    insertDoc: async function insertDoc(newDoc) {
        let db;
        console.log("inserting")

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
};

module.exports = docs;