const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  input Course {
    id: ID!
    name: String!
    status: String
  }

  input Competition {
    id: ID!
    name: String!
    status: String
  }

  input InputContent {
    course: Course
    competition: Competition
  }

  input ContentType {
    contents: [InputContent]
  }

  type ErrorMessage {
    message: String
  }

  type MutationResponse {
    error: ErrorMessage
  }

  type Content {
    id: ID
    name: String
    status: String
  }

  type Mutation {
    addContent(input: ContentType!): [Content]
  }

  type Query {
    hello: String
    contents: [Content!]!
  }
`;

let contents = [
  {
    id: 'id1',
    name: 'course1',
    status: 'available',
  },
  {
    id: 'id2',
    name: 'course2',
    status: 'unavailable',
  },
  {
    id: 'cid1',
    name: 'coomp1',
    status: 'ready',
  },
  {
    id: 'cid2',
    name: 'comp2',
    status: 'draft',
  },
];

const resolvers = {
  Content: {
    __resolveType: (obj) => {
      if (obj.title) {
        return 'Competition';
      }

      if (obj.name) {
        return 'Course';
      }

      return null;
    },
  },

  Query: {
    hello: () => 'hi',
    contents: () => contents,
  },
  Mutation: {
    addContent: (parent, args, context, info) => {
      const { contents: inputContents } = args.input;
      const res = inputContents.map(
        (content) => content[Object.keys(content)[0]]
      );
      return [...contents, ...res];
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
