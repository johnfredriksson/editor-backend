const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

const DocumentType = require("./document.js");
const documents = require("../models/docs.js");

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        document: {
            type: DocumentType,
            description: "A single document",
            args: {
                id: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                const document = await documents.getSingleDoc(args.id);

                return document;
            }
        },
        myDocs: {
            type: new GraphQLList(DocumentType),
            description: "get all of owned docs",
            args: {
                user: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                const myDocs = await documents.getMyDocs(args.user);

                return myDocs;
            }
        },
        sharedDocs: {
            type: new GraphQLList(DocumentType),
            description: "get all joined docs",
            args: {
                user: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                const sharedDocs = await documents.getSharedDocs(args.user);

                return sharedDocs;
            }
        }
    })
})

module.exports = RootQueryType;
