const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLList
} = require('graphql');

const CommentType = new GraphQLObjectType({
    name: "Comment",
    description: "Fields for a comment",
    fields: () => ({
        text: { type: GraphQLString },
        color: { type: GraphQLString },
        ranges: { type: GraphQLString },
        author: { type: GraphQLString },
    })
})

module.exports = CommentType;
