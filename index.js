const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  input Course {
    id: ID!
    name: String!
    status: String
  }

  input Competition {
    id: ID!
    title: String!
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
    title: String
    content: String
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
    title: 'coomp1',
    status: 'ready',
  },
  {
    id: 'cid2',
    title: 'comp2',
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
    content: (parent) => {
      if (parent.name === null) {
        return parent.title;
      }
      return parent.name;
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
      const result = [...contents, ...res].map((data) => {
        if (!data['name']) {
          return {
            ...data,
            name: null,
          };
        }
        if (!data['title']) {
          return {
            ...data,
            title: null,
          };
        }
      });
      return result;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
