const graphql = require("graphql");
const _ = require("lodash");
const { usersData, hobbiesData, postsData } = require("./data");
const User = require("../models/user");
const Hobby = require("../models/hobby");
const Post = require("../models/post");

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
        return Post.find({ userId: parent.id });
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, _) {
        return Hobby.find({ userId: parent.id });
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
      resolve(parent, args) {
        return usersData.find((x) => x.id == parent.userId);
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
        return usersData.find((x) => x.id == parent.userId);
      },
    },
  }),
});
// !SECTION

// SECTION: Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        age: {
          type: GraphQLNonNull(GraphQLInt),
        },
        profession: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parent, args) {
        const user = User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });

        return user.save();
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLString),
        },
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        age: {
          type: GraphQLNonNull(GraphQLInt),
        },
        profession: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parent, args) {
        return (updatedUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession,
            },
          },
          { new: true } //send back the updated objectType
        ));
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parent, args) {
        const user = User.findByIdAndRemove(args.id).exec();
        if (!user) throw new "Error"();

        return user;
      },
    },
    createPost: {
      type: PostType,
      args: {
        comment: {
          type: GraphQLNonNull(GraphQLString),
        },
        userId: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parent, args) {
        const post = Post({
          comment: args.comment,
          userId: args.userId,
        });
        return post.save();
      },
    },
    updatePost: {
      type: PostType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLString),
        },
        comment: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parent, args) {
        return (updatedPost = Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment,
            },
          },
          { new: true }
        ));
      },
    },
    deletePost: {
      type: PostType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parent, args) {
        const post = Post.findByIdAndRemove(args.id).exec();
        if (!post) throw new "Error"();

        return post;
      },
    },
    createHobby: {
      type: HobbyType,
      args: {
        title: {
          type: GraphQLNonNull(GraphQLString),
        },
        description: {
          type: GraphQLNonNull(GraphQLString),
        },
        userId: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parent, args) {
        const hobby = Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });
        return hobby.save();
      },
    },
    updateHobby: {
      type: HobbyType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLString),
        },
        title: {
          type: GraphQLNonNull(GraphQLString),
        },
        description: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parent, args) {
        return (updatedHobby = Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
            },
          },
          { new: true }
        ));
      },
    },
    deleteHobby: {
      type: PostType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parent, args) {
        const hobby = Hobby.findByIdAndRemove(args.id).exec();
        if (!hobby) throw new "Error"();

        return hobby;
      },
    },

  },
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
        return User.findById(args.id);
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(_, args) {
        return Users.find();
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
  mutation: Mutation,
});
