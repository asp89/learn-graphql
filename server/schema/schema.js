const graphql = require("graphql");
const _ = require("lodash");
const { usersData, hobbiesData, postsData } = require("./data");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// SECTION: Type
const UserType = new GraphQLObjectType({
  name: "User",
  description: "User documentation",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, _) {
        return postsData.filter((x) => x.userId == parent.id);
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, _) {
        return hobbiesData.filter((x) => x.userId == parent.id);
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "Hobby documentation",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(_, args) {
        return usersData.find((x) => x.userId == args.id);
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post description",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(_, args) {
        return usersData.find((x) => x.userId == args.id);
      },
    },
  }),
});
// !SECTION

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Root Query Type",
  fields: () => ({
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },

      // NOTE: Resolver is a function that resolves a value for a type or field in a schema.
      // Resolvers can return objects or scalars like Strings, Numbers, Booleans, etc.
      // If an Object is returned, execution continues to the next child field.
      // If a scalar is returned (typically at a leaf node), execution completes.
      resolve(_, args) {
        return usersData.find((x) => x.id == args.id);
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(_, args) {
        return usersData;
      },
    },

    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return hobbiesData.find((x) => x.id == args.id);
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return hobbiesData.find((x) => x.userId == args.userId);
      },
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return postsData.find((x) => x.id == args.id);
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return postsData.find();
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
