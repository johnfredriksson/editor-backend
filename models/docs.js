const database = require("../db/database.js");
const ObjectId = require("mongodb").ObjectId;
const collectionName = "docs";


const docs = {
    // Fetch documents where user is author
    getMyDocs: async function getMyDocs(user) {
        let db;

        try {
            db = await database.getDb(collectionName);

            const allDocs = await db.collection.find({author: user}).toArray();

            return allDocs;
        } catch (error) {
            return {
                errors: {
                    message: error.message,
                }
            };
        } finally {
            db.client.close();
        }
    },
    // Fetch documents where user is allowed access but not author
    getSharedDocs: async function getSharedDocs(user) {
        let db;

        try {
            db = await database.getDb(collectionName);

            const allDocs = await db.collection.find({allowed: user}).toArray();

            return allDocs;
        } catch (error) {
            return {
                errors: {
                    message: error.message,
                }
            };
        } finally {
            db.client.close();
        }
    },
    // Fetch documents where user is author
    getSingleDoc: async function getSingleDoc(id) {
        let db;

        try {
            db = await database.getDb(collectionName);

            const doc = await db.collection.findOne({_id: new ObjectId(id)});

            return doc;
        } catch (error) {
            return {
                errors: {
                    message: error.message,
                }
            };
        } finally {
            db.client.close();
        }
    },
    // Create a new document
    insertDoc: async function insertDoc(newDoc) {
        let db;

        try {
            db = await database.getDb(collectionName);

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
    // Update a document
    updateDoc: async function updateDoc(doc) {
        let db;

        try {
            let result;

            db = await database.getDb(collectionName);

            result = await db.collection.updateOne({
                _id: new ObjectId(doc._id)
            }, {
                $set: {
                    title: doc.title,
                    content: doc.content
                }
            });
            return result;
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
    // Delete a document
    deleteDoc: async function deleteDoc(id) {
        let db;

        try {
            db = await database.getDb(collectionName);

            await db.collection.deleteOne({
                _id: new ObjectId(id)
            });
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
    // Invite a user to be allowed access to a document
    invite: async function invite(res, doc, newUser) {
        let db;
        let authdb = await database.getDb("auth");

        try {
            const user = await authdb.collection.findOne({email: newUser});

            if (user) {
                try {
                    let result;
        
                    db = await database.getDb(collectionName);
        
                    result = await db.collection.updateOne({
                        _id: new ObjectId(doc)
                    }, {
                        $push: {
                            allowed: newUser
                        }
                    });
                    return result;
                } catch (error) {
                    console.error(error.message);
                } finally {
                    await db.client.close();
                }
            }
            return res.status(401).json({
                errors: {
                    status: 400,
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
            await authdb.client.close();
        }
    },
    // Remove access from user for a document
    remove: async function remove(doc, user) {
        let db;

        try {
            let result;

            db = await database.getDb(collectionName);

            result = await db.collection.update({
                _id: new ObjectId(doc)
            }, {
                $pull: {
                    allowed: user
                }
            });
            return result;
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    }
};

module.exports = docs;
