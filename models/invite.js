const database        = require("../db/database.js");
const ObjectId        = require("mongodb").ObjectId;
const collectionName  = "invite";

const invite = {
    /**
     * Get a invite object
     */
    getInvite: async function getInvite(id) {
        let db;

        try {
            db = await database.getDb(collectionName);

            const inviteObject = await db.collection.findOne({_id: new ObjectId(id)});
    
            return inviteObject;
        } catch (error) {
            return {
                errors: {
                    message:error.message,
                }
            };
        } finally {
            await db.client.close();
        }
    },

    /**
     * Create invite object
     */
    createInvite: async function createInvite(body) {
        let db;
        
        try {
            db = await database.getDb(collectionName);
            
            const inviteObject = {
                email: body.email,
                document: body.document
            }

            const result = await db.collection.insertOne(inviteObject);

            return {
                ...inviteObject,
                _id: result.insertedId
            }
        } catch (error) {
            return {
                errors: {
                    message:error.message,
                }
            };
        } finally {
            await db.client.close();
        }
    },

    /**
     * Remove invite object
     */
    removeInvite: async function removeInvite(id) {
        let db;

        try {
            db = await database.getDb(collectionName);

            await db.collection.deleteOne({_id: new ObjectId(id)});
        } catch (error) {
            return {
                errors: {
                    message:error.message,
                }
            };
        } finally {
            await db.client.close();
        }
    }
};

module.exports = invite;
