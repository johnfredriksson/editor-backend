const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLList
} = require('graphql');

const DocumentType = new GraphQLObjectType({
    name: "Document",
    description: "Fields for a document",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        author: { type: GraphQLString },
        allowed: { type: new GraphQLList(GraphQLString) },
    })
})

module.exports = DocumentType;
